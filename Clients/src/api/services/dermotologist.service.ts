
import {
  DermatologistStats,
  Patient,
  DermatologistActivity,
  UserData,
} from "../../lib/types";
import apiClient from "../api.client";

const dermotologistService = {
  getPatients: async (): Promise<Patient[]> => {
    const { data } = await apiClient.get("/api/dermotologist/patients");
    return data.patients;
  },

  getPatientDetails: async (id: string): Promise<Patient> => {
    const { data } = await apiClient.get(`/api/dermotologist/patients/${id}`);
    return data.patient;
  },

  getStats: async (): Promise<DermatologistStats> => {
    const { data } = await apiClient.get("/api/dermotologist/stats");
    return data.stats;
  },

  getRecentActivity: async (): Promise<DermatologistActivity[]> => {
    const { data } = await apiClient.get("/api/dermotologist/activity");
    return data.activities;
  },

  getDermatologists: async (): Promise<UserData[]> => {
    const { data } = await apiClient.get("/api/user/dermotologist");
    return data.users;
  },
};

export default dermotologistService;
