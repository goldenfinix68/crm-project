import { useQuery } from "react-query";
import axios from "axios";

export const useLoggedInUser = () => {
    const { data, isLoading, isError } = useQuery("user", async () => {
        const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
        const response = await axios.get("/api/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    });

    return {
        user: data,
        isLoading,
        isError,
    };
};
