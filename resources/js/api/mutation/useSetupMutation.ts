import { useQuery } from "react-query";
import axios from "axios";

export const mutatePost = async (values: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch(values.url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values.data),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to add contact type");
    }

    return data;
};

export const mutateGet = (dataFilter: any, url: any, cache: string) => {
    const { data, isLoading, isError, refetch, isFetching } = useQuery(
        cache,
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(
                `${url}?${new URLSearchParams(dataFilter)}`,
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
        isLoading: isLoading,
        isError: isError,
        refetch: refetch,
        isFetching: isFetching,
    };
};
