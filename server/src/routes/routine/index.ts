import express from "express"
import {
  createRoutine,
  deleteRoutine,
  getRoutineByGuardianId,
  getRoutineById,
  getRoutineByUserId,
  getRoutines,
  updateRoutine,
} from "../../controllers/routine"

const routineRouter = express.Router()

routineRouter.get("/", getRoutines)
routineRouter.get("/:routine_id", getRoutineById)
routineRouter.get("/user/:user_id", getRoutineByUserId)
routineRouter.get("/guardian/:guardian_id", getRoutineByGuardianId)
routineRouter.post("/", createRoutine)
routineRouter.put("/:routine_id", updateRoutine)
routineRouter.delete("/:routine_id", deleteRoutine)

export default routineRouter
