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

export const mutateGet = (
    dataFilter: any,
    url: any,
    cache: string,
    onSuccess?: () => void
) => {
    const { data, isLoading, isError, refetch, isFetching } = useQuery(
        cache,
        async () => {
            const filterParams = new URLSearchParams();
            for (const key in dataFilter) {
                if (dataFilter.hasOwnProperty(key)) {
                    if (typeof dataFilter[key] === "object") {
                        filterParams.append(
                            key,
                            JSON.stringify(dataFilter[key])
                        );
                    } else {
                        filterParams.append(key, dataFilter[key]);
                    }
                }
            }
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(
                `${url}?${new URLSearchParams(filterParams)}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            return response.data;
        },
        {
            staleTime: Infinity,
            onSuccess: (data) => {
                if (onSuccess) {
                    onSuccess();
                }
            },
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
