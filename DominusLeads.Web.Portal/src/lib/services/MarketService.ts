import { apiClient } from "../abp/api-client";

export interface MarketSearchInput {
    municipio?: string;
    cnae?: string;
    bairro?: string;
    verticalId?: string;
    cnaeCodes?: string[];
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

export interface CnaeDto {
    codigo: string;
    descricao: string;
}

export interface MarketVerticalDto {
    id: string;
    nome: string;
    descricao?: string;
    icone?: string;
    cnaeIds: string[];
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

export const getCnaes = async (parentId?: string) => {
    return apiClient.get<CnaeDto[]>("/api/app/market/cnaes", { params: { parentId } });
};

export const getVerticals = async () => {
    return apiClient.get<MarketVerticalDto[]>("/api/app/market/verticals");
};

export const syncCnaes = async () => {
    return apiClient.post("/api/app/market/sync-cnaes");
};
