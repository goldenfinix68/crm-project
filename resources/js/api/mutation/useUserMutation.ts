import { useMutation } from "react-query";

export const addUserMutation = async (user) => {
    const response = await fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add user");
    }
    return data;
};
