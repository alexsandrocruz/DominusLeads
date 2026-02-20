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

export interface MarketVerticalDto {
    id: string;
    nome: string;
    descricao?: string;
    icone?: string;
    cnaeIds: string[];
}

export interface MarketSearchInputDto {
    municipio?: string;
    cnae?: string;
    bairro?: string;
    verticalId?: string;
    cnaeCodes?: string[];
}

export const marketApi = {
    getCnaes: async (parentId?: string): Promise<CnaeDto[]> => {
        const url = new URL(`${API_BASE_URL}/api/app/market/cnaes`);
        if (parentId) url.searchParams.append('parentId', parentId);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch CNAEs');
        return response.json();
    },

    getMunicipios: async (): Promise<MunicipalityDto[]> => {
        const response = await fetch(`${API_BASE_URL}/api/app/market/municipios`);
        if (!response.ok) throw new Error('Failed to fetch Municipalities');
        return response.json();
    },

    getVerticals: async (): Promise<MarketVerticalDto[]> => {
        const response = await fetch(`${API_BASE_URL}/api/app/market/verticals`);
        if (!response.ok) throw new Error('Failed to fetch Verticals');
        return response.json();
    },

    syncCnaes: async (): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/api/app/market/sync-cnaes`, { method: 'POST' });
        if (!response.ok) throw new Error('Failed to sync CNAEs');
    },

    searchExternal: async (input: MarketSearchInputDto): Promise<any[]> => {
        const response = await fetch(`${API_BASE_URL}/api/app/market/search-external`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
        });
        if (!response.ok) throw new Error('Failed to search leads');
        return response.json();
    }
};
