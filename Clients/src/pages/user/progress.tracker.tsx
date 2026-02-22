import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Camera, Plus, Sparkles } from "lucide-react";
import { ProgressLogData, ProgressLogFormValues } from "../../lib/types";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";

import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { progressLogSchema } from "../../lib/validators";
import { Textarea } from "../../components/ui/textaera";
import progressService from "../../api/services/progess.service";

export default function ProgressTracker() {
  const { setIsLoading } = useContext(AppContext);
  const [logs, setLogs] = useState<ProgressLogData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [viewingLog, setViewingLog] = useState<ProgressLogData | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Initialize form
  const form = useForm<ProgressLogFormValues>({
    resolver: zodResolver(progressLogSchema),
    defaultValues: {
      image: undefined,
      notes: "",
      concerns: "",
      rating: 3,
    },
  });

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  // Fetch progress logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        setIsLocalLoading(true);
        const data = await progressService.getLogs();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching progress logs:", error);
        toast.error("Failed to load your progress logs");
      } finally {
        setIsLoading(false);
        setIsLocalLoading(false);
      }
    };
    fetchLogs();
  }, [setIsLoading]);

  // Create new progress log
  const onSubmit = async (values: ProgressLogFormValues) => {
    try {
      if (!values.concerns || !values.rating) {
        toast.error("Please select a concern and rating");
        return;
      }

      setIsLoading(true);
      const newLog = await progressService.createLog({
        image: values.image,
        notes: values.notes,
        concerns: values.concerns,
        rating: values.rating,
      });
      setLogs((prevLogs) => [...prevLogs, newLog]);
      toast.success("Progress log created successfully");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating progress log:", error);
      toast.error("Failed to create progress log");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete log
  const handleDeleteLog = async (id: string) => {
    try {
      setIsLoading(true);
      await progressService.deleteLog(id);
      setLogs(logs.filter((log) => log.id !== id));
      setIsViewDialogOpen(false);
      toast.success("Progress log deleted successfully");
    } catch (error) {
      console.error("Error deleting progress log:", error);
      toast.error("Failed to delete progress log");
    } finally {
      setIsLoading(false);
    }
  };

  // View log details
  const handleViewLog = (log: ProgressLogData) => {
    setViewingLog(log);
    setIsViewDialogOpen(true);
  };

  // Skin concerns options
  const skinConcernsOptions = [
    { value: "ACNE", label: "Acne" },
    { value: "AGING", label: "Aging/Fine Lines" },
    { value: "PIGMENTATION", label: "Pigmentation" },
    { value: "SENSITIVITY", label: "Sensitivity" },
    { value: "DRYNESS", label: "Dryness" },
    { value: "OILINESS", label: "Oiliness" },
    { value: "REDNESS", label: "Redness" },
    { value: "UNEVEN_TEXTURE", label: "Uneven Texture" },
  ];

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Group logs by month
  const groupedLogs = logs.reduce((groups, log) => {
    const date = new Date(log.createdAt);
    const month = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!groups[month]) {
      groups[month] = [];
    }

    groups[month].push(log);
    return groups;
  }, {} as Record<string, ProgressLogData[]>);

  if (isLocalLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Sparkles className="w-12 h-12 mb-4 text-primary animate-pulse" />
          <p>Loading your progress logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col gap-2 mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-transparent md:text-3xl bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text">Progress Tracker</h1>
          <p className="text-foreground/70">
            Track your skin's improvement over time
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Progress Log</DialogTitle>
              <DialogDescription>
                Document your skin's current condition.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                encType="multipart/form-data"
              >
                <FormField
                  control={form.control}
                  name="image"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Upload Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="concerns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Concern</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your primary concern" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {skinConcernsOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skin Condition Rating (1-5)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="py-4"
                          />
                          <div className="flex justify-between text-xs text-foreground/70">
                            <span>Poor</span>
                            <span>Excellent</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="E.g., My skin feels hydrated today. The redness has reduced significantly."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Add Log</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/30">
          <Camera className="w-12 h-12 mb-4 text-primary" />
          <h3 className="mb-2 text-xl font-semibold">No Progress Logs Yet</h3>
          <p className="mb-6 text-foreground/70">
            Start tracking your skin's progress by adding your first entry
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedLogs).map(([month, monthLogs]) => (
            <div key={month}>
              <h2 className="mb-4 text-xl font-semibold">{month}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {monthLogs.map((log) => (
                  <Card
                    key={log.id}
                    className="overflow-hidden transition-all cursor-pointer hover:shadow-md"
                    onClick={() => handleViewLog(log)}
                  >
                    {log.imageUrl ? (
                      <div className="aspect-square bg-muted">
                        <img
                          src={log.imageUrl}
                          alt="Skin progress"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center aspect-square bg-muted">
                        <Camera className="w-12 h-12 text-foreground/30" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">
                          {formatDate(new Date(log.createdAt))}
                        </p>
                        <div className="flex">
                          {Array.from({ length: log.rating }).map((_, i) => (
                            <Sparkles
                              key={i}
                              className="w-4 h-4 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="px-2 py-1 text-xs rounded-full text-primary-foreground bg-primary">
                          {log.concerns
                            .toString()
                            .replace("_", " ")
                            .toLowerCase()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Log Dialog */}
      {viewingLog && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Progress Log Details</DialogTitle>
              <DialogDescription>
                {formatDate(new Date(viewingLog.createdAt))}
              </DialogDescription>
            </DialogHeader>
            {viewingLog.imageUrl ? (
              <img
                src={viewingLog.imageUrl}
                alt="Skin progress"
                className="object-cover w-full h-64 rounded-md"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-64 rounded-md bg-muted">
                <Camera className="w-12 h-12 text-foreground/30" />
              </div>
            )}
            <div className="space-y-2">
              <div>
                <strong>Primary Concern:</strong>{" "}
                {viewingLog.concerns.replace("_", " ").toLowerCase()}
              </div>
              <div>
                <strong>Skin Condition Rating:</strong> {viewingLog.rating}/5
              </div>
              {viewingLog.notes && (
                <div>
                  <strong>Notes:</strong> {viewingLog.notes}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => handleDeleteLog(viewingLog.id)}
              >
                Delete Log
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
