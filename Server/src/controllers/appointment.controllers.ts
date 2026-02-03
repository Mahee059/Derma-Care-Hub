import { Request, Response } from "express";
import { db } from "../lib/prisma";
import { AppointmentStatus } from "@prisma/client";

interface AuthRequest extends Request {
  user?: any;
}

// Get appointments
export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { role } = req.user;

    const appointments = await db.appointment.findMany({
      where:
        role === "DERMATOLOGISTS"
          ? { dermatologistId: userId }
          : { userId },
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

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create appointment
export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { dermatologistId, date, notes } = req.body;

    if (!dermatologistId || !date) {
      return res.status(400).json({
        success: false,
        message: "Dermatologist ID and date are required",
      });
    }

    const appointment = await db.appointment.create({
      data: {
        userId,
        dermatologistId,
        date: new Date(date),
        notes,
      },
    });

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!Object.values(AppointmentStatus).includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const appointment = await db.appointment.findFirst({
      where: {
        id,
        OR: [{ userId }, { dermatologistId: userId }],
      },
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    const updatedAppointment = await db.appointment.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, appointment: updatedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete appointment
export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const appointment = await db.appointment.findFirst({
      where: {
        id,
        OR: [{ userId }, { dermatologistId: userId }],
      },
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    await db.appointment.delete({ where: { id } });

    res.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
