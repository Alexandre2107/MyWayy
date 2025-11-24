import { IScheduledActivity } from '@/interface/Routine';
import { apiMyWay } from '@/services/api';

export const loadActivitiesSchedule = async (activityIds: number[]) => {
    try {
        const response = await apiMyWay.get<IScheduledActivity[]>('/activityschedule');
        return response.data.filter((activity) => activityIds.includes(activity.activity_id));
    } catch (error) {
        console.error('Erro ao carregar hábitos do dia:', error);
        throw error;
    }
};
