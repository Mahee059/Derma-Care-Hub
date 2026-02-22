import apiClient from "../api.client";
import {
  ProgressLogData,
  ProgressComparisonData,
  ProgressLogResponse,
} from "../../lib/types";


interface CreateProgressLogPayload {
  image?: File;
  notes?: string;
  concerns: string;
  rating: number;
}

const progressService = {
  getLogs: async (): Promise<ProgressLogData[]> => {
    const { data } = await apiClient.get("/api/progress");
    return data.logs;
  },

  createLog: async (
    payload: CreateProgressLogPayload
  ): Promise<ProgressLogData> => {
    const formData = new FormData();

    if (payload.image) {
      formData.append("image", payload.image);
    }
    if (payload.notes) {
      formData.append("notes", payload.notes);
    }
    formData.append("concerns", payload.concerns);
    formData.append("rating", String(payload.rating));

    const { data } = await apiClient.post<ProgressLogResponse>(
      "/api/progress",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!data.success || !data.log) {
      throw new Error(data.message || "Failed to create progress log");
    }

    return data.log;
  },

  deleteLog: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/progress/${id}`);
  },

  getComparison: async (
    fromDate: string,
    toDate: string
  ): Promise<ProgressComparisonData> => {
    const { data } = await apiClient.get("/api/progress/comparison", {
      params: { fromDate, toDate },
    });
    return data;
  },
};

export default progressService;
