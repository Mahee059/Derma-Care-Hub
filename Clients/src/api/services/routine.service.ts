
import { RoutineData } from "../../lib/types";
import apiClient from "../api.client";

interface CreateRoutinePayload {
  name: string;
  type: string;
}

interface AddRoutineStepPayload {
  routineId: string;
  productId: string;
  stepOrder: number;
  notes?: string;
}

const routineService = {
  getRoutines: async (): Promise<RoutineData[]> => {
    const { data } = await apiClient.get("/api/routines");
    return data.routines;
  },

  getRoutineById: async (id: string): Promise<RoutineData> => {
    const { data } = await apiClient.get(`/api/routines/${id}`);
    return data.routine;
  },

  createRoutine: async (
    payload: CreateRoutinePayload
  ): Promise<RoutineData> => {
    const { data } = await apiClient.post("/api/routines", payload);
    return data.routine;
  },

  updateRoutine: async (
    id: string,
    payload: Partial<CreateRoutinePayload>
  ): Promise<RoutineData> => {
    const { data } = await apiClient.put(`/api/routines/${id}`, payload);
    return data.routine;
  },

  deleteRoutine: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/routines/${id}`);
  },

  addRoutineStep: async (
    payload: AddRoutineStepPayload
  ): Promise<RoutineData> => {
    const { data } = await apiClient.post("/api/routines/steps", payload);
    return data.step;
  },

  deleteRoutineStep: async (stepId: string): Promise<void> => {
    await apiClient.delete(`/api/routines/steps/${stepId}`);
  },
};

export default routineService;
