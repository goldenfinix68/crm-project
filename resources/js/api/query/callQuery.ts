import { useQuery } from "react-query";
import axios from "axios";
import { TCallHistory } from "../../entities";

export const useCallHistory = () => {
    const { data, isLoading, refetch } = useQuery<TCallHistory[]>(
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
            });
            return response.data;
        },
        {
            staleTime: Infinity,
        }
    );

    // Function to manually trigger refetch
    const fetchUser = async () => {
        await refetch();
    };
    return {
        calls: data,
        isLoading,
    };
};
