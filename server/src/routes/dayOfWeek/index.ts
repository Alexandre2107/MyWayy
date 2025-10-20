import express from "express"
import {
  getDayOfWeek,
  getDayOfWeekById,
  createDayOfWeek,
  updateDayOfWeek,
  deleteDayOfWeek,
} from "../../controllers/dayOfWeek"

const dayOfWeekRouter = express.Router()

dayOfWeekRouter.get("/", getDayOfWeek)
dayOfWeekRouter.get("/:day_of_week_id", getDayOfWeekById)
dayOfWeekRouter.post("/", createDayOfWeek)
dayOfWeekRouter.put("/:day_of_week_id", updateDayOfWeek)
dayOfWeekRouter.delete("/:day_of_week_id", deleteDayOfWeek)

export default dayOfWeekRouter
