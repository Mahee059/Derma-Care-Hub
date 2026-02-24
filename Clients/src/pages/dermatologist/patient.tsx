import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { Patient } from "../../lib/types";

import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Search, ArrowUpDown, Users } from "lucide-react";
import dermotologistService from "../../api/services/dermotologist.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

export default function Patients() {
  const { setIsLoading } = useContext(AppContext);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [filterBySkinType, setFilterBySkinType] = useState<string>("ALL");
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        setIsLocalLoading(true);
        const data = await dermotologistService.getPatients();
        setPatients(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to load patients");
      } finally {
        setIsLoading(false);
        setIsLocalLoading(false);
      }
    };
    fetchPatients();
  }, [setIsLoading]);

  const filteredAndSortedPatients = patients
    .filter(
      (patient) =>
        (patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterBySkinType === "ALL" ||
          patient.skinProfile?.SkinType?.some(
            (type) => type.type === filterBySkinType
          ))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "email":
          return a.email.localeCompare(b.email);
        case "date":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        default:
          return 0;
      }
    });

  if (isLocalLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Users className="w-12 h-12 mb-4 text-primary animate-pulse" />
          <p>Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold text-transparent md:text-3xl bg-linear-to-r from-pink-500 to-amber-500 bg-clip-text">
          All Patients
        </h1>
        <p className="text-foreground/70">
          View and manage your complete patient list
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-transparent bg-linear-to-r from-pink-500 to-amber-500 bg-clip-text">
            Patient List
          </CardTitle>
          <CardDescription>
            {filteredAndSortedPatients.length} total patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-foreground/50" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={filterBySkinType}
                onValueChange={setFilterBySkinType}
              >
                <SelectTrigger className="w-45">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Skin Type</SelectItem>
                  <SelectItem value="DRY">Dry</SelectItem>
                  <SelectItem value="OILY">Oily</SelectItem>
                  <SelectItem value="COMBINATION">Combination</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="SENSITIVE">Sensitive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-45">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4" />
                    <span>Sort By</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="date">Join Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Skin Type</TableHead>
                  <TableHead>Primary Concerns</TableHead>
                  <TableHead>Member Since</TableHead>
                  <TableHead>Last Assessment</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <div className="flex flex-col items-center py-6">
                        <Users className="w-12 h-12 mb-4 text-foreground/30" />
                        <p className="mb-2 font-medium">No patients found</p>
                        <p className="text-sm text-foreground/70">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={patient.image} />
                            <AvatarFallback>
                              {patient.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-foreground/70">
                              {patient.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {patient.skinProfile?.SkinType?.map((type, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs rounded-full bg-primary/10"
                            >
                              {type.type}
                            </span>
                          )) || "Not assessed"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {patient.skinProfile?.Concerns?.slice(0, 2).map(
                            (concern, index) => (
                              <div
                                key={index}
                                className="text-sm text-foreground/70"
                              >
                                {concern.concern.replace("_", " ")}
                              </div>
                            )
                          ) || "Not assessed"}
                          {(patient.skinProfile?.Concerns?.length || 0) > 2 && (
                            <div className="text-sm text-foreground/70">
                              +{patient.skinProfile!.Concerns!.length - 2} more
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {patient.skinProfile?.lastAssessment
                          ? new Date(
                              patient.skinProfile.lastAssessment
                            ).toLocaleDateString()
                          : "No assessment"}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/dermatologist/patients/${patient.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}