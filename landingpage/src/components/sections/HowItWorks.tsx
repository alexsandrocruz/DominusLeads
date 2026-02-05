'use client';

import { motion } from 'framer-motion';
import {
    Database,
    Target,
    MessageSquare,
    UserCheck
} from 'lucide-react';

const steps = [
    {
        number: '01',
        icon: Database,
        title: 'Mineração de Dados',
        description: 'Nossa engine processa mensalmente a base da Receita Federal, selecionando empresas ativas com base no seu CNAE alvo.',
    },
    {
        number: '02',
        icon: Target,
        title: 'Segmentação Inteligente',
        description: 'Você define a região, o porte e o tempo de abertura. Nós filtramos apenas as empresas com maior probabilidade de conversão.',
    },
    {
        number: '03',
        icon: MessageSquare,
        title: 'Abordagem Automatizada',
        description: 'O sistema inicia uma conversa via WhatsApp para validar o decisor e entender o interesse real no seu produto/serviço.',
    },
    {
        number: '04',
        icon: UserCheck,
        title: 'Lead Qualificado no CRM',
        description: 'Apenas os leads que demonstraram interesse e foram qualificados são entregues no seu CRM Dominus para o fechamento.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 relative">
            <div className="container mx-auto max-w-4xl px-4 md:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="text-accent text-sm font-semibold uppercase tracking-wider">
                        Como funciona?
                    </span>
                    <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground">
                        Do dado bruto ao<br />
                        <span className="text-gradient">lead qualificado</span>
                    </h2>
                </motion.div>

                {/* Steps */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* Vertical line */}
                    <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent via-accent/50 to-transparent hidden md:block opacity-30" />

                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="relative md:pl-20"
                            >
                                {/* Step number - positioned on the line */}
                                <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-2xl bg-[#0f172a] border border-accent/30 text-accent font-black text-xl font-display shadow-[0_0_20px_rgba(234,88,12,0.2)]">
                                    {step.number}
                                </div>

                                {/* Card */}
                                <div className="glass-card p-8 hover:border-accent/30 hover:shadow-[0_0_30px_rgba(234,88,12,0.05)] transition-all duration-500 group">
                                    <div className="flex items-start gap-6">
                                        {/* Mobile number */}
                                        <div className="md:hidden flex-shrink-0 w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black text-sm font-display">
                                            {step.number}
                                        </div>

                                        {/* Icon */}
                                        <div className="hidden md:flex flex-shrink-0 w-14 h-14 rounded-2xl bg-accent/5 border border-accent/10 items-center justify-center group-hover:bg-accent/10 transition-colors">
                                            <step.icon className="w-7 h-7 text-accent" />
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-black text-white tracking-tight group-hover:text-accent transition-colors">
                                                {step.title}
                                            </h3>
                                            <p className="mt-3 text-muted-foreground text-base leading-relaxed font-medium">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
