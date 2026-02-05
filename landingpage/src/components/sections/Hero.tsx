'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Clock, CheckCircle } from 'lucide-react';

const metrics = [
    { icon: Shield, value: 'SOC 2', label: 'Compliant' },
    { icon: Clock, value: '99.9%', label: 'Uptime SLA' },
    { icon: CheckCircle, value: '24/7', label: 'Suporte' },
];

export default function Hero() {
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
            {/* Gradient orbs background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto max-w-6xl px-4 md:px-6 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-muted/20 bg-card/50 backdrop-blur-sm mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-sm text-muted-foreground uppercase tracking-wider">
                            Inteligência de Dados para Prospecção B2B
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
                    >
                        <span className="text-foreground">Transforme dados do CNPJ em </span>
                        <span className="text-gradient">Clientes Reais</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                    >
                        Plataforma enterprise-grade que utiliza a base oficial da Receita Federal
                        combinada com automação inteligente para entregar leads B2B qualificados
                        direto no seu WhatsApp.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <a
                            href="#pricing"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white text-base font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 glow-orange"
                        >
                            Iniciar Teste Grátis
                            <ArrowRight className="w-5 h-5" />
                        </a>
                        <a
                            href="#features"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-secondary hover:bg-secondary/80 text-foreground text-base font-semibold rounded-xl border border-muted/20 transition-all duration-200"
                        >
                            Explorar Módulos
                            <Play className="w-5 h-5" />
                        </a>
                    </motion.div>

                    {/* Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12"
                    >
                        {metrics.map((metric, index) => (
                            <div key={index} className="flex items-center gap-3 text-muted-foreground">
                                <metric.icon className="w-5 h-5" />
                                <span className="text-foreground font-semibold">{metric.value}</span>
                                <span>{metric.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
