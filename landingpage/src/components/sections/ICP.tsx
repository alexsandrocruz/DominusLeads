'use client';

import { motion } from 'framer-motion';
import {
    Building2,
    MapPin,
    Megaphone,
    CheckCircle
} from 'lucide-react';

const segments = [
    {
        icon: Building2,
        color: 'bg-orange-500/10 text-orange-500',
        title: 'Serviços B2B',
        description: 'Advogados, Contadores, Consultorias de RH e TI. Empresas que dependem de prospecção consultiva e qualificada.',
    },
    {
        icon: MapPin,
        color: 'bg-blue-500/10 text-blue-500',
        title: 'Negócios Locais',
        description: 'Manutenção Industrial, Segurança, Facilities. Foque em segmentos específicos dentro de uma região geográfica.',
    },
    {
        icon: Megaphone,
        color: 'bg-purple-500/10 text-purple-500',
        title: 'Agências e SDRs',
        description: 'Agências de Marketing, Consultores Comerciais. Gerencie múltiplos clientes e escale sua entrega de leads.',
    },
];

const benefits = [
    'Ideal para Vendas Complexas',
    'Foco Total em Resultados CNPJ',
    'Perfeito para Escala Regional',
    'ROI Mensurável por Campanha',
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

export default function ICP() {
    return (
        <section id="icp" className="py-24 relative">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left Column - Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-accent text-sm font-semibold uppercase tracking-wider">
                            Para quem é?
                        </span>
                        <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
                            Foque onde o<br />
                            <span className="text-gradient">resultado acontece</span>
                        </h2>
                        <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
                            O Dominus Leads foi desenhado para negócios que vendem para
                            outras empresas (B2B) e precisam de previsibilidade no
                            funil de vendas.
                        </p>

                        {/* Benefits List */}
                        <motion.ul
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="mt-8 space-y-4"
                        >
                            {benefits.map((benefit, index) => (
                                <motion.li
                                    key={index}
                                    variants={itemVariants}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                                    <span className="text-foreground font-medium">{benefit}</span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>

                    {/* Right Column - Segment Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        {segments.map((segment, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="glass-card p-6 flex items-start gap-5 hover:border-accent/30 hover:shadow-[0_0_30px_rgba(234,88,12,0.05)] transition-all duration-500 group relative overflow-hidden"
                            >
                                <div className="absolute -right-4 -top-4 w-20 h-20 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors" />

                                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${segment.color} flex items-center justify-center ring-1 ring-white/5`}>
                                    <segment.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-accent transition-colors">
                                        {segment.title}
                                    </h3>
                                    <p className="mt-2 text-muted-foreground text-sm leading-relaxed font-medium">
                                        {segment.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
