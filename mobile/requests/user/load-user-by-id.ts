import { IUser } from '@/interface/User';
import { apiMyWay } from '@/services/api';

export const loadUserById = async (id: string) => {
  return apiMyWay
    .get<IUser>(`/user/id/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw new Error(error);
    });
};
