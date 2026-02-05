'use client';

import { motion } from 'framer-motion';
import {
    Database,
    Filter,
    MessageCircle,
    Users,
    FileText,
    Workflow,
    Wallet
} from 'lucide-react';

const features = [
    {
        icon: Database,
        color: 'bg-orange-500/10 text-orange-500',
        title: 'Base de Dados RFB',
        subtitle: 'Dados Oficiais',
        description: 'Acesse mais de 55 milhões de empresas ativas com dados atualizados mensalmente da Receita Federal.',
    },
    {
        icon: Filter,
        color: 'bg-purple-500/10 text-purple-500',
        title: 'Filtros Avançados',
        subtitle: 'Segmentação Inteligente',
        description: 'Segmente por CNAE, região, porte, faturamento e +20 critérios para encontrar seu ICP exato.',
    },
    {
        icon: MessageCircle,
        color: 'bg-green-500/10 text-green-500',
        title: 'Automação WhatsApp',
        subtitle: 'Prospecção Ativa',
        description: 'Qualifique leads automaticamente via WhatsApp com fluxos de conversa personalizados.',
    },
    {
        icon: Users,
        color: 'bg-teal-500/10 text-teal-500',
        title: 'CRM Integrado',
        subtitle: 'Governança Comercial',
        description: 'Receba leads qualificados diretamente no funil de vendas com timeline unificada.',
    },
    {
        icon: FileText,
        color: 'bg-blue-500/10 text-blue-500',
        title: 'Propostas & Contratos',
        subtitle: 'Fluxo Comercial',
        description: 'Visual Builder profissional para criar propostas e converter em contratos automaticamente.',
    },
    {
        icon: Wallet,
        color: 'bg-emerald-500/10 text-emerald-500',
        title: 'Financeiro Integrado',
        subtitle: 'Governança Financeira',
        description: 'Faturas automáticas, transações recorrentes e fluxo de caixa em tempo real.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function Features() {
    return (
        <section id="features" className="py-24 relative">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="text-accent text-sm font-semibold uppercase tracking-wider">
                        Arquitetura Modular
                    </span>
                    <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground">
                        Módulos que Trabalham em Sinergia
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                        Cada módulo foi projetado para resolver um problema específico, mas a
                        verdadeira potência está na integração nativa entre todos eles.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="glass-card p-6 hover:border-muted/20 transition-all duration-300 group"
                        >
                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-4`}>
                                <feature.icon className="w-6 h-6" />
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                                {feature.title}
                            </h3>

                            {/* Subtitle */}
                            <p className="text-accent text-sm font-medium mt-1">
                                {feature.subtitle}
                            </p>

                            {/* Description */}
                            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
