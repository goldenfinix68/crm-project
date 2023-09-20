import { TWorkflow } from "../../entities";

// export const deleteTextTemplateFolderMutation = async (id: string) => {
//     const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
//     const response = await fetch("/api/text-template-folders/" + id, {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//         },
//     });
//     const data = await response.json();
//     if (!response.ok) {
//         throw new Error(data.message || "Failed to add contact type");
//     }
//     return data;
// };

export const createWorkflowMutation = async (workflow: TWorkflow) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from local storage or cookies
    const response = await fetch("/api/workflows", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(workflow),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add contact type");
    }
    return data;
};
