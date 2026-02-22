import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Check, X, Clock } from "lucide-react";
import { UserData } from "../../lib/types";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import adminService from "../../api/services/admin.service";

interface PendingDermatologistsProps {
  dermatologists: UserData[];
  onApprove: () => void;
}

export function PendingDermatologists({
  dermatologists,
  onApprove,
}: PendingDermatologistsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDermatologist, setSelectedDermatologist] =
    useState<UserData | null>(null);
  const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      setIsLoading(true);
      await adminService.approveDermatologist(id, status);
      toast.success(
        `Dermatologist ${status.toLowerCase()} successfully. Email notification sent.`
      );
      onApprove();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating dermatologist status:", error);
      toast.error("Failed to update dermatologist status");
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirmDialog = (
    dermatologist: UserData,
    action: "APPROVED" | "REJECTED"
  ) => {
    setSelectedDermatologist(dermatologist);
    setActionType(action);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card className="mb-8 border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Clock className="w-5 h-5" />
            Pending Dermatologist Approvals
          </CardTitle>
          <CardDescription className="text-amber-700">
            {dermatologists.length} dermatologist
            {dermatologists.length !== 1 ? "s" : ""} waiting for approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>License ID</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dermatologists.map((dermatologist) => (
                  <TableRow key={dermatologist.id}>
                    <TableCell className="font-medium">
                      {dermatologist.name}
                    </TableCell>
                    <TableCell>{dermatologist.email}</TableCell>
                    <TableCell>{dermatologist.dermatologistId}</TableCell>
                    <TableCell>
                      {new Date(dermatologist.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            openConfirmDialog(dermatologist, "APPROVED")
                          }
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            openConfirmDialog(dermatologist, "REJECTED")
                          }
                          disabled={isLoading}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "APPROVED" ? "Approve" : "Reject"} Dermatologist
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType?.toLowerCase()} Dr.{" "}
              {selectedDermatologist?.name}?
              {actionType === "APPROVED"
                ? " They will receive login access and an email confirmation."
                : " They will be notified via email about the rejection."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === "APPROVED" ? "default" : "destructive"}
              onClick={() =>
                selectedDermatologist &&
                actionType &&
                handleAction(selectedDermatologist.id, actionType)
              }
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : `${actionType === "APPROVED" ? "Approve" : "Reject"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
