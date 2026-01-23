import styles from './Features.module.css';

const features = [
    {
        title: 'Base de Dados RFB',
        description: 'Acesse milhões de empresas ativas com dados atualizados mensalmente da Receita Federal.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        )
    },
    {
        title: 'Filtro por CNAE e Região',
        description: 'Segmente seus leads por código de atividade, cidade, estado ou faturamento presumido.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
        )
    },
    {
        title: 'Automação no WhatsApp',
        description: 'Qualifique leads automaticamente via WhatsApp com fluxos inteligentes de conversa.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.5 8.5 0 0 1 4.7 1.4L22 3.5l-1.5 4.7c.6 1 1 2.2 1 3.3z" /></svg>
        )
    },
    {
        title: 'Integração CRM Dominus',
        description: 'Receba leads qualificados diretamente no seu funil de vendas, prontos para o fechamento.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        )
    }
];

export default function Features() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.subtitle}>Funcionalidades</h2>
                    <h3 className={styles.title}>Tudo o que você precisa para <br /> escalar suas vendas B2B</h3>
                </div>
                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.iconWrapper}>{feature.icon}</div>
                            <h4 className={styles.cardTitle}>{feature.title}</h4>
                            <p className={styles.cardDescription}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
