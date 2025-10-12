import { Request, Response } from "express"
import { prisma } from "../../database"
import { Activity } from "../../interfaces/Activity"
import {
  ActivitySchedule,
  CreateActivityScheduleInput,
  UpdateActivityScheduleInput,
} from "../../interfaces/ActivitySchedule"

// Get all Activities Schedules
export const getActivitiesSchedules = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const activitiesSchedule: ActivitySchedule[] =
      await prisma.activitySchedule.findMany({})
    res.status(200).json(activitiesSchedule)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Get Activity Schedule by ID
export const getActivityScheduleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { activity_schedule_id } = req.params
    const activitySchedule: ActivitySchedule | null =
      await prisma.activitySchedule.findUnique({
        where: { activity_schedule_id: Number(activity_schedule_id) },
      })
    res.status(200).json(activitySchedule)
  } catch (error) {
    res.status(500).json()
  }
}

// Create new activity schedule
export const createActivitySchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data: CreateActivityScheduleInput = req.body
    const activity: Activity | null = await prisma.activity.findUnique({
      where: { activity_id: Number(data.activity_id) },
    })

    if (!activity) {
      res.status(404).json({ error: "Activity not found" })
      return
    }

    const activitySchedule: ActivitySchedule =
      await prisma.activitySchedule.create({
        data: {
          activity_id: data.activity_id,
          start_time:
            activity.activity_task == false && data.start_time
              ? data.start_time
              : null,
          end_time:
            activity.activity_task == false && data.end_time
              ? data.end_time
              : null,
        },
        include: {
          days_of_week: true,
        },
      })

    data.days_of_week.forEach(async (dayOfWeek) => {
      await prisma.dayOfWeek.create({
        data: {
          activity_schedule_id: activitySchedule.activity_schedule_id,
          day: dayOfWeek.day,
        },
      })
    })

    res.status(200).json(activitySchedule)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Update activity schedule
export const updateActivitySchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { activity_schedule_id } = req.params
  const data: UpdateActivityScheduleInput = req.body
  try {
    const activities: ActivitySchedule = await prisma.activitySchedule.update({
      where: { activity_schedule_id: Number(activity_schedule_id) },
      data: data,
    })
    res.status(200).json(activities)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Delete activity schedule
export const deleteActivitySchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { activity_schedule_id } = req.params
  try {
    await prisma.activitySchedule.delete({
      where: { activity_schedule_id: Number(activity_schedule_id) },
    })
    res.status(200).json()
  } catch (error) {
    res.status(500).json({ error: error })
  }
}
