import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { Calendar, Camera, ChevronRight, Search, Sparkles } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  RoutineData,
  ProgressLogData,
  SkinProfileData,
  SkinConcernObject,
} from "../../lib/types";
import { toast } from "sonner";
import skinProfileService from "../../api/services/skin.service";
import routineService from "../../api/services/routine.service";
import progressService from "../../api/services/progess.service";

export default function Dashboard() {
  const { userData, setIsLoading, setSkinProfile } = useContext(AppContext);
  const [routines, setRoutines] = useState<RoutineData[]>([]);
  const [recentLogs, setRecentLogs] = useState<ProgressLogData[]>([]);
  const [userProfile, setUserProfile] = useState<SkinProfileData | null>(null);
  const [isLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setLocalLoading(true);

        // Fetch skin profile
        try {
          const profileData = await skinProfileService.getSkinProfile();
          setUserProfile(profileData);
          setSkinProfile(profileData);
        } catch (error) {
          console.error("Error fetching skin profile:", error);
        }

        // Fetch routines
        try {
          const routinesData = await routineService.getRoutines();
          setRoutines(routinesData);
        } catch (error) {
          console.error("Error fetching routines:", error);
          toast.error("Failed to load your routines");
        }

        // Fetch progress logs
        try {
          const logsData = await progressService.getLogs();
          setRecentLogs(logsData.slice(0, 3)); // Get most recent 3 logs
        } catch (error) {
          console.error("Error fetching progress logs:", error);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Something went wrong. Please try again later.");
      } finally {
        setIsLoading(false);
        setLocalLoading(false);
      }
    };

    fetchDashboardData();
  }, [setIsLoading, setSkinProfile]);

  const formatConcerns = (concerns: SkinConcernObject[]) => {
    if (!Array.isArray(concerns)) return "No concerns listed";
    return concerns
      .map((concern) =>
        concern.concern
          .toLowerCase()
          .split("_")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
      .join(", ");
  };

  if (isLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="h-12 w-12 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-transparent md:text-3xl bg-linear-to-r from-primary via-pink-500 to-amber-500 bg-clip-text">
          Welcome, {userData?.name}!
        </h1>
        <p className="text-muted-foreground">
          {!userProfile
            ? "Complete your skin assessment to get personalized recommendations."
            : "Here's your skin journey overview."}
        </p>
      </div>

      {/* Assessment Banner */}
      {!userProfile && (
        <Card className="mb-8 border-primary/20 bg-linear-to-r from-primary/10 to-primary/5">
          <CardContent className="flex flex-col items-center gap-4 py-6 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h2 className="mb-2 text-xl font-semibold text-transparent bg-linear-to-r from-primary to-amber-500 bg-clip-text">
                Start Your Skin Journey
              </h2>
              <p className="text-muted-foreground">
                Complete your skin assessment to receive personalized routines
                and product recommendations.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link to="/user/skin-assessment" className="inline-flex items-center gap-1">
                Take Assessment
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Skin Profile Card */}
        <Card className="flex h-full flex-col justify-between border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base font-semibold text-primary">
              <Search className="mr-2 h-5 w-5" />
              Skin Profile
            </CardTitle>
            <CardDescription>Your skin type and concerns</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {userProfile ? (
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Skin Type</p>
                  <p className="text-sm text-muted-foreground">
                    {userProfile.SkinType && userProfile.SkinType.length > 0
                      ? userProfile.SkinType.map((skin, index) => (
                          <span key={index}>
                            {skin.type}
                            {index < userProfile.SkinType.length - 1 && ", "}
                          </span>
                        ))
                      : "No skin type available"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Top Concern</p>
                  <p className="text-sm text-muted-foreground">
                    {userProfile.Concerns
                      ? formatConcerns(userProfile.Concerns)
                      : "No concerns listed"}
                  </p>
                </div>
                {userProfile.goals && (
                  <div>
                    <p className="text-sm font-medium">Goals</p>
                    <p className="text-sm text-muted-foreground">{userProfile.goals}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                <p>No skin profile found</p>
                <p className="text-sm">
                  Take the assessment to create your profile
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to={userProfile ? "/user/skin-assessment" : "/user/skin-assessment"}>
                {userProfile ? "Update Profile" : "Create Profile"}
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Routines Card */}
        <Card className="flex h-full flex-col justify-between border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center font-semibold text-primary">
              <Calendar className="mr-2 h-5 w-5" />
              My Routines
            </CardTitle>
            <CardDescription>Your daily skincare regimens</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {routines && routines.length > 0 ? (
              <div className="space-y-3">
                {routines.slice(0, 3).map((routine) => (
                  <Link
                    key={routine.id}
                    to={`/user/routines/${routine.id}`}
                    className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-muted"
                  >
                    <div>
                      <p className="font-medium">{routine.name}</p>
                      <p className="text-sm text-muted-foreground">{routine.type}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                <p>No routines found</p>
                <p className="text-sm">
                  {userProfile
                    ? "Create a routine to get started"
                    : "Complete your skin assessment first"}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/user/routines">
                {routines && routines.length > 0
                  ? "View All Routines"
                  : "Create Routine"}
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Progress Card */}
        <Card className="flex h-full flex-col justify-between border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center font-semibold text-primary">
              <Camera className="mr-2 h-5 w-5" />
              Skin Progress
            </CardTitle>
            <CardDescription>Track your skincare journey</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {recentLogs && recentLogs.length > 0 ? (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-muted"
                  >
                    <div>
                      <p className="font-medium">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Concern: {log.concerns.toString().replace("_", " ").toLowerCase()}
                      </p>
                    </div>
                    <div className="flex">
                      {Array.from({ length: log.rating }).map((_, i) => (
                        <Sparkles key={i} className="h-4 w-4 text-amber-400" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                <p>No progress logs found</p>
                <p className="text-sm">Record your first entry to start tracking</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/user/progress">
                {recentLogs && recentLogs.length > 0 ? "View Progress" : "Add First Log"}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recommendation Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/user/products"
              className="group overflow-hidden rounded-lg border border-border transition-all hover:shadow-md"
            >
              <div className="aspect-square bg-muted">
                <img
                  src="https://images.pexels.com/photos/5069618/pexels-photo-5069618.jpeg"
                  alt="Product recommendation"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="font-medium">Explore Products</p>
                <p className="text-sm text-muted-foreground">
                  Find products suited for your skin type
                </p>
              </div>
            </Link>

            <Link
              to="/user/routines"
              className="overflow-hidden transition-all border rounded-lg group hover:shadow-md"
            >
              <div className="aspect-square bg-muted">
                <img
                  src="https://images.pexels.com/photos/3765174/pexels-photo-3765174.jpeg"
                  alt="Skincare routine"
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="font-medium">Build Your Routine</p>
                <p className="text-sm text-muted-foreground">
                  Personalized step-by-step regimens
                </p>
              </div>
            </Link>

            <Link
              to="/user/progress"
              className="overflow-hidden transition-all border rounded-lg group hover:shadow-md"
            >
              <div className="aspect-square bg-muted">
                <img
                  src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg"
                  alt="Progress tracking"
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="font-medium">Track Progress</p>
                <p className="text-sm text-muted-foreground">
                  Document your skincare journey
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
