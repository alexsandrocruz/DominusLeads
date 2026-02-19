const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface CnaeDto {
    codigo: string;
    descricao: string;
}

export interface MunicipalityDto {
    nome: string;
    uf: string;
    codigoIbge: string;
}

export const marketApi = {
    getCnaes: async (): Promise<CnaeDto[]> => {
        const response = await fetch(`${API_BASE_URL}/api/app/market/cnaes`);
        if (!response.ok) throw new Error('Failed to fetch CNAEs');
        return response.json();
    },

    getMunicipios: async (): Promise<MunicipalityDto[]> => {
        const response = await fetch(`${API_BASE_URL}/api/app/market/municipios`);
        if (!response.ok) throw new Error('Failed to fetch Municipalities');
        return response.json();
    }
};
