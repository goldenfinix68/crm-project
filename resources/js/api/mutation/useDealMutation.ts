import { useMutation } from "react-query";

export type Tnotes = {
    deal_id: string;
    notes: string;
};

export const useDealMutation = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals", {
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

export const useDealUpdateBoardMutation = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/useDealUpdateBoardMutation", {
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

export const useDealMutationAddNotes = async (items: Tnotes) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/add_notes", {
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

export const useDealMutationWon = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/won", {
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
