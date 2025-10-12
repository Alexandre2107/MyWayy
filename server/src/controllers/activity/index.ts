import { Request, Response } from "express"
import { prisma } from "../../database"
import {
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
} from "../../interfaces/Activity"

// Get all activities
export const getActivities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const activities: Activity[] = await prisma.activity.findMany({})
    res.status(200).json(activities)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Get activity by ID
export const getActivityById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { activity_id } = req.params
    const activity: Activity | null = await prisma.activity.findUnique({
      where: { activity_id: Number(activity_id) },
    })
    res.status(200).json(activity)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Get activities by Routine_id
export const getActivitiesByRoutineId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { routine_id } = req.params
    const activities: Activity[] = await prisma.activity.findMany({
      where: { routine_id: Number(routine_id) },
    })
    res.status(200).json(activities)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Create new activity
// export const createActivity = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const data: CreateActivityInput = req.body
//   try {
//     const activities: Activity = await prisma.activity.create({
//       data: data,
//     })
//     res.status(200).json(activities)
//   } catch (error) {
//     res.status(500).json({ error: error })
//   }
// }

export const createActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const data: CreateActivityInput = req.body
  try {
    const activity = await prisma.activity.create({
      data: {
        routine_id: data.routine_id,
        title: data.title,
        description: data.description,
        activity_task: data.activity_task,
      },
    })

    await Promise.all(
      data.schedules.map(async (schedule) => {
        const activitySchedule = await prisma.activitySchedule.create({
          data: {
            activity_id: activity.activity_id,
            start_time:
              data.activity_task == false && schedule.start_time
                ? schedule.start_time
                : null,
            end_time:
              data.activity_task == false && schedule.end_time
                ? schedule.end_time
                : null,
          },
        })

        await Promise.all(
          schedule.days_of_week.map((dayOfWeek) => {
            return prisma.dayOfWeek.create({
              data: {
                activity_schedule_id: activitySchedule.activity_schedule_id,
                day: dayOfWeek.day,
              },
            })
          })
        )
      })
    )

    res.status(200).json(activity)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Update activity
export const updateActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { activity_id } = req.params
  const data: UpdateActivityInput = req.body
  try {
    const activities: Activity = await prisma.activity.update({
      where: { activity_id: Number(activity_id) },
      data: data,
    })
    res.status(200).json(activities)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Delete activity
export const deleteActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { activity_id } = req.params
  try {
    await prisma.activity.delete({
      where: { activity_id: Number(activity_id) },
    })
    res.status(200).json()
  } catch (error) {
    res.status(500).json({ error: error })
  }
}
