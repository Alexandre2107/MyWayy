import { apiMyWay } from '@/services/api';

export const deleteUser = async (id: string) => {
    return apiMyWay
        .delete(`/user/${id}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error)
            throw new Error(error);
        });
};
