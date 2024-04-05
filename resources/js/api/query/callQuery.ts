import { useQuery } from "react-query";
import axios from "axios";
import { TCallHistory } from "../../entities";

export const useCallHistory = (params: any, onSuccess?: () => void) => {
    const { data, isLoading, refetch } = useQuery<any>(
        "callHistory",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/calls/history", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    // data: {
                    //     id: 1,
                    // },
                },
                params: params,
            });
            return response.data;
        },
        {
            staleTime: Infinity,
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                }
            },
        }
    );

    return {
        data,
        isLoading,
        refetch,
    };
};
