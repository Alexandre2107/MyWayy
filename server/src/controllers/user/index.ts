import { Request, Response } from "express"
import { prisma } from "../../database"
import { User, CreateUserInput, UpdateUserInput } from "../../interfaces/User"
import bcrypt from "bcrypt"


// Get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: User[] = await prisma.user.findMany()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Get user by email or document
export const getUserByEmailOrDocument = async (req: Request, res: Response): Promise<void> => {
  const { emailOrDocument } = req.params
  try {
    let whereClause: any = {}
    if (emailOrDocument.includes("@")) {
      whereClause.email = emailOrDocument
    } else {
      whereClause.document = emailOrDocument
    }
    const user: User | null = await prisma.user.findUnique({
      where: whereClause,
    })

    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id } = req.params
  try {
    const user: User | null = await prisma.user.findUnique({
      where: { user_id: Number(user_id) },
    })
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Create new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const data: CreateUserInput = req.body
  const saltRounds = 10
  try {
    const hashedPassword = await bcrypt.hash(data.password, saltRounds)
    const newUser = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    })
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Update user
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id } = req.params
  const data: UpdateUserInput = req.body
  try {
    const updatedUser: User = await prisma.user.update({
      where: { user_id: Number(user_id) },
      data: data,
    })
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id } = req.params
  try {
    await prisma.user.delete({
      where: { user_id: Number(user_id) },
    })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error })
  }
}
