import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Sparkles, Calendar, Camera } from "lucide-react";
import dermotologistService from "../../api/services/dermotologist.service";

export default function PatientDetails() {
  const { id } = useParams();
  const { setIsLoading } = useContext(AppContext);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        setIsLoading(true);
        setIsLocalLoading(true);
        if (id) {
          const data = await dermotologistService.getPatientDetails(id);
          setPatient(data);
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
        toast.error("Failed to load patient details");
      } finally {
        setIsLoading(false);
        setIsLocalLoading(false);
      }
    };

    fetchPatientDetails();
  }, [id, setIsLoading]);

  if (isLocalLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Sparkles className="w-12 h-12 mb-4 text-primary animate-pulse" />
          <p>Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Patient not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Patient Details</h1>
        <p className="text-foreground/70">
          View patient information and history
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={patient.image} />
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{patient.name}</CardTitle>
                <CardDescription>{patient.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-foreground/70">{patient.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-foreground/70">
                  {new Date(patient.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skin Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skin Profile</CardTitle>
            <CardDescription>
              Patient's skin characteristics and concerns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium">Skin Type</h3>
                <div className="space-y-1">
                  {patient.skinProfile?.SkinType?.map((type, index) => (
                    <p key={index} className="text-foreground/70">
                      {type.type}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-medium">Concerns</h3>
                <div className="space-y-1">
                  {patient.skinProfile?.Concerns?.map((concern, index) => (
                    <p key={index} className="text-foreground/70">
                      {concern.concern.replace("_", " ")}
                    </p>
                  ))}
                </div>
              </div>
              {patient.skinProfile?.allergies && (
                <div className="md:col-span-2">
                  <h3 className="mb-2 font-medium">Allergies</h3>
                  <p className="text-foreground/70">
                    {patient.skinProfile.allergies}
                  </p>
                </div>
              )}
              {patient.skinProfile?.goals && (
                <div className="md:col-span-2">
                  <h3 className="mb-2 font-medium">Goals</h3>
                  <p className="text-foreground/70">
                    {patient.skinProfile.goals}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Logs */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Progress History
            </CardTitle>
            <CardDescription>Patient's skin progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            {patient.progressLogs && patient.progressLogs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {patient.progressLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 transition-colors border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex">
                        {Array.from({ length: log.rating }).map((_, i) => (
                          <Sparkles
                            key={i}
                            className="w-4 h-4 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    {log.imageUrl && (
                      <div className="mb-2 overflow-hidden rounded-md aspect-square">
                        <img
                          src={log.imageUrl}
                          alt="Progress"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div>
                      <p className="mb-1 text-sm font-medium">
                        Concern: {log.concerns.toString().replace("_", " ")}
                      </p>
                      {log.notes && (
                        <p className="text-sm text-foreground/70">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-foreground/70">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-foreground/30" />
                <p>No progress logs available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
