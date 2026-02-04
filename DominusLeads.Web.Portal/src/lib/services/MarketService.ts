import { apiClient } from "../abp/api-client";

export interface MarketSearchInput {
    municipio?: string;
    cnae?: string;
    bairro?: string;
}

export interface MarketLeadDto {
    cnpj: string;
    nomeFantasia?: string;
    razaoSocial: string;
    cnaePrincipal?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
    telefone?: string;
    email?: string;
    isExtracted: boolean;
}

export interface ExtractLeadsInput {
    cnpjs: string[];
}

export const searchExternalLeads = async (input: MarketSearchInput) => {
    return apiClient.get<MarketLeadDto[]>("/api/app/market/search-external", {
        params: input,
    });
};

export const extractLeads = async (input: ExtractLeadsInput) => {
    return apiClient.post("/api/app/market/extract-leads", input);
};
