import { Request, Response } from "express"
import { prisma } from "../../database"
import {
  CreateDayOfWeek,
  DayOfWeek,
  UpdateDayOfWeek,
} from "../../interfaces/DayOfWeek"

// Get all day of week
export const getDayOfWeek = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const daysOfWeek: DayOfWeek[] = await prisma.dayOfWeek.findMany({})
    res.status(200).json(daysOfWeek)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Get day of week by ID
export const getDayOfWeekById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { day_of_week_id } = req.params
    const dayOfWeek: DayOfWeek | null = await prisma.dayOfWeek.findUnique({
      where: { day_of_week_id: Number(day_of_week_id) },
    })
    res.status(200).json(dayOfWeek)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Create new Day of Week
export const createDayOfWeek = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data: CreateDayOfWeek = req.body
    const dayOfWeek = await prisma.dayOfWeek.create({
      data: data,
    })
    res.status(200).json(dayOfWeek)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
}

// Update Day of Week
export const updateDayOfWeek = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { day_of_week_id } = req.params
    const data: UpdateDayOfWeek = req.body
    const updatedDayOfWeek = await prisma.dayOfWeek.update({
      where: { day_of_week_id: Number(day_of_week_id) },
      data: data,
    })
    res.status(200).json(updatedDayOfWeek)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Delete Day of Week
export const deleteDayOfWeek = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { day_of_week_id } = req.params
    await prisma.dayOfWeek.delete({
      where: { day_of_week_id: Number(day_of_week_id) },
    })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error })
  }
}
