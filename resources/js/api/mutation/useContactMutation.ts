import { useMutation } from "react-query";
import { TContact, TContactType } from "../../entities";
import { notification } from "antd";

export const addTypeMutation = async (type: TContactType) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/contact-types", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(type),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add contact type");
    }
    return data;
};

export const addContactMutation = async (contact: TContact) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(contact),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add contact type");
    }
    notification.success({
        message: "Success",
        description: "Successfully created",
    });
    return data;
};

export const updateContactMutation = async (contact: TContact) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/contacts/" + contact.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(contact),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add contact type");
    }
    return data;
};

export const deleteContactMutation = async (contactId: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/contacts/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(contactId),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to delete");
    }
    notification.success({
        message: "Success",
        description: "Successfully Deleted",
    });
    return data;
};

export const mergeContactMutation = async (postData: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/contacts/mergeContacts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(postData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to merge");
    }

    notification.success({
        message: "Success",
        description: "Successfully Merged",
    });
    return data;
};

export const useContactAddFavorite = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/contacts/favorite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(items),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add deal");
    }
    return data;
};

export const useContactDeleteFavorite = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/contacts/del_favorite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(items),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add deal");
    }
    return data;
};

export const useContactAddActivityLog = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/contacts/activity_log", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(items),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add deal");
    }
    return data;
};

export const useContactColumnSetting = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/contacts/save_column_setting", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(items),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to save");
    }

    notification.success({
        message: "Success",
        description: "Successfully Save",
    });
    return data;
};

export const useDeleteContactColumn = async (contactId: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/contacts/delete_contacts_table_column", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(contactId),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to delete");
    }
    notification.success({
        message: "Success",
        description: "Successfully Deleted",
    });
    return data;
};
