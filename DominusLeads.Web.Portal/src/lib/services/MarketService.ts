import { apiClient } from "../abp/api-client";

export interface MarketSearchInput {
    municipio?: string;
    cnae?: string;
    bairro?: string;
}

export interface MarketLeadDto {
    cnpj?: string;
    cnpjBasico?: string;
    cnpjOrdem?: string;
    cnpjDv?: string;
    nomeFantasia?: string;
    razaoSocial?: string;
    cnaes: string[];
    tipoLogradouro?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    municipio?: string;
    uf?: string;
    cep?: string;
    ddd1?: string;
    telefone1?: string;
    ddd2?: string;
    telefone2?: string;
    dddFax?: string;
    fax?: string;
    correioEletronico?: string;
    telefoneFormatado?: string;
    situacaoCadastral?: string;
    dataSituacaoCadastral?: string;
    dataInicioAtividade?: string;
    identificadorMatrizFilial?: string;
    isExtracted: boolean;
}

export interface ExtractLeadsInput {
    cnpjs: string[];
}

export const searchExternalLeads = async (input: MarketSearchInput) => {
    return apiClient.post<MarketLeadDto[]>("/api/app/market/search-external", input);
};

export const extractLeads = async (input: ExtractLeadsInput) => {
    return apiClient.post("/api/app/market/extract-leads", input);
};
