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
        },
        { staleTime: Infinity }
    );

    return {
        contactTypes: data,
        isLoading,
        isError,
    };
};
export const useGetContact = (
    id: string,
    onSuccess?: (data: TContact) => void
) => {
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
        },
        {
            staleTime: Infinity,
            onSuccess: (data) => {
                if (onSuccess) {
                    onSuccess(data);
                }
            },
        }
    );

    return {
        contact: data,
        isLoading,
        isError,
        refetch,
    };
};

export const useContactsAll = (filter?: any) => {
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
        },
        { staleTime: Infinity }
    );

    return {
        contacts: data,
        isLoading,
        isError,
        refetch,
    };
};

export const useContactsTableColumn = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "ContactTableColumn",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(
                `/api/contacts/get_contacts_table_column`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            return response.data;
        },
        { staleTime: Infinity }
    );

    return {
        contactsTable: data,
        isLoadingContactsTable: isLoading,
        isErrorContactsTable: isError,
        refetchContactsTable: refetch,
    };
};

export const filteredContactsQuery = (values: any) => {
    const { data, isLoading, isError, refetch } = useQuery<TContact[]>(
        "filteredContacts",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.post("/api/contacts/filtered", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(values),
            });
            return response.data;
        },
        { staleTime: Infinity }
    );

    return {
        data,
        isLoading,
        isError,
        refetch,
    };
};

export const createWorkflowMutation = async (workflow: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/workflows", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(workflow),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add contact type");
    }
    return data;
};
