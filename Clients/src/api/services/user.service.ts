
import { UserData } from "../../lib/types";
import apiClient from "../api.client";

const userService = {
  updateProfile: async (formData: FormData): Promise<{ user: UserData }> => {
    const { data } = await apiClient.put("/api/user/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  deleteProfile: async (password: string): Promise<void> => {
    await apiClient.delete("/api/user/profile", {
      data: { password },
    });
  },
};

export default userService;
