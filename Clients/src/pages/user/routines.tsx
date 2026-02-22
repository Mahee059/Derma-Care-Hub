import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Calendar, Plus, Sparkles } from "lucide-react";
import { RoutineData } from "../../lib/types";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { routineFormSchema, RoutineFormValues } from "../../lib/validators";
import routineService from "../../api/services/routine.service";
import RoutineCard from "../../components/routines/routine.card";


export default function Routines() {
  const { setIsLoading } = useContext(AppContext);
  const [routines, setRoutines] = useState<RoutineData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [editingRoutine, setEditingRoutine] = useState<RoutineData | null>(
    null
  );

  // Initialize form
  const form = useForm<RoutineFormValues>({
    resolver: zodResolver(routineFormSchema),
    defaultValues: {
      name: "",
      type: "",
    },
  });

  // Fetch routines
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        setIsLoading(true);
        setIsLocalLoading(true);
        const data = await routineService.getRoutines();
        setRoutines(data);
      } catch (error) {
        console.error("Error fetching routines:", error);
        toast.error("Failed to load your routines");
      } finally {
        setIsLoading(false);
        setIsLocalLoading(false);
      }
    };
    fetchRoutines();
  }, [setIsLoading]);

  // Handle edit routine
  const handleEditRoutine = (routine: RoutineData) => {
    setEditingRoutine(routine);
    form.reset({
      name: routine.name,
      type: routine.type,
    });
    setIsDialogOpen(true);
  };

  // Create or update routine
  const onSubmit = async (values: RoutineFormValues) => {
    try {
      setIsLoading(true);
      if (editingRoutine) {
        // Update existing routine
        const updatedRoutine = await routineService.updateRoutine(
          editingRoutine.id,
          values
        );
        setRoutines(
          routines.map((r) => (r.id === editingRoutine.id ? updatedRoutine : r))
        );
        toast.success("Routine updated successfully!");
      } else {
        // Create new routine
        const newRoutine = await routineService.createRoutine(values);
        setRoutines([...routines, newRoutine]);
        toast.success("Routine created successfully!");
      }
      setIsDialogOpen(false);
      setEditingRoutine(null);
      form.reset();
    } catch (error) {
      console.error("Error saving routine:", error);
      toast.error(
        editingRoutine ? "Failed to update routine" : "Failed to create routine"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete routine
  const handleDeleteRoutine = async (id: string) => {
    try {
      setIsLoading(true);
      await routineService.deleteRoutine(id);
      setRoutines(routines.filter((routine) => routine.id !== id));
      toast.success("Routine deleted successfully");
    } catch (error) {
      console.error("Error deleting routine:", error);
      toast.error("Failed to delete routine");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingRoutine(null);
      form.reset({
        name: "",
        type: "",
      });
    }
    setIsDialogOpen(open);
  };

  // Routine types
  const routineTypes = [
    { value: "Morning", label: "Morning Routine" },
    { value: "Night", label: "Night Routine" },
    { value: "Weekly", label: "Weekly Treatment" },
    { value: "Special", label: "Special Occasion" },
  ];

  if (isLocalLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Sparkles className="w-12 h-12 mb-4 text-primary animate-pulse" />
          <p>Loading your routines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col gap-2 mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-transparent md:text-3xl bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text">
            My Skincare Routines
          </h1>
          <p className="text-foreground/70">
            Create and manage your personalized skincare regimens
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Routine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRoutine ? "Edit Routine" : "Create New Routine"}
              </DialogTitle>
              <DialogDescription>
                {editingRoutine
                  ? "Update your skincare routine"
                  : "Add a new skincare routine to your collection."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routine Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g., Brightening Morning Routine"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routine Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a routine type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {routineTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingRoutine ? "Update Routine" : "Create Routine"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {routines.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/30">
          <Calendar className="w-12 h-12 mb-4 text-primary" />
          <h3 className="mb-2 text-xl font-semibold">No Routines Yet</h3>
          <p className="mb-6 text-foreground/70">
            Start by creating your first skincare routine
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Routine
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onEdit={() => handleEditRoutine(routine)}
              onDelete={handleDeleteRoutine}
            />
          ))}
        </div>
      )}
    </div>
  );
}
