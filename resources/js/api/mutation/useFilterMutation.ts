import { TFilter, TWorkflow } from "../../entities";

export const createFilterMutation = async (filter: TFilter) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/filters", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(filter),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add filter");
    }
    return data;
};

export const deleteFilterMutation = async (id: string) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/filters/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add contact type");
    }
    return data;
};
