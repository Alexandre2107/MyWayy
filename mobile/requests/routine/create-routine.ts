import { ICreateRoutine, IRoutine } from "@/interface/Routine";
import { apiMyWay } from "@/services/api";

export async function createRoutine(data: ICreateRoutine) {
    const newData = {
        ...data,
        user_id: parseInt(data.user_id),
        guardian_id: parseInt(data.guardian_id),
    }
    return apiMyWay.post<IRoutine>("/routine", newData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error)
            throw error;
        });
}