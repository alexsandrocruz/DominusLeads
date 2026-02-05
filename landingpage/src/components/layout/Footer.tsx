'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Twitter, Linkedin, Instagram } from 'lucide-react';

const footerLinks = {
    produto: [
        { label: 'Módulos', href: '#features' },
        { label: 'Preços', href: '#pricing' },
        { label: 'Integrações', href: '#' },
        { label: 'Roadmap', href: '#' },
    ],
    empresa: [
        { label: 'Sobre nós', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Carreiras', href: '#' },
        { label: 'Contato', href: '#' },
    ],
    recursos: [
        { label: 'Documentação', href: '#' },
        { label: 'API Reference', href: '#' },
        { label: 'Status', href: '#' },
        { label: 'Changelog', href: '#' },
    ],
    legal: [
        { label: 'Termos de Uso', href: '#' },
        { label: 'Privacidade', href: '#' },
        { label: 'LGPD', href: '#' },
        { label: 'Segurança', href: '#' },
    ],
};

const socialLinks = [
    { icon: Twitter, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Instagram, href: '#' },
];

export default function Footer() {
    return (
        <>
            {/* CTA Banner */}
            <section className="py-20 relative overflow-hidden">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/5" />

                <div className="container mx-auto max-w-4xl px-4 md:px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground">
                            Pronto para Orquestrar sua<br />
                            <span className="text-gradient">Operação Comercial?</span>
                        </h2>
                        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
                            Junte-se a centenas de empresas que já escalaram sua prospecção
                            com inteligência de dados.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="#pricing"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white text-base font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 glow-orange"
                            >
                                Começar Teste Grátis
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 px-8 py-4 text-muted-foreground hover:text-foreground text-base font-semibold transition-colors"
                            >
                                Agendar Demo
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 border-t border-muted/10">
                <div className="container mx-auto max-w-7xl px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                        {/* Brand */}
                        <div className="col-span-2">
                            <a href="/" className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5zm4 2v2h8V7H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-foreground">
                                    Dominus<span className="text-accent">Leads</span>
                                </span>
                            </a>
                            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                                Sua máquina de prospecção B2B alimentada por inteligência de dados.
                            </p>
                            {/* Social Links */}
                            <div className="mt-6 flex items-center gap-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                                    >
                                        <social.icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Produto */}
                        <div>
                            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                                Produto
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.produto.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Empresa */}
                        <div>
                            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                                Empresa
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.empresa.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recursos */}
                        <div>
                            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                                Recursos
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.recursos.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                                Legal
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-12 pt-8 border-t border-muted/10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                            © 2026 Dominus Leads. Todos os direitos reservados.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Um produto <span className="text-accent font-semibold">Sapienza</span>
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
