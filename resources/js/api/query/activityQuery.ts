import { useQuery } from "react-query";
import axios from "axios";

export const useUsersList = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "userLists",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(`/api/activities_users`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return response.data;
        }
    );

    return {
        dataUsers: data,
        isLoadingUsers: isLoading,
        isErrorUsers: isError,
        refetchUsers: refetch,
    };
};
