import { IActivity, ICreateActivity } from "@/interface/Routine";
import { apiMyWay } from "@/services/api";

export async function createActivity(data: ICreateActivity) {
    return apiMyWay.post<IActivity>("/activity", data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error)
            throw error;
        });
}