import { useQuery } from "react-query";
import { TWorkflow } from "../../entities";
import axios from "axios";

export const useCustomFieldSections = ({ type }: { type: string }) => {
    const { data, isLoading, isError } = useQuery<TWorkflow[]>(
        "workflows",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(
                `/api/custom-field-sections?type=${type}`,
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
        data,
        isLoading,
        isError,
    };
};
