export interface DayOfWeek {
  day_of_week_id: number
  activity_schedule_id: number
  day: string
}

export interface CreateDayOfWeek {
  activity_schedule_id: number
  day: string
}

export interface UpdateDayOfWeek {
  activity_schedule_id?: number
  day?: string
}
