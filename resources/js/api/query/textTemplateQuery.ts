import { useQuery } from "react-query";
import axios from "axios";
import { TTextTemplate, TTextTemplateFolder } from "../../entities";

export const useTextTemplateFolders = () => {
    const { data, isLoading, isError } = useQuery<TTextTemplateFolder[]>(
        "textTemplateFolders",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/text-template-folders", {
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
        folders: data,
        isLoading,
        isError,
    };
};

export const useTextTemplates = () => {
    const { data, isLoading, isError } = useQuery<TTextTemplate[]>(
        "textTemplates",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/text-templates", {
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
        templates: data,
        isLoading,
        isError,
    };
};
