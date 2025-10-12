export interface Routine {
  routine_id: number
  user_id: number
  guardian_id: number
  creation_date: Date
  description: string | null
}

export interface CreateRoutineInput {
  user_id: number
  guardian_id: number
  description?: string
}

export interface UpdateRoutineInput {
  user_id?: number
  guardian_id?: number
  description?: string
}
