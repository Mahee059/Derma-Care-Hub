import { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Users,
  UserPlus,
  ClipboardList,
  Calendar,
  Search,
  Clock,
  ArrowRight,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

import {
  DermatologistStats,
  Patient,
  DermatologistActivity,
} from "../../lib/types";
import dermotologistService from "../../api/services/dermotologist.service";

export default function DermatologistDashboard() {
  const { setIsLoading } = useContext(AppContext);
  const [stats, setStats] = useState<DermatologistStats | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activities, setActivities] = useState<DermatologistActivity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsLocalLoading(true);

      const [statsData, patientsData, activitiesData] = await Promise.all([
        dermotologistService.getStats(),
        dermotologistService.getPatients(),
        dermotologistService.getRecentActivity(),
      ]);

      setStats(statsData);
      setPatients(patientsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
      setIsLocalLoading(false);
    }
  }, [setIsLoading]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "routine_created":
        return <ClipboardList className="h-4 w-4 text-green-600" />;
      case "assessment_completed":
        return <Users className="h-4 w-4 text-primary" />;
      case "progress_update":
        return <Calendar className="h-4 w-4 text-amber-600" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (isLocalLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Users className="h-12 w-12 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-transparent md:text-3xl bg-linear-to-r from-primary via-pink-500 to-amber-500 bg-clip-text">
          Dermatologist Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor patient progress and manage consultations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card className="border-border bg-primary/5">
          <CardContent className="flex items-center gap-4 p-6">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Patients</p>
              <h3 className="text-2xl font-bold">
                {stats?.totalPatients || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-primary/5">
          <CardContent className="flex items-center gap-4 p-6">
            <UserPlus className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">New This Month</p>
              <h3 className="text-2xl font-bold">
                {stats?.newPatientsThisMonth || 0}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Patients Table */}
        <Card className="border-border md:col-span-1">
          <CardHeader>
            <CardTitle className="font-semibold text-primary">
              Recent Patients
            </CardTitle>
            <CardDescription>
              View and manage your patient list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative grow">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Last Assessment</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.slice(0, 5).map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>
                        {patient.skinProfile?.lastAssessment
                          ? new Date(
                              patient.skinProfile.lastAssessment
                            ).toLocaleDateString()
                          : "No assessment"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="float-right"
                        >
                          <Link to={`/dermatologist/patients/${patient.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link to="/dermatologist/patients">
                View All Patients
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 font-semibold text-primary">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest updates from your patients
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Clock className="mx-auto mb-2 h-12 w-12 text-muted-foreground/50" />
                  <p>No recent activity</p>
                </div>
              ) : (
                activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="rounded-full bg-muted p-2">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {activity.details}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {activity.patient}
                        </span>
                        <span className="text-xs text-muted-foreground/80">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}