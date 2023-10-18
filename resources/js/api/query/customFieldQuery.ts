import { useQuery } from "react-query";
import { TCustomField, TCustomFieldSection, TWorkflow } from "../../entities";
import axios from "axios";

export const useCustomFieldSections = (type: any) => {
    const { data, isLoading, isError, refetch } = useQuery<
        TCustomFieldSection[]
    >("customFieldSections", async () => {
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
    });

    return {
        data,
        isLoading,
        isError,
        refetch,
    };
};

export const useInactiveCustomFields = (type: any) => {
    const { data, isLoading, isError, refetch } = useQuery<TCustomField[]>(
        "inactiveCustomFields",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(
                `/api/custom-fields/inactive?type=${type}`,
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
        refetch,
    };
};
