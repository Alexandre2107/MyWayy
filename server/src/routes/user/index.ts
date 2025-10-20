import express from "express"
import {
  getUsers,
  getUserById,
  getUserByEmailOrDocument,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/user"
import { authenticate } from "../../middleware/auth"

const userRouter = express.Router()

userRouter.get("/", authenticate, getUsers)
userRouter.get("/id/:user_id", authenticate, getUserById)
userRouter.get("/:emailOrDocument", getUserByEmailOrDocument)
userRouter.post("/", createUser)
userRouter.put("/:user_id", authenticate, updateUser)
userRouter.delete("/:user_id", authenticate, deleteUser)

export default userRouter