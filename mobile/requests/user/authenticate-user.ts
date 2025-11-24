import { IAuthenticateUserResponse, ILoginUser } from '@/interface/User';
import { apiMyWay } from '@/services/api';

export const authenticateUser = async (data: ILoginUser) => {
  return apiMyWay
    .post<IAuthenticateUserResponse>('/login', { emailOrDocument: data.email, password: data.password })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw new Error(error);
    });
};
