import { Request, Response } from "express"
import { prisma } from "../../database"
import {
  Routine,
  CreateRoutineInput,
  UpdateRoutineInput,
} from "../../interfaces/Routine"

// Get all routines
export const getRoutines = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const routine: Routine[] = await prisma.routine.findMany({
      include: {
        guardian: true,
        user: true,
      },
    })
    res.status(200).json(routine)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Get routine by ID
export const getRoutineById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { routine_id } = req.params

  try {
    const routine: Routine | null = await prisma.routine.findUnique({
      where: { routine_id: Number(routine_id) },
      include: {
        guardian: true,
        user: true,
      },
    })

    if (routine) {
      res.status(200).json(routine)
    } else {
      res.status(404).json({ message: "Routine not found" })
    }
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Get routines by user ID
export const getRoutineByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id } = req.params

  try {
    const routine: Routine | null = await prisma.routine.findFirst({
      where: { user_id: Number(user_id) },
      include: {
        guardian: true,
        user: true,
      },
    })

    if (routine) {
      res.status(200).json(routine)
    } else {
      res.status(404).json({ message: "No routine found for this user" })
    }
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Get routines by guardian ID
export const getRoutineByGuardianId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { guardian_id } = req.params

  try {
    const routines: Routine[] = await prisma.routine.findMany({
      where: { guardian_id: Number(guardian_id) },
      include: {
        guardian: true,
        user: true,
      },
    })

    if (routines.length > 0) {
      res.status(200).json(routines)
    } else {
      res.status(404).json({ message: "No routines found for this user" })
    }
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Create routine
export const createRoutine = async (
  req: Request,
  res: Response
): Promise<void> => {
  const data: CreateRoutineInput = req.body
  try {
    const userHasRoutine: Routine | null = await prisma.routine.findFirst({
      where: { user_id: data.user_id },
    })
    if (!userHasRoutine) {
      const newRoutine: Routine = await prisma.routine.create({
        data: data,
        include: {
          user: true,
          guardian: true,
        },
      })
      if (newRoutine) {
        res.status(200).json(newRoutine)
      }
    } else {
      res.status(500).json({ error: "The user already has a routine." })
    }
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Update routine
export const updateRoutine = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { routine_id } = req.params
  const data: UpdateRoutineInput = req.body
  try {
    const updateRoutine: Routine = await prisma.routine.update({
      where: { routine_id: Number(routine_id) },
      data: data,
      include: {
        guardian: true,
        user: true,
      },
    })
    res.status(200).json(updateRoutine)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Delete routine
export const deleteRoutine = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { routine_id } = req.params
  try {
    await prisma.routine.delete({
      where: { routine_id: Number(routine_id) },
    })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ erros: error })
  }
}
