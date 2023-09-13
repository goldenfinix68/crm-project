import { useQuery } from "react-query";
import axios from "axios";
import { TActivities } from "../../pages/Activity/ActivityEntities";

export const useUsersList = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "userLists",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(`/api/activities_users`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return response.data;
        }
    );

    return {
        dataUsers: data,
        isLoadingUsers: isLoading,
        isErrorUsers: isError,
        refetchUsers: refetch,
    };
};

export const activitiList = (dataFilter: any) => {
    const { data, isLoading, isError, refetch, isFetching } = useQuery(
        "activities",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(
                `/api/activities?${new URLSearchParams(dataFilter)}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log("activitiList", dataFilter);

            return response.data;
        }
    );

    return {
        dataSource: data,
        isLoadingUsers: isLoading,
        isErrorUsers: isError,
        refetchUsers: refetch,
        isFetchingUsers: isFetching,
    };
};

export const useContactsList = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "contactLists",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(`/api/activities_contacts`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return response.data;
        }
    );

    return {
        dataContacts: data,
        isLoadingContacts: isLoading,
        isErrorContacts: isError,
        refetchContacts: refetch,
    };
};

export const useDealsList = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "dealLists",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(`/api/activities_deals`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return response.data;
        }
    );

    return {
        dataDeals: data,
        isLoadingDeals: isLoading,
        isErrorDeals: isError,
        refetchDeals: refetch,
    };
};

export const usePeopleList = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "get_people",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(`/api/get_people`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return response.data;
        }
    );

    return {
        dataPeople: data,
        isLoadingPeople: isLoading,
        isErrorPeople: isError,
        refetchPeople: refetch,
    };
};

export const useTagList = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "get_tag",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(`/api/tag_management?status=1`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return response.data;
        }
    );

    return {
        dataTag: data,
        isLoadingTag: isLoading,
        isErrorTag: isError,
        refetchTag: refetch,
    };
};

export const useActivityType = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "activity_type",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(`/api/activity_type?status=1`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return response.data;
        }
    );

    return {
        dataType: data,
        isLoadingType: isLoading,
        isErrorType: isError,
        refetchType: refetch,
    };
};

export const useActivutyCustomField = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "get_activity_custom_field",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(`/api/activity_custome_fields`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return response.data;
        }
    );

    return {
        dataCustomField: data,
        isLoadingCustomField: isLoading,
        isErrorCustomField: isError,
        refetchCustomField: refetch,
    };
};

export const useActivutyCustomFieldValue = (activity_id) => {
    const { data, isLoading, isError, refetch } = useQuery(
        "get_activity_custom_field_value",
        async () => {
            const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
            const response = await axios.get(
                `/api/activity_custome_fields?activity_id=${activity_id}`,
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
        dataCustomField: data,
        isLoadingCustomField: isLoading,
        isErrorCustomField: isError,
        refetchCustomField: refetch,
    };
};
