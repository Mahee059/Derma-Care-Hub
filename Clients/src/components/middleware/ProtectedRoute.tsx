import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
  const { isAuthenticated, userData } = useContext(AppContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!userData) {
    return null; 
  }

  if (!allowedRoles.includes(userData.role)) {
    const roleDashboards: Record<string, string> = {
      USER: "/user/dashboard",
      DERMATOLOGISTS: "/dermatologist/dashboard",
      ADMIN: "/admin/dashboard",
    };

    return <Navigate to={roleDashboards[userData.role] || "/"} replace />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;