import { useMutation } from "react-query";

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
