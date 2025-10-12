import { CreateActivityScheduleInput } from "./ActivitySchedule"

export type Activity = {
  activity_id: number
  routine_id: number
  title: string
  description: string | null
  activity_task: boolean
}

// export interface CreateActivityInput {
//   routine_id: number
//   title: string
//   description?: string
//   activity_task: boolean
// }

export interface CreateActivityInput {
  routine_id: number
  title: string
  description?: string
  activity_task: boolean
  schedules: CreateActivityScheduleInput[]
}

export interface UpdateActivityInput {
  activity_id: number
  routine_id?: number
  title?: string
  description?: string
  activity_task?: boolean
}
