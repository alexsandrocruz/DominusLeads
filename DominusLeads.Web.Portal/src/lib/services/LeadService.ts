import { apiClient } from "../abp/api-client";

export interface LeadDto {
    id: string;
    cnpj: string;
    cnaePrincipal: string;
    razaoSocial: string;
    nomeFantasia?: string;
    status: number;
    score: number;
    email?: string;
    telefone?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
}

export const getLeads = async (params?: any) => {
    return apiClient.get<any>("/api/app/lead", { params });
};

export const getLead = async (id: string) => {
    return apiClient.get<LeadDto>(`/api/app/lead/${id}`);
};

export const updateLeadStatus = async (id: string, status: number) => {
    return apiClient.put(`/api/app/lead/${id}/status`, { status });
};

export const addLeadNote = async (id: string, content: string) => {
    return apiClient.post(`/api/app/lead/${id}/note`, { content });
};
