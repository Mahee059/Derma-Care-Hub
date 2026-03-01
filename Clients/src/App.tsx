import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import { Toaster } from "./components/ui/sonner";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SkinCare101 from "./pages/SkinCare101";
import AboutUs from "./pages/AboutUS";
import Profile from "./pages/Profile";
import SkinAssessment from "./pages/user/skin.assessment";
import Routines from "./pages/user/routines";
import ProgressTracker from "./pages/user/progress.tracker";
import ProductExplorer from "./pages/user/product.explorer";
import AIRecommendations from "./pages/user/AI.recommendations";

import DermotologistAppointments from "./pages/dermatologist/Appointment";
import Chat from "./pages/dermatologist/chat";
import Patients from "./pages/dermatologist/patient";
import PatientDetails from "./pages/dermatologist/patient.details";
import AdminDashboard from "./pages/admin/dashboard";
import ManageProducts from "./pages/admin/manage.products";
import ManageUsers from "./pages/admin/manage.users";
import Footer from "./components/ui/Footer";
import UserDashboard from "./pages/user/dashboard";
import UserChat from "./pages/user/chat";
import DermatologistsDashboard from "./pages/dermatologist/dashboard";
import ProtectedRoute from "./components/middleware/ProtectedRoute";
import Appointments from "./pages/dermatologist/Appointment";



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <Toaster richColors />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/skincare-101" element={<SkinCare101 />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/Profile" element={<Profile />} />

          {/* User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute
                element={<UserDashboard />}
                allowedRoles={["USER"]}
              />
            }
          />
          <Route
            path="/user/skin-assessment"
            element={
              <ProtectedRoute
                element={<SkinAssessment />}
                allowedRoles={["USER"]}
              />
            }
          />
          <Route
            path="/user/routines"
            element={
              <ProtectedRoute element={<Routines />} allowedRoles={["USER"]} />
            }
          />
          <Route
            path="/user/progress"
            element={
              <ProtectedRoute
                element={<ProgressTracker />}
                allowedRoles={["USER"]}
              />
            }
          />
          <Route
            path="/user/products"
            element={
              <ProtectedRoute
                element={<ProductExplorer />}
                allowedRoles={["USER"]}
              />
            }
          />
          <Route
            path="/user/chat"
            element={
              <ProtectedRoute element={<UserChat />} allowedRoles={["USER"]} />
            }
          />
          <Route
            path="/user/ai-recommendations"
            element={
              <ProtectedRoute
                element={<AIRecommendations />}
                allowedRoles={["USER"]}
              />
            }
          />
          <Route
            path="/user/appointments"
            element={
              <ProtectedRoute
                element={<Appointments />}
                allowedRoles={["USER"]}
              />
            }
          />

          {/* Dermatologist Routes */}
          <Route
            path="/dermatologist/dashboard"
            element={
              <ProtectedRoute
                element={<DermatologistsDashboard />}
                allowedRoles={["DERMATOLOGISTS"]}
              />
            }
          />
          <Route
            path="/dermatologist/chat"
            element={
              <ProtectedRoute
                element={<Chat />}
                allowedRoles={["DERMATOLOGISTS"]}
              />
            }
          />
          <Route
            path="/dermatologist/appointments"
            element={
              <ProtectedRoute
                element={<DermotologistAppointments />}
                allowedRoles={["DERMATOLOGISTS"]}
              />
            }
          />
          <Route
            path="/dermatologist/patients"
            element={
              <ProtectedRoute
                element={<Patients />}
                allowedRoles={["DERMATOLOGISTS"]}
              />
            }
          />
          <Route
            path="/dermatologist/patients/:id"
            element={
              <ProtectedRoute
                element={<PatientDetails />}
                allowedRoles={["DERMATOLOGISTS"]}
              />
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute
                element={<AdminDashboard />}
                allowedRoles={["ADMIN"]}
              />
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute
                element={<ManageProducts />}
                allowedRoles={["ADMIN"]}
              />
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute
                element={<ManageUsers />}
                allowedRoles={["ADMIN"]}
              />
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

