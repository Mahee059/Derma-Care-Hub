
import { AdminStats, UserData } from "../../lib/types";
import apiClient from "../api.client";

const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await apiClient.get("/api/admin/stats");
    return data.stats;
  },

  getAllUsers: async (): Promise<UserData[]> => {
    const { data } = await apiClient.get("/api/admin/users");
    return data.users;
  },
  getPendingDermatologists: async (): Promise<UserData[]> => {
    const { data } = await apiClient.get("/api/admin/pending-dermatologists");
    return data.dermatologists;
  },

  approveDermatologist: async (
    id: string,
    status: "APPROVED" | "REJECTED"
  ): Promise<UserData> => {
    const { data } = await apiClient.patch(
      `/api/admin/dermatologists/${id}/approve`,
      {
        status,
      }
    );
    return data.user;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/admin/users/${id}`);
  },

  updateUserRole: async (id: string, role: string): Promise<UserData> => {
    const { data } = await apiClient.patch(`/api/admin/users/${id}/role`, {
      role,
    });
    return data.user;
  },
};

export default adminService;
