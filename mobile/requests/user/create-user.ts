import { ICreateUser, IUser } from "@/interface/User";
import { apiMyWay } from "@/services/api";

export function createUser(data: ICreateUser) {
    return apiMyWay.post<IUser>("/user", data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}