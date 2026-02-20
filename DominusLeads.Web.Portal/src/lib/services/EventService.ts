import { apiClient } from "../abp/api-client";

export interface EventDto {
    id: string;
    leadId: string;
    tipo: number;
    titulo: string;
    descricao: string;
    cor?: string;
    icone?: string;
    timestamp: string;
    userId?: string;
}

export const getLeadEvents = async (leadId: string) => {
    return apiClient.get<EventDto[]>(`/api/app/event/by-lead/${leadId}`);
};
