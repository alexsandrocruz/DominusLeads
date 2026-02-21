import { apiClient } from "../abp/api-client";

export interface SequenceStepDto {
    id: string;
    order: number;
    type: number;
    config?: string;
}

export interface SequenceDto {
    id: string;
    nome: string;
    descricao?: string;
    isActive: boolean;
    steps: SequenceStepDto[];
    executionCount: number;
}

export interface CreateUpdateSequenceStepDto {
    order: number;
    type: number;
    config?: string;
}

export interface CreateUpdateSequenceDto {
    nome: string;
    descricao?: string;
    isActive: boolean;
    steps: CreateUpdateSequenceStepDto[];
}

export interface StepExecutionDto {
    id: string;
    stepIndex: number;
    status: number;
    executedAt: string;
    result?: string;
}

export interface SequenceExecutionDto {
    id: string;
    sequenceId: string;
    sequenceName: string;
    leadId: string;
    leadName: string;
    currentStepIndex: number;
    totalSteps: number;
    status: number;
    nextActionAt?: string;
    lastClassification?: string;
    lastReply?: string;
    creationTime: string;
    stepExecutions: StepExecutionDto[];
}

// Step type enum mapping
export const StepType = {
    SendMessage: 1,
    WaitForReply: 2,
    Wait: 3,
    ClassifyResponse: 4,
    UpdateStatus: 5,
    AddNote: 6,
    Condition: 7,
} as const;

export const StepTypeLabels: Record<number, string> = {
    1: "Enviar Mensagem",
    2: "Aguardar Resposta",
    3: "Aguardar (Delay)",
    4: "Classificar Resposta",
    5: "Atualizar Status",
    6: "Adicionar Nota",
    7: "Condição",
};

export const StepTypeIcons: Record<number, string> = {
    1: "send",
    2: "message-circle",
    3: "clock",
    4: "brain",
    5: "git-branch",
    6: "file-text",
    7: "split",
};

export const ExecutionStatusLabels: Record<number, string> = {
    1: "Pendente",
    2: "Executando",
    3: "Aguardando Resposta",
    4: "Aguardando Delay",
    5: "Pausada",
    6: "Concluída",
    7: "Falhou",
    8: "Cancelada",
};

// API functions
export const getSequences = async () => {
    return apiClient.get<SequenceDto[]>("/api/app/sequence");
};

export const getSequence = async (id: string) => {
    return apiClient.get<SequenceDto>(`/api/app/sequence/${id}`);
};

export const createSequence = async (input: CreateUpdateSequenceDto) => {
    return apiClient.post<SequenceDto>("/api/app/sequence", input);
};

export const updateSequence = async (id: string, input: CreateUpdateSequenceDto) => {
    return apiClient.put<SequenceDto>(`/api/app/sequence/${id}`, input);
};

export const deleteSequence = async (id: string) => {
    return apiClient.delete(`/api/app/sequence/${id}`);
};

export const toggleSequenceActive = async (id: string) => {
    return apiClient.post(`/api/app/sequence/${id}/toggle-active`);
};

export const startExecution = async (sequenceId: string, leadId: string) => {
    return apiClient.post<SequenceExecutionDto>(`/api/app/sequence/${sequenceId}/start-execution`, null, { params: { leadId } });
};

export const cancelExecution = async (executionId: string) => {
    return apiClient.post(`/api/app/sequence/cancel-execution`, null, { params: { executionId } });
};

export const getExecutions = async (sequenceId?: string) => {
    return apiClient.get<SequenceExecutionDto[]>("/api/app/sequence/executions", { params: { sequenceId } });
};
