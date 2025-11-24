import { IActivity } from '@/interface/Routine';
import { apiMyWay } from '@/services/api';

export const loadActivitiesByRoutine = async (id: string) => {
    return apiMyWay
        .get<IActivity[]>(`/activity/routine/${id}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw new Error(error);
        });
};
