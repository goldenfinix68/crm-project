import { useQuery } from "react-query";
import axios from "axios";

export const useDealsAll = () => {
    const { data, isLoading, isError } = useQuery("deals", async () => {
        const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
        const response = await axios.get("/api/deals", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    });

    return {
        deals: data,
        isLoading,
        isError,
    };
};

export const usefindDeal = (id: string) => {
    if (!id) {
        return {
            user: false,
            isLoading: false,
        };
    }
    const { data, isLoading, isError } = useQuery("findDeal", async () => {
        const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
        const response = await axios.get(`/api/deals/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    });

    return {
        deal: data,
        isLoading,
        isError,
    };
};
