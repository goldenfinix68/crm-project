import { useQuery } from "react-query";
import { TWorkflow } from "../../entities";
import axios from "axios";

export const useWorkflowsQuery = () => {
    const { data, isLoading, isError } = useQuery<TWorkflow[]>(
        "workflows",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/workflows", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    // data: {
                    //     id: 1,
                    // },
                },
            });
            return response.data;
        },
        { staleTime: Infinity }
    );

    return {
        workflows: data,
        isLoading,
        isError,
    };
};
