import { apiMyWay } from '@/services/api';

export const deleteActivity = async (id: number) => {
    return apiMyWay
        .delete(`/activity/${id}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw new Error(error);
        });
};
