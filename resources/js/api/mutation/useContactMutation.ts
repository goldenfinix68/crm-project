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
