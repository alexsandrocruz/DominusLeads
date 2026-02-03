export interface DocumentType {
    id: string;
    code: string;
    name: string;
    keywords: string[];
}

export interface Document {
    id: string;
    name: string;
    documentTypeId?: string;
    ocrStatus: 'Processing' | 'Completed' | 'Error';
    ocrConfidence?: number;
    ocrText?: string;
    createdAt: string;
}

export interface ChecklistItem {
    id: string;
    documentTypeId: string;
    name: string;
    isMandatory: boolean;
}

export interface ChecklistFinding {
    id: string;
    checklistItemId: string;
    foundStatus: 'Found' | 'NotFound' | 'Partial' | 'Uncertain';
    matchedDocumentId?: string;
    evidence?: {
        page: number;
        text: string;
    };
}

export const MOCK_DOCUMENT_TYPES: DocumentType[] = [
    { id: '1', code: 'PROCURACAO', name: 'Procuração', keywords: ['procuração', 'outorgante', 'outorgado'] },
    { id: '2', code: 'DOC_PESSOAL', name: 'Documento Pessoal', keywords: ['rg', 'cpf', 'cnh', 'identidade'] },
    { id: '3', code: 'COMPROVANTE_RESIDENCIA', name: 'Comprovante de Residência', keywords: ['luz', 'água', 'telefone', 'endereço'] },
    { id: '4', code: 'CONTRATO', name: 'Contrato', keywords: ['contrato', 'cláusula', 'foro'] },
];

export const MOCK_DOCUMENTS: Document[] = [
    {
        id: 'd1',
        name: 'procuracao_assinada.pdf',
        documentTypeId: '1',
        ocrStatus: 'Completed',
        ocrConfidence: 98,
        ocrText: 'PROCURAÇÃO AD JUDICIA... Outorgante: Alexsandro Cruz...',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'd2',
        name: 'cnh_frente.jpg',
        documentTypeId: '2',
        ocrStatus: 'Completed',
        ocrConfidence: 85,
        ocrText: 'CARTEIRA NACIONAL DE HABILITAÇÃO... NOME: ALEXSANDRO CRUZ...',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'd3',
        name: 'conta_luz_jan.pdf',
        documentTypeId: '3',
        ocrStatus: 'Completed',
        ocrConfidence: 92,
        ocrText: 'EQUATORIAL ENERGIA... Endereço de instalação: Rua das Flores...',
        createdAt: new Date().toISOString(),
    },
];

export const MOCK_CHECKLIST_TEMPLATE: ChecklistItem[] = [
    { id: 'c1', documentTypeId: '1', name: 'Procuração', isMandatory: true },
    { id: 'c2', documentTypeId: '2', name: 'Documento de Identidade', isMandatory: true },
    { id: 'c3', documentTypeId: '3', name: 'Comprovante de Residência', isMandatory: true },
    { id: 'c4', documentTypeId: '4', name: 'Contrato de Honorários', isMandatory: false },
];
