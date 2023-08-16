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

export const useDealMutationDeleteNotes = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/delete_notes", {
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

export const useDealMutationDeleteActivity = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/delete_activity", {
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

export const useDealMutationDeleteFile = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/delete_file", {
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

export const useDealMutationAddParticipant = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/add_participant", {
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

export const useDealMutationDeleteParticipants = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/delete_participant", {
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

export const useDealMutationAddTeammate = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/add_teammate", {
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

export const useDealMutationDeleteTeammate = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/delete_teammate", {
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

export const useDealMutationUpdateStage = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/update_stage", {
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

export const useDealMutationDeleteDeal = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/multi_delete", {
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

export const useDealMutationUpdateMituli = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/multi_update", {
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

export const useDealAddFavorite = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/favorite", {
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

export const useDealDeleteFavorite = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/del_favorite", {
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
