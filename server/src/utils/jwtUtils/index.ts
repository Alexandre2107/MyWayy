import jwt from "jsonwebtoken"

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || "secret"
  const expiresIn = "30d"

  return jwt.sign({ userId }, secret, { expiresIn })
}
