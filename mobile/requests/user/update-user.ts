import { ICreateUser, IUser } from "@/interface/User";
import { apiMyWay } from "@/services/api";

export async function updateUserById(id: string, data: ICreateUser) {
    return apiMyWay.put<IUser>(`/user/${id}`, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}