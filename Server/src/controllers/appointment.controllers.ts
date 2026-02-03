import { Request, Response } from "express";
import { db } from "../lib/prisma";
import { AppointmentStatus } from "@prisma/client";
import { createNotification } from "./notification.controllers";


interface AuthRequest extends Request {
  user?: any;
}

export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { role } = req.user;

    const appointments = await db.appointment.findMany({
      where:
        role === "DERMATOLOGISTS" ? { dermatologistId: userId } : { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        dermatologist: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { dermatologistId, date, notes } = req.body;

    if (!dermatologistId || !date) {
      res.status(400).json({
        success: false,
        message: "Dermatologist ID and date are required",
      });
      return;
    }

    const appointment = await db.appointment.create({
      data: {
        userId,
        dermatologistId,
        date: new Date(date),
        notes,
      },
      include: {
        dermatologist: true,
      },
    });

    // Create notification for dermatologist
    await createNotification(
      dermatologistId,
      "APPOINTMENT",
      "New Appointment Request",
      `You have a new appointment request for ${new Date(
        date
      ).toLocaleDateString()}`
    );

    res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateAppointmentStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!Object.values(AppointmentStatus).includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid status",
      });
      return;
    }

    const appointment = await db.appointment.findFirst({
      where: {
        id,
        OR: [{ userId }, { dermatologistId: userId }],
      },
      include: {
        user: true,
        dermatologist: true,
      },
    });

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
      return;
    }

    const updatedAppointment = await db.appointment.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        dermatologist: true,
      },
    });

    // Create notification for the user
    await createNotification(
      appointment.userId,
      "APPOINTMENT",
      `Appointment ${status.toLowerCase()}`,
      `Your appointment with Dr. ${
        appointment.dermatologist.name
      } has been ${status.toLowerCase()}`
    );

    res.json({
      success: true,
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Update appointment status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const appointment = await db.appointment.findFirst({
      where: {
        id,
        OR: [{ userId }, { dermatologistId: userId }],
      },
      include: {
        user: true,
        dermatologist: true,
      },
    });

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
      return;
    }

    await db.appointment.delete({
      where: { id },
    });

    // Create notifications for both user and dermatologist
    const notificationMessage = `Appointment scheduled for ${appointment.date.toLocaleDateString()} has been cancelled`;

    await Promise.all([
      createNotification(
        appointment.userId,
        "APPOINTMENT",
        "Appointment Cancelled",
        notificationMessage
      ),
      createNotification(
        appointment.dermatologistId,
        "APPOINTMENT",
        "Appointment Cancelled",
        notificationMessage
      ),
    ]);

    res.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Delete appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
