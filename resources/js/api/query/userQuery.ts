import { useQuery } from "react-query";
import axios from "axios";
import { TMobileNumber, TUser } from "../../entities";

export const useLoggedInUser = () => {
    const { data, isLoading, isError } = useQuery<TUser>("user", async () => {
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
    const { data, isLoading, isError } = useQuery<TUser>(
        "findUser",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(`/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        }
    );

    return {
        user: data,
        isLoading,
        isError,
    };
};

export const useUserFavorites = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "contactsFavorite",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(`/api/contacts/get_favorite`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        }
    );

    return {
        favorites: data,
        isLoadingFavorites: isLoading,
        isErrorFavorites: isError,
        refetchFavorites: refetch,
    };
};

export const useGetAvailableNumbersTelnyx = () => {
    const { data, isLoading, isError } = useQuery<TMobileNumber[]>(
        "availableNumbersTelnyx",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/telnyx/available-numbers", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        }
    );

    return {
        data: data,
        isLoading,
        isError,
    };
};
