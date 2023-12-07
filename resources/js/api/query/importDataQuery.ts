import { useQuery } from "react-query";
import { TGSheetCrawlHistory, TWorkflow } from "../../entities";
import axios from "axios";

export const gSheetCrawlResults = () => {
    const { data, isLoading, isError } = useQuery<TGSheetCrawlHistory[]>(
        "workflows",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/gSheet-crawl-results", {
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
