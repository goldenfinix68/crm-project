import { useMutation } from "react-query";
import { TDealPipeline, TDealPipelineStage } from "../../entities";

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
export const useDealMutationUpdateStarred = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/starred", {
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
export const useDealUpdateTitleForm = async (items: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/update_title_form", {
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

export const createPipeline = async (pipeline: TDealPipeline) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deal-pipelines", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(pipeline),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add deal");
    }
    return data;
};

export const deleteDealPipeline = async (id: string) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deal-pipelines/" + id, {
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

export const createPipelineStage = async (pipeline: TDealPipelineStage) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deal-pipeline-stages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(pipeline),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add deal");
    }
    return data;
};

export const deleteDealPipelineStage = async (id: string) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deal-pipeline-stages/" + id, {
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

export const sortDealPipelineStageMutation = async (
    customFieldSections: TDealPipelineStage[]
) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deal-pipeline-stages/sort", {
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

export const moveCardAcrossLanesMutation = async (values: any) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/deals/move-data-across-lane", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add");
    }
    return data;
};
