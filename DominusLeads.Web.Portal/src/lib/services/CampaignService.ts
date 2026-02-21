import { apiClient } from "../abp/api-client";

export interface CampaignDto {
    id: string;
    name: string;
    description?: string;
    status: number;
    sequenceId: string;
    sequenceName?: string;
    leadCount: number;
    creationTime: string;
}

export const getCampaigns = async (params?: any) => {
    return apiClient.get("/api/app/campaign", { params });
};

export const createCampaign = async (data: any) => {
    return apiClient.post("/api/app/campaign", data);
};

export const addLeadsToCampaign = async (campaignId: string, leadIds: string[]) => {
    return apiClient.post("/api/app/campaign/leads-to-campaign", { campaignId, leadIds });
};
