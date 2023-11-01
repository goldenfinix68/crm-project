import { useQuery } from "react-query";
import { TFilter, TWorkflow } from "../../entities";
import axios from "axios";

export const filtersQuery = () => {
    const { data, isLoading, isError } = useQuery<TFilter[]>(
        "filters",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/filters", {
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
        data,
        isLoading,
        isError,
    };
};
