import { useQuery } from "react-query";
import axios from "axios";
import { TContact, TContactType } from "../../entities";
import $ from "jquery";

export const useContactTypesAll = () => {
    const { data, isLoading, isError } = useQuery<TContactType[]>(
        "contactTypesAll",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/contact-types", {
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
        contactTypes: data,
        isLoading,
        isError,
    };
};

export const useGetContact = (id: string) => {
    const { data, isLoading, isError, refetch } = useQuery<TContact>(
        "getContact",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get("/api/contacts/" + id, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        }
    );

    return {
        contact: data,
        isLoading,
        isError,
        refetch,
    };
};

export const useContactsAll = (filter: any) => {
    const { data, isLoading, isError, refetch } = useQuery<TContact[]>(
        "contacts",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(`/api/contacts?filter=${filter}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data.data;
        }
    );

    return {
        contacts: data,
        isLoading,
        isError,
        refetch,
    };
};
