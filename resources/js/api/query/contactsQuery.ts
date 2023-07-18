import { useQuery } from "react-query";
import axios from "axios";
import { TContactType } from "../../entities";

export const useContactTypesAll = () => {
    const { data, isLoading, isError } = useQuery<TContactType[]>(
        "contactTypesAll",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/contact-types", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        }
    );

    return {
        contactTypes: data,
        isLoading,
        isError,
    };
};
