import { IUser } from '@/interface/User';
import { apiMyWay } from '@/services/api';

export const loadUserByEmail = async (email: string) => {
  return apiMyWay
    .get<IUser>(`/user/${email}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw new Error(error);
    });
};
