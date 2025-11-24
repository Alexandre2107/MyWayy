import { IRoutine } from '@/interface/Routine';
import { apiMyWay } from '@/services/api';

export const loadRoutineByUserId = async (id: string) => {
    return apiMyWay
        .get<IRoutine>(`/routine/user/${id}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw new Error(error);
        });
};
