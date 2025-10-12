export interface User {
  user_id: number
  full_name: string
  document: string
  email: string
  password: string
  type_of_user: string
  has_full_permission: boolean
}

export interface CreateUserInput {
  full_name: string
  document: string
  email: string
  password: string
  type_of_user: string
  has_full_permission: boolean
}

export interface UpdateUserInput {
  full_name?: string
  document?: string
  email?: string
  type_of_user?: string
  has_full_permission?: boolean
}
