import { notification } from "antd";

export const addTokenVerify = async (items: any) => {
    const accessToken = items.token; // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/forgotpassword_verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(items),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add contact type");
    }
    return data;
};

export const addSetPassword = async (items: any) => {
    const accessToken = items.token; // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/forgot_password_set_password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(items),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add contact type");
    }
    return data;
};
