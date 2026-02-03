import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Info, MoreVertical, Eye } from 'lucide-react';
import { MOCK_DOCUMENTS, MOCK_CHECKLIST_TEMPLATE, type Document } from '../../mocks/documentMocks';
import ChecklistSidebar from '@/components/documents/ChecklistSidebar';
import { AppShell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/Dropdown-menu";

const DocumentIngestionPage: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Processing': return <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
            case 'Error': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <AppShell>
            <div className="flex flex-col lg:flex-row h-[calc(100vh-10rem)] gap-6">
                <div className="flex-1 overflow-auto space-y-6 pr-1">
                    <header>
                        <h1 className="text-3xl font-bold tracking-tight">Ingestão de Documentos</h1>
                        <p className="text-muted-foreground">Suba os documentos do processo para análise automática e conferência de checklist.</p>
                    </header>

                    {/* Upload Area */}
                    <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer group rounded-3xl">
                        <CardContent className="flex flex-col items-center justify-center p-12">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Clique ou arraste arquivos aqui</h3>
                            <p className="text-muted-foreground text-sm text-center">
                                Suporta PDF pesquisável, escaneado e imagens (JPG, PNG).<br />
                                <span className="text-xs font-medium">Tamanho máximo: 20MB por arquivo.</span>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Document List */}
                    <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-card">
                        <CardHeader className="p-6 border-b flex flex-row justify-between items-center space-y-0">
                            <CardTitle className="text-lg font-semibold">Documentos Enviados</CardTitle>
                            <Badge variant="secondary" className="rounded-full px-3">
                                {documents.length} Arquivos
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="p-5 flex items-center hover:bg-muted/30 transition-colors">
                                        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mr-4">
                                            <FileText className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0 mr-4">
                                            <h4 className="font-semibold truncate">{doc.name}</h4>
                                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                                Enviado em {new Date(doc.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-8 mr-6">
                                            <div className="text-center">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 leading-none">Status</p>
                                                <div className="flex items-center justify-center gap-2">
                                                    {getStatusIcon(doc.ocrStatus)}
                                                </div>
                                            </div>
                                            <div className="text-center w-16">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 leading-none">Confiança</p>
                                                <span className={`text-sm font-bold ${(doc.ocrConfidence || 0) > 90
                                                    ? 'text-emerald-500'
                                                    : (doc.ocrConfidence || 0) > 70
                                                        ? 'text-amber-500'
                                                        : 'text-rose-500'
                                                    }`}>
                                                    {doc.ocrConfidence}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" className="h-9 gap-2 font-bold text-primary hover:bg-primary/10 rounded-xl">
                                                <Eye className="size-4" />
                                                <span className="hidden sm:inline">Ver OCR</span>
                                            </Button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                                                        <MoreVertical className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-xl border-muted/50">
                                                    <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-medium">
                                                        Reclassificar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-medium text-rose-500 focus:text-rose-600 focus:bg-rose-50/50">
                                                        Remover
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Checklist Sidebar */}
                <div className="w-full lg:w-[400px]">
                    <ChecklistSidebar items={MOCK_CHECKLIST_TEMPLATE} documents={documents} />
                </div>
            </div>
        </AppShell>
    );
};

export default DocumentIngestionPage;
