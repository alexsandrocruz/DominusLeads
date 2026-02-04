import { apiClient } from "../abp/api-client";

export interface TransactionDto {
    id: string;
    tipo: number;
    valor: number;
    descricao: string;
    status: number;
    creationTime: string;
}

export interface CreditDto {
    saldoAtual: number;
    ultimaAtualizacao: string;
    transactions: TransactionDto[];
}

export const getCredit = async () => {
    return apiClient.get<CreditDto>("/api/app/credit");
};

export const addCredit = async (valor: number, descricao: string) => {
    return apiClient.post("/api/app/credit/add-credit", { valor, descricao });
};
