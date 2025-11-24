import { DaysOfWeek } from '@/interface/Routine';
import { apiMyWay } from '@/services/api';

export const loadDaysOfSchedule = async (activityId: number) => {
    try {
        const response = await apiMyWay.get<DaysOfWeek[]>('/dayofweek');
        const relatedDays = response.data.filter((day) => day.activity_schedule_id === activityId);

        return relatedDays;
    } catch (error) {
        console.error('Erro ao carregar hábitos do dia:', error);
        throw error;
    }
};
