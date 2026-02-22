
import { AppointmentData } from "../../lib/types";
import apiClient from "../api.client";

const appointmentService = {
  getAppointments: async (): Promise<AppointmentData[]> => {
    const { data } = await apiClient.get("/api/appointments");
    return data.appointments;
  },

  createAppointment: async (payload: {
    dermatologistId: string;
    date: string;
    notes?: string;
  }): Promise<AppointmentData> => {
    const { data } = await apiClient.post("/api/appointments", payload);
    return data.appointment;
  },

  updateStatus: async (
    id: string,
    status: string
  ): Promise<AppointmentData> => {
    const { data } = await apiClient.patch(`/api/appointments/${id}/status`, {
      status,
    });
    return data.appointment;
  },

  deleteAppointment: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/appointments/${id}`);
  },
};

export default appointmentService;
