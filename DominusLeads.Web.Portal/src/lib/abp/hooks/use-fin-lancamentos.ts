import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api-client";

export interface FinLancamentoDto {
    id: string;
    idLancamento: number;
    idConta: number;
    idPlanoConta: number;
    idCentroCusto: number;
    operacao: string; // 'E' or 'S'
    valor: number;
    descricao: string;
    dataVencimento: string;
    quitado: boolean;
    ativo: boolean;
    idCadastro: number;
    idPedido: number;
    profissionalNome?: string;
}

interface GetFinLancamentosResponse {
    items: FinLancamentoDto[];
    totalCount: number;
}

export function useFinLancamentos(maxResultCount = 1000) {
    return useQuery({
        queryKey: ["fin-lancamentos", maxResultCount],
        queryFn: async () => {
            const response = await apiClient.get<GetFinLancamentosResponse>("/api/app/fin-lancamentos", {
                params: {
                    maxResultCount,
                    sorting: "dataVencimento desc"
                },
            });
            return response.data;
        },
    });
}
