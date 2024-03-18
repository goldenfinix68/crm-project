import { useQuery } from "react-query";
import axios from "axios";
import {
    TMobileNumber,
    TSipTrunkingConnection,
    TUser,
    TUserSettings,
} from "../../entities";

export const useLoggedInUser = () => {
    const { data, isLoading, isError } = useQuery<TUser>(
        "user",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/user", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        },
        {
            staleTime: Infinity,
        }
    );

    return {
        user: data,
        isLoading,
        isError,
    };
};

export const useUsersAll = (page = 1, search = "") => {
    const { data, isLoading, isError, refetch } = useQuery(
        "users",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(
                `/api/users?page=${page}&search=${search}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            return response.data;
        }
    );

    return {
        users: data,
        isLoading,
        isError,
        refetch,
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

export const useGetAvailableSipTrunkingConnectionTelnyx = () => {
    const { data, isLoading, isError } = useQuery<TSipTrunkingConnection[]>(
        "getAvailableSipTrunkingConnection",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(
                "/api/telnyx/available-sip-trunking-connections",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            return response.data;
        }
    );

    return {
        data: data,
        isLoading,
        isError,
    };
};

export const useUsedTags = () => {
    const { data, isLoading, isError } = useQuery<string[]>(
        "used-tags",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/users/tags", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        }
    );

    return {
        data,
        isLoading,
        isError,
    };
};

export const userSettings = () => {
    const { data, isLoading, isError } = useQuery<TUserSettings>(
        "user-settings",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/users-settings", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        }
    );

    return {
        data,
        isLoading,
        isError,
    };
};
