import express from "express"
import {
  getActivitiesSchedules,
  getActivityScheduleById,
  updateActivitySchedule,
  createActivitySchedule,
  deleteActivitySchedule,
} from "../../controllers/activitySchedule"

const activityScheduleRouter = express.Router()

activityScheduleRouter.get("/", getActivitiesSchedules)
activityScheduleRouter.get("/:activity_schedule_id", getActivityScheduleById)
activityScheduleRouter.post("/", createActivitySchedule)
activityScheduleRouter.put("/:activity_schedule_id", updateActivitySchedule)
activityScheduleRouter.delete("/:activity_schedule_id", deleteActivitySchedule)

export default activityScheduleRouter
