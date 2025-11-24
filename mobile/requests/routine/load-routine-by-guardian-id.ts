import { IRoutine } from '@/interface/Routine';
import { apiMyWay } from '@/services/api';

export const loadRoutineByGuardianId = async (id: string) => {
    return apiMyWay
        .get<IRoutine[]>(`/routine/guardian/${id}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw new Error(error);
        });
};
