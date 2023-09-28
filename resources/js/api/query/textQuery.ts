import { useQuery } from "react-query";
import axios from "axios";
import {
    TContact,
    TContactType,
    TText,
    TTextLabel,
    TTextThread,
} from "../../entities";

export const useTexts = () => {
    const { data, isLoading } = useQuery<TText[]>("texts", async () => {
        const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
        const response = await axios.get("/api/texts", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                // data: {
                //     id: 1,
                // },
            },
        });
        return response.data;
    });

    return {
        texts: data,
        isLoading,
    };
};

export const useTextLabels = () => {
    const { data, isLoading } = useQuery<TTextLabel[]>(
        "textLabels",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/text-labels", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    // data: {
                    //     id: 1,
                    // },
                },
            });
            return response.data;
        }
    );

    return {
        labels: data,
        isLoading,
    };
};

export const useTextThreads = () => {
    const { data, isLoading } = useQuery<TTextThread[]>(
        "textThreads",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/text-threads", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        }
    );

    return {
        textThreads: data,
        isLoading,
    };
};

export const useTextThread = (
    id: string,
    onSuccess?: (data: TTextThread) => void
) => {
    const { data, isLoading, isError, refetch } = useQuery<TTextThread>(
        "thread",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/text-threads/" + id, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        },
        {
            onSuccess: (data) => {
                if (onSuccess) {
                    onSuccess(data);
                }
            },
        }
    );

    return {
        thread: data,
        isLoading,
        isError,
        refetch,
    };
};
