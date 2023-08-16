import { notification } from "antd";
import { TActivities } from "../../pages/Activity/ActivityEntities";

export const addActivityMutation = async (contact: TActivities) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/activities", {
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
    return data;
};
