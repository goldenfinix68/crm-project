import { useQuery } from "react-query";
import axios from "axios";
import { TContact, TContactType, TText } from "../../entities";

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
