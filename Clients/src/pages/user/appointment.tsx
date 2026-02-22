import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Plus, Calendar } from "lucide-react";
import { toast } from "sonner";
import { AppointmentData, UserData } from "../../lib/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textaera";
import appointmentService from "../../api/services/appointment.service";
import dermotologistService from "../../api/services/dermotologist.service";

export default function Appointments() {
  const { setIsLoading } = useContext(AppContext);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [dermatologists, setDermatologists] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDermatologist, setSelectedDermatologist] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [notes, setNotes] = useState("");

  const fetchDermatologists = async () => {
    try {
      const data = await dermotologistService.getDermatologists();
      setDermatologists(data);
    } catch (error) {
      console.error("Error fetching dermatologists:", error);
      toast.error("Failed to load dermatologists");
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const data = await appointmentService.getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to load appointments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
    fetchDermatologists();
  }, [setIsLoading]);

  const handleCreateAppointment = async () => {
    try {
      if (!selectedDermatologist || !selectedDate) {
        toast.error("Please select a dermatologist and date");
        return;
      }

      setIsLoading(true);
      await appointmentService.createAppointment({
        dermatologistId: selectedDermatologist,
        date: selectedDate,
        notes,
      });

      toast.success("Appointment created successfully");
      setIsDialogOpen(false);
      setSelectedDermatologist("");
      setSelectedDate("");
      setNotes("");
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to create appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      setIsLoading(true);
      await appointmentService.deleteAppointment(id);
      toast.success("Appointment cancelled successfully");
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.dermatologist.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col gap-2 mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-transparent md:text-3xl bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text">
            My Appointments
          </h1>
          <p className="text-foreground/70">
            Schedule and manage your dermatologist appointments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Appointment</DialogTitle>
              <DialogDescription>
                Book a consultation with a dermatologist
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select Dermatologist
                </label>
                <Select
                  value={selectedDermatologist}
                  onValueChange={setSelectedDermatologist}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a dermatologist" />
                  </SelectTrigger>
                  <SelectContent>
                    {dermatologists.map((dermatologist) => (
                      <SelectItem
                        key={dermatologist.id}
                        value={dermatologist.id}
                      >
                        {dermatologist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <Textarea
                  placeholder="Add any specific concerns or notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleCreateAppointment}>
                Schedule Appointment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-4">
        <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-foreground/50" />
        <Input
          className="pl-10"
          placeholder="Search appointments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dermatologist</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <div className="flex flex-col items-center py-6">
                    <Calendar className="w-12 h-12 mb-4 text-foreground/30" />
                    <p className="mb-2 font-medium">No appointments found</p>
                    <p className="text-sm text-foreground/70">
                      Schedule your first appointment with a dermatologist
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {appointment.dermatologist.name}
                      </p>
                      <p className="text-sm text-foreground/70">
                        {appointment.dermatologist.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(appointment.date).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        appointment.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </TableCell>
                  <TableCell>{appointment.notes || "No notes"}</TableCell>
                  <TableCell>
                    {appointment.status !== "CANCELLED" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
