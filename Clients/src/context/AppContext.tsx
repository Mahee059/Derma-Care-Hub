import React, { createContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { SkinProfileData, UserData } from "../lib/types";
import authService from "../api/services/auth.service";

interface AppContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  backendUrl: string;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  skinProfile: SkinProfileData | null;
  setSkinProfile: React.Dispatch<React.SetStateAction<SkinProfileData | null>>;
  isAuthenticated: boolean;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [userData, setUserData] = useState<UserData | null>(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [skinProfile, setSkinProfile] = useState<SkinProfileData | null>(null);

  const isAuthenticated = !!token && !!userData;

  const logout = () => {
    authService.logout();
    toast.success("Logged Out Successfully");
    setToken(null);
    setUserData(null);
    setSkinProfile(null);
  };

  // Fetch user data when token exists but userData doesn't
  useEffect(() => {
    const fetchUser = async () => {
      if (token && !userData) {
        setIsLoading(true);
        try {
          const user = await authService.getCurrentUser();
          setUserData(user);
          localStorage.setItem("userData", JSON.stringify(user));
        } catch (error) {
          console.error("Failed to fetch user:", error);
          logout();
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
  }, [token, userData, setIsLoading]);

  // Update localStorage when token or userData changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [token, userData]);

  const value = {
    isLoading,
    setIsLoading,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    skinProfile,
    setSkinProfile,
    isAuthenticated,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;