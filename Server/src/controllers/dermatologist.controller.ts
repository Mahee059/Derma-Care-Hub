import { Request, Response } from "express";
import { db } from "../lib/prisma";

export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await db.user.findMany({
      where: {
        role: "USER",
        skinProfile: {
          isNot: null,
        },
      },
      include: {
        skinProfile: {
          include: {
            SkinType: true,
            Concerns: true,
          },
        },
        progressLogs: {
          orderBy: { createdAt: "desc" },
          take: 1, 
        },
      },
    });

    res.status(200).json({
      success: true,
      patients,
    });
  } catch (error) {
    console.error("Get patients error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET SINGLE PATIENT DETAILS
 */
export const getPatientDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const patient = await db.user.findUnique({
      where: { id },
      include: {
        skinProfile: {
          include: {
            SkinType: true,
            Concerns: true,
          },
        },
        progressLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Get patient details error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * DERMATOLOGIST DASHBOARD STATS
 */
export const getDermatologistStats = async (req: Request, res: Response) => {
  try {
    const [
      totalPatients,
      newPatientsThisMonth,
      pendingAssessments,
      totalProgressLogs,
    ] = await Promise.all([
      db.user.count({
        where: {
          role: "USER",
          skinProfile: { isNot: null },
        },
      }),
      db.user.count({
        where: {
          role: "USER",
          skinProfile: {
            is: {
              createdAt: {
                gte: new Date(new Date().setDate(1)),
              },
            },
          },
        },
      }),
      db.skinProfile.count({
        where: {
          lastAssessment: {
            lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      db.progressLog.count(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalPatients,
        newPatientsThisMonth,
        pendingAssessments,
        totalProgressLogs,
      },
    });
  } catch (error) {
    console.error("Get dermatologist stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * RECENT ACTIVITY (NO ROUTINES)
 */
export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const [assessments, progressLogs] = await Promise.all([
      db.skinProfile.findMany({
        take: 5,
        orderBy: { lastAssessment: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      db.progressLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    const activities = [
      ...assessments.map((a) => ({
        type: "assessment_completed",
        date: a.lastAssessment,
        patient: a.user.name,
        details: "Updated skin profile",
      })),
      ...progressLogs.map((p) => ({
        type: "progress_update",
        date: p.createdAt,
        patient: p.user.name,
        details: "Added progress log",
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    res.status(200).json({
      success: true,
      activities: activities.slice(0, 10),
    });
  } catch (error) {
    console.error("Get recent activity error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
