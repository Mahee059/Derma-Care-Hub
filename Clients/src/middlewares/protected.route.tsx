import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({
  element,
  allowedRoles,
}: {
  element: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { isAuthenticated, userData } = useContext(AppContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userData && !allowedRoles.includes(userData.role)) {
    // Redirect to appropriate dashboard based on role
    if (userData.role === "USER") {
      return <Navigate to="/user/dashboard" replace />;
    } else if (userData.role === "DERMATOLOGISTS") {
      return <Navigate to="/dermatologist/dashboard" replace />;
    } else if (userData.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <>{element}</>;
};

export default ProtectedRoute;
