import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-plus-jakarta",
    weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Dominus Leads | B2B SaaS Lead Generation",
    description: "Identify and qualify B2B leads automatically using data-driven insights and official CNPJ data.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={plusJakartaSans.variable}>
                {children}
            </body>
        </html>
    );
}
