import { useQuery } from "react-query";
import axios from "axios";
import { TDeal, TDealPipeline } from "../../entities";

export const useDealsAll = (url: any) => {
    const { data, isLoading, isError, refetch } = useQuery<TDeal[]>(
        "deals",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(
                `/api/deals?${new URLSearchParams(url)}`,
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
        deals: data,
        isLoading,
        isError,
        refetch,
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

export const useDealsByid = (id: string) => {
    const { data, isLoading, isError, refetch } = useQuery(
        "deals_by_id",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(`/api/deals/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        }
    );

    return {
        deals: data,
        isLoading,
        isError,
        refetch,
    };
};

export const dealPipelines = () => {
    const { data, isLoading, isError, refetch } = useQuery<TDealPipeline[]>(
        "dealPipelines",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(`/api/deal-pipelines`, {
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
        refetch,
    };
};
