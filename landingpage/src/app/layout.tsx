import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-display',
    weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
    title: 'Dominus Leads | Prospecção B2B Inteligente',
    description:
        'Transforme dados do CNPJ em clientes reais. Utilize a base oficial da Receita Federal e automações inteligentes para encontrar, qualificar e entregar leads B2B prontos para fechar negócio.',
    keywords: ['leads', 'B2B', 'prospecção', 'CNPJ', 'WhatsApp', 'CRM', 'vendas'],
    openGraph: {
        title: 'Dominus Leads | Prospecção B2B Inteligente',
        description: 'Transforme dados do CNPJ em clientes reais no seu WhatsApp.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className={`${plusJakartaSans.variable} ${inter.variable}`}>
            <body className="min-h-screen bg-background text-foreground antialiased">
                {children}
            </body>
        </html>
    );
}
