import { useMutation } from "react-query";
import { TUser } from "../../entities";

export const addUserMutation = async (user) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(user),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add user");
    }
    return data;
};

export const userCallForwardingMutation = async (users: TUser[]) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/users/call-forwarding", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(users),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add");
    }
    return data;
};

export const userImpersonate = async (user) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/user-impersonate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(user),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add user");
    }
    return data;
};

export const userSettings = async (settings) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/user-settings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(settings),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add user");
    }
    return data;
};
