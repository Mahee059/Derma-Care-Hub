import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles,
  Menu,
  UserCircle,
  LogOut,
  Home,
  Calendar,
  Droplets,
  Camera,
  Settings,
  Search,
  MessageSquare,
  Bot,
} from "lucide-react";

import NotificationCenter from "../notification/NotificationCenter";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { AppContext } from "../../context/AppContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userData, logout } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { to: "/", label: "Home", icon: <Home className="mr-2 h-5 w-5" /> },
        {
          to: "/skincare-101",
          label: "Skincare 101",
          icon: <Droplets className="mr-2 h-5 w-5" />,
        },
        {
          to: "/about-us",
          label: "About Us",
          icon: <UserCircle className="mr-2 h-5 w-5" />,
        },
      ];
    }

    if (userData?.role === "USER") {
      return [
        { to: "/user/dashboard", label: "Dashboard", icon: <Home className="mr-2 h-5 w-5" /> },
        { to: "/user/skin-assessment", label: "Skin Assessment", icon: <Search className="mr-2 h-5 w-5" /> },
        { to: "/user/routines", label: "My Routines", icon: <Calendar className="mr-2 h-5 w-5" /> },
        { to: "/user/progress", label: "Progress Tracker", icon: <Camera className="mr-2 h-5 w-5" /> },
        { to: "/user/products", label: "Products", icon: <Droplets className="mr-2 h-5 w-5" /> },
        { to: "/user/ai-recommendations", label: "Ai", icon: <Bot className="mr-2 h-5 w-5" /> },
        { to: "/user/chat", label: "Chat", icon: <MessageSquare className="mr-2 h-5 w-5" /> },
        { to: "/user/appointments", label: "Appointments", icon: <Calendar className="mr-2 h-5 w-5" /> },
      ];
    }

    if (userData?.role === "DERMATOLOGISTS") {
      return [
        { to: "/dermatologist/dashboard", label: "Dashboard", icon: <Home className="mr-2 h-5 w-5" /> },
        { to: "/dermatologist/chat", label: "Chat", icon: <MessageSquare className="mr-2 h-5 w-5" /> },
        { to: "/dermatologist/appointments", label: "Appointments", icon: <Calendar className="mr-2 h-5 w-5" /> },
      ];
    }

    if (userData?.role === "ADMIN") {
      return [
        { to: "/admin/dashboard", label: "Dashboard", icon: <Home className="mr-2 h-5 w-5" /> },
        { to: "/admin/products", label: "Products", icon: <Droplets className="mr-2 h-5 w-5" /> },
        { to: "/admin/users", label: "Users", icon: <UserCircle className="mr-2 h-5 w-5" /> },
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-6 mx-auto">
        <div className="flex items-center">
          <Link
            to={
              isAuthenticated
                ? userData?.role === "USER"
                  ? "/user/dashboard"
                  : userData?.role === "DERMATOLOGISTS"
                  ? "/dermatologist/dashboard"
                  : "/admin/dashboard"
                : "/"
            }
            className="flex items-center space-x-2 mr-4"
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="hidden text-xl font-bold sm:inline-block">
              GlowGuide
            </span>
          </Link>

          <nav className="hidden items-center space-x-6 ml-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated && <NotificationCenter />}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 focus:ring-0 focus:ring-offset-0"
                >
                  <UserCircle className="h-5 w-5" />
                  <span className="hidden md:inline">
                    {userData?.name || "User"}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/login")}>Sign In</Button>
          )}

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 md:hidden"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="pr-0">
              <div className="flex flex-col py-4">
                <Link
                  to={
                    isAuthenticated
                      ? userData?.role === "USER"
                        ? "/user/dashboard"
                        : userData?.role === "DERMATOLOGISTS"
                        ? "/dermatologist/dashboard"
                        : "/admin/dashboard"
                      : "/"
                  }
                  className="flex items-center space-x-2 mb-6"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Sparkles className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">GlowGuide</span>
                </Link>

                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center rounded-lg p-2 font-medium transition-colors ${
                        location.pathname === link.to
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}

                  {isAuthenticated && (
                    <>
                      <div className="my-2 h-px bg-border" />
                      <Link
                        to={
                          userData?.role === "USER"
                            ? "/user/profile"
                            : userData?.role === "DERMATOLOGISTS"
                            ? "/dermatologist/profile"
                            : "/admin/profile"
                        }
                        className="flex items-center rounded-lg p-2 transition-colors hover:bg-muted"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="mr-2 h-5 w-5" />
                        Profile
                      </Link>

                      <button
                        type="button"
                        className="flex w-full items-center rounded-lg p-2 text-left text-destructive transition-colors hover:bg-destructive/10"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                      </button>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
