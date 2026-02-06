import { Request, Response } from "express";
import { db } from "../lib/prisma";

export const getRoutines = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const routines = await db.routine.findMany({
      where: { userId },
      include: {
        steps: {
          include: {
            product: true,
          },
          orderBy: {
            stepOrder: "asc",
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      routines,
    });
  } catch (error) {
    console.error("Get routines error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRoutineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const routine = await db.routine.findUnique({
      where: { id },
      include: {
        steps: {
          include: {
            product: true,
          },
          orderBy: {
            stepOrder: "asc",
          },
        },
      },
    });

    if (!routine) {
      res.status(404).json({
        success: false,
        message: "Routine not found",
      });
      return;
    }

    if (routine.userId !== userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized to view this routine",
      });
      return;
    }

    res.status(200).json({
      success: true,
      routine,
    });
  } catch (error) {
    console.error("Get routine error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createRoutine = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, type } = req.body;

    if (!name || !type) {
      res.status(400).json({
        success: false,
        message: "Name and type are required",
      });
      return;
    }

    const routine = await db.routine.create({
      data: {
        userId,
        name,
        type,
      },
    });

    res.status(201).json({
      success: true,
      routine,
    });
  } catch (error) {
    console.error("Create routine error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateRoutine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, type } = req.body;

    const routine = await db.routine.findUnique({
      where: { id },
    });

    if (!routine) {
      res.status(404).json({
        success: false,
        message: "Routine not found",
      });
      return;
    }

    if (routine.userId !== userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update this routine",
      });
      return;
    }

    const updatedRoutine = await db.routine.update({
      where: { id },
      data: {
        name,
        type,
      },
    });

    res.status(200).json({
      success: true,
      routine: updatedRoutine,
    });
  } catch (error) {
    console.error("Update routine error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteRoutine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const routine = await db.routine.findUnique({
      where: { id },
    });

    if (!routine) {
      res.status(404).json({
        success: false,
        message: "Routine not found",
      });
      return;
    }

    if (routine.userId !== userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this routine",
      });
      return;
    }

    await db.routineStep.deleteMany({
      where: { routineId: id },
    });

    await db.routine.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Routine deleted successfully",
    });
  } catch (error) {
    console.error("Delete routine error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addRoutineStep = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { routineId, productId, stepOrder, notes } = req.body;

    if (!routineId || !productId || !stepOrder) {
      res.status(400).json({
        success: false,
        message: "Routine ID, product ID, and step order are required",
      });
      return;
    }

    const routine = await db.routine.findUnique({
      where: { id: routineId },
    });

    if (!routine || routine.userId !== userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized to modify this routine",
      });
      return;
    }

    const step = await db.routineStep.create({
      data: {
        routineId,
        productId,
        stepOrder,
        notes,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json({
      success: true,
      step,
    });
  } catch (error) {
    console.error("Add routine step error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteRoutineStep = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const step = await db.routineStep.findUnique({
      where: { id },
      include: {
        routine: true,
      },
    });

    if (!step) {
      res.status(404).json({
        success: false,
        message: "Step not found",
      });
      return;
    }

    if (step.routine.userId !== userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this step",
      });
      return;
    }

    await db.routineStep.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Step deleted successfully",
    });
  } catch (error) {
    console.error("Delete routine step error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
