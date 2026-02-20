import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ChevronLeft, HelpCircle, Search as SearchIcon, Building, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { marketApi } from '../lib/api';
import type { CnaeDto, MunicipalityDto, MarketVerticalDto } from '../lib/api';
import { VerticalSelector } from '../components/market/VerticalSelector';
import { CnaeSelectorModal } from '../components/market/CnaeSelectorModal';
import { Layers, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

export const Search = () => {
    const navigate = useNavigate();

    const [cnaes, setCnaes] = useState<CnaeDto[]>([]);
    const [municipios, setMunicipios] = useState<MunicipalityDto[]>([]);
    const [verticals, setVerticals] = useState<MarketVerticalDto[]>([]);

    const [searchMode, setSearchMode] = useState<'quick' | 'cnae' | 'vertical'>('quick');
    const [selectedCnae, setSelectedCnae] = useState('');
    const [selectedCnaesList, setSelectedCnaesList] = useState<CnaeDto[]>([]);
    const [selectedVerticalId, setSelectedVerticalId] = useState<string>();
    const [isCnaeModalOpen, setIsCnaeModalOpen] = useState(false);

    const [selectedMunicipio, setSelectedMunicipio] = useState('');
    const [selectedUf, setSelectedUf] = useState('');
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [cnaesData, municipiosData, verticalsData] = await Promise.all([
                    marketApi.getCnaes(),
                    marketApi.getMunicipios(),
                    marketApi.getVerticals()
                ]);
                setCnaes(cnaesData);
                setMunicipios(municipiosData);
                setVerticals(verticalsData);
            } catch (error) {
                console.error('Failed to load market data', error);
            }
        };
        loadData();
    }, []);

    const handleSearch = async () => {
        setIsLoadingResults(true);
        try {
            const data = await marketApi.searchExternal({
                municipio: selectedMunicipio,
                cnae: searchMode === 'quick' ? selectedCnae : undefined,
                cnaeCodes: searchMode === 'cnae' ? selectedCnaesList.map(c => c.codigo) : undefined,
                verticalId: searchMode === 'vertical' ? selectedVerticalId : undefined
            });
            setResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingResults(false);
        }
    };

    const filteredMunicipios = municipios.filter(m => !selectedUf || m.uf === selectedUf);

    return (
        <Layout>
            <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b dark:border-slate-800 p-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 dark:text-white"><ChevronLeft className="h-6 w-6" /></button>
                <h2 className="text-lg font-bold dark:text-white">Encontrar Novos Leads</h2>
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 dark:text-white"><HelpCircle className="h-5 w-5" /></button>
            </div>

            <main className="p-4 space-y-6 pb-32">
                <Input icon={<SearchIcon className="h-5 w-5" />} placeholder="Buscar por nome da empresa" />

                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold dark:text-white">Critérios de Filtro</h3>
                    <span className="text-primary text-sm font-semibold cursor-pointer">Limpar tudo</span>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-2">
                    {(['quick', 'vertical', 'cnae'] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setSearchMode(mode)}
                            className={cn(
                                "flex-1 py-3 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-2",
                                searchMode === mode
                                    ? "bg-white dark:bg-slate-700 shadow-sm dark:text-white"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            {mode === 'quick' && <Rocket className="h-3 w-3" />}
                            {mode === 'vertical' && <Layers className="h-3 w-3" />}
                            {mode === 'cnae' && <Filter className="h-3 w-3" />}
                            {mode === 'quick' ? 'Rápida' : mode === 'vertical' ? 'Verticais' : 'CNAE'}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {searchMode === 'quick' && (
                        <div>
                            <p className="text-sm font-medium pb-2 dark:text-white">Atividade Econômica (CNAE)</p>
                            <select
                                className="w-full h-14 bg-white dark:bg-[#192233] dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl px-4 outline-none"
                                value={selectedCnae}
                                onChange={(e) => setSelectedCnae(e.target.value)}
                            >
                                <option value="">Selecione um CNAE</option>
                                {cnaes.map(cnae => (
                                    <option key={cnae.codigo} value={cnae.codigo}>
                                        {cnae.codigo} - {cnae.descricao}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {searchMode === 'vertical' && (
                        <div className="space-y-3">
                            <p className="text-sm font-medium dark:text-white">Segmento de Mercado (Vertical)</p>
                            <VerticalSelector
                                verticals={verticals}
                                selectedId={selectedVerticalId}
                                onSelect={setSelectedVerticalId}
                            />
                        </div>
                    )}

                    {searchMode === 'cnae' && (
                        <div className="space-y-3">
                            <p className="text-sm font-medium dark:text-white">Seleção Múltipla de CNAEs</p>
                            <div
                                className="w-full p-4 bg-white dark:bg-[#192233] border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-primary transition-colors min-h-[56px] flex flex-wrap gap-2 items-center"
                                onClick={() => setIsCnaeModalOpen(true)}
                            >
                                {selectedCnaesList.length === 0 ? (
                                    <span className="text-slate-400">Clique para selecionar CNAEs...</span>
                                ) : (
                                    selectedCnaesList.map(c => (
                                        <span key={c.codigo} className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-md border border-primary/20">
                                            {c.codigo}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <div className="w-24">
                            <p className="text-sm font-medium pb-2 dark:text-white">Estado</p>
                            <Input
                                placeholder="UF"
                                className="text-center"
                                value={selectedUf}
                                onChange={(e) => setSelectedUf(e.target.value.toUpperCase())}
                                maxLength={2}
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium pb-2 dark:text-white">Cidade</p>
                            <input
                                list="municipios-list"
                                placeholder="Ex: São Paulo"
                                className="w-full h-14 bg-white dark:bg-[#192233] dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl px-4 outline-none"
                                value={selectedMunicipio}
                                onChange={(e) => setSelectedMunicipio(e.target.value)}
                            />
                            <datalist id="municipios-list">
                                {filteredMunicipios.map(m => (
                                    <option key={m.codigoIbge} value={m.nome} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    <Button
                        className="w-full h-14"
                        variant="secondary"
                        onClick={handleSearch}
                        isLoading={isLoadingResults}
                        disabled={!selectedMunicipio || (searchMode === 'quick' && !selectedCnae) || (searchMode === 'vertical' && !selectedVerticalId) || (searchMode === 'cnae' && selectedCnaesList.length === 0)}
                    >
                        Pesquisar Empresas
                    </Button>
                </div>

                <div className="bg-white dark:bg-[#192233]/50 p-4 rounded-2xl border dark:border-slate-800 space-y-3">
                    <p className="text-xs uppercase font-bold text-slate-500">Prévia dos Resultados</p>
                    {results.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">Nenhum resultado para os filtros atuais.</p>
                    ) : (
                        <>
                            <p className="text-2xl font-bold dark:text-white">{results.length} <span className="text-sm text-slate-400 font-normal">empresas encontradas</span></p>
                            {results.slice(0, 5).map((lead, i) => (
                                <div key={i} className="bg-slate-50 dark:bg-[#111722] p-3 rounded-xl border-slate-100 dark:border-slate-800 border flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><Building className="h-5 w-5" /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold dark:text-white truncate">{lead.razaoSocial || lead.nomeFantasia}</p>
                                        <p className="text-xs text-slate-500">{lead.municipio}, {lead.uf}</p>
                                    </div>
                                    <span className="text-[10px] bg-slate-200 dark:bg-slate-800 dark:text-slate-300 px-2 py-1 rounded shrink-0">{lead.cnaes?.[0]?.substring(0, 5) || 'N/A'}</span>
                                </div>
                            ))}
                            {results.length > 5 && (
                                <p className="text-[10px] text-center text-slate-400">Exibindo 5 de {results.length} resultados</p>
                            )}
                        </>
                    )}
                </div>

                <CnaeSelectorModal
                    isOpen={isCnaeModalOpen}
                    onClose={() => setIsCnaeModalOpen(false)}
                    selectedCnaes={selectedCnaesList}
                    onSelect={setSelectedCnaesList}
                />
            </main>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t dark:from-background-dark from-background-light pt-8 z-40 pb-24 md:pb-4">
                <Button className="w-full h-14 text-lg shadow-xl shadow-primary/20" onClick={() => navigate('/automation/new')}>
                    <Rocket className="h-5 w-5 mr-2" /> Iniciar Campanha
                </Button>
            </div>
        </Layout>
    );
};
