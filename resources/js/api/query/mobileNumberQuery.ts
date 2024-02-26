import { useQuery } from "react-query";
import { TMobileNumber, TWorkflow } from "../../entities";
import axios from "axios";

export const useMobileNumbersQuery = () => {
    const { data, isLoading, isError } = useQuery<TMobileNumber[]>(
        "mobileNumbers",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/mobile-numbers", {
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
