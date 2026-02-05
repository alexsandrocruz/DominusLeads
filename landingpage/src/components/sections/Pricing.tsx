'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

const plans = [
    {
        name: 'Trial',
        description: 'Experimente sem compromisso',
        price: 'R$ 0',
        period: '14 dias',
        features: [
            'Acesso completo por 14 dias',
            '2 usuários',
            '50 clientes',
            '100 leads/mês',
            '50 mensagens WhatsApp/mês',
            '50.000 tokens IA/mês',
            'Suporte por email',
        ],
        cta: 'Começar Agora',
        popular: false,
    },
    {
        name: 'Pro',
        description: 'Para operações em crescimento',
        price: 'R$ 197',
        period: '/mês',
        features: [
            '5 usuários',
            '100 clientes',
            '500 leads/mês',
            '500 mensagens WhatsApp/mês',
            '200.000 tokens IA/mês',
            '5 GB de armazenamento',
            'Automação de processos',
            'Suporte prioritário',
        ],
        cta: 'Começar Agora',
        popular: true,
    },
    {
        name: 'Business',
        description: 'Para operações de alta demanda',
        price: 'R$ 497',
        period: '/mês',
        features: [
            '15 usuários',
            'Clientes ilimitados',
            '2.000 leads/mês',
            '2.000 mensagens WhatsApp/mês',
            '1.000.000 tokens IA/mês',
            '20 GB de armazenamento',
            'Super AI ilimitado',
            'API completa',
            'Gerente de sucesso dedicado',
        ],
        cta: 'Começar Agora',
        popular: false,
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

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 relative">
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
                        Investimento
                    </span>
                    <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground">
                        Planos Escaláveis
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                        Comece grátis, escale conforme sua operação cresce. Sem taxas ocultas, sem surpresas.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={cn(
                                'glass-card p-6 flex flex-col relative',
                                plan.popular && 'border-accent/30'
                            )}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="inline-block px-4 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                                        Mais Escolhido
                                    </span>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="text-center pt-2">
                                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                            </div>

                            {/* Price */}
                            <div className="text-center mt-6">
                                <span className="text-4xl font-extrabold text-foreground font-display">
                                    {plan.price}
                                </span>
                                <span className="text-muted-foreground text-sm ml-1">
                                    {plan.period}
                                </span>
                            </div>

                            {/* Features */}
                            <ul className="mt-8 space-y-3 flex-grow">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <a
                                href="#"
                                className={cn(
                                    'mt-8 w-full py-3 px-4 rounded-xl font-semibold text-center transition-all duration-200 flex items-center justify-center gap-2',
                                    plan.popular
                                        ? 'bg-accent hover:bg-accent/90 text-white glow-orange'
                                        : 'bg-secondary hover:bg-secondary/80 text-foreground border border-muted/20'
                                )}
                            >
                                {plan.cta}
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
