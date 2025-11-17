import { IUser } from "./User";

export interface IRoutine {
    routine_id: string,
    user_id: string,
    guardian_id: string,
    creation_date: Date,
    description: string,
    guardian: IUser,
    user: IUser
}

export interface ICreateRoutine {
    user_id: string,
    guardian_id: string,
    description: string
}

export interface IActivity {
    activity_id: number,
    routine_id: number,
    title: string,
    description: string,
    activity_task: boolean
}

export type DayOfWeek = {
    day: string;
};

export type Schedule = {
    days_of_week: DayOfWeek[];
    start_time?: string;
    end_time?: string;
};

export interface DaysOfWeek {
    day_of_week_id: number,
    activity_schedule_id: number,
    day: string
}

export interface IScheduledActivity {
    activity_schedule_id: number,
    activity_id: number,
    start_time: Date,
    end_time: Date
};

export interface ICreateActivity {
    routine_id: number;
    title: string;
    description: string;
    activity_task: boolean;
    schedules?: Schedule[];
}
