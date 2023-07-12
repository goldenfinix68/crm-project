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

export const useUsersAll = () => {
    const { data, isLoading, isError } = useQuery("users", async () => {
        const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
        const response = await axios.get("/api/users", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    });

    return {
        users: data,
        isLoading,
        isError,
    };
};

export const usefindUser = (id: string) => {
    if (!id) {
        return {
            user: false,
            isLoading: false,
        };
    }
    const { data, isLoading, isError } = useQuery("findUser", async () => {
        const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
        const response = await axios.get(`/api/users/${id}`, {
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
