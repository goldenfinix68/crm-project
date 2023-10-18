import { TCustomFieldSection } from "../../entities";

export const createCustomFieldMutation = async (customField: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/custom-field", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(customField),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add contact type");
    }
    return data;
};

export const createCustomFieldSectionMutation = async (
    customFieldSection: TCustomFieldSection
) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/custom-field-sections", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(customFieldSection),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add");
    }
    return data;
};

export const sortCustomFieldSectionsMutation = async (
    customFieldSections: TCustomFieldSection[]
) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/custom-field-sections/sort", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(customFieldSections),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add");
    }
    return data;
};

export const deleteCustomFieldSectionMutation = async (id: string) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/custom-field-sections/" + id, {
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
