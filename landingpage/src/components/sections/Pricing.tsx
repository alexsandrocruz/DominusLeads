import styles from './Pricing.module.css';

const plans = [
    {
        name: 'Starter',
        price: 'R$ 497',
        credits: '50 Créditos',
        features: ['Busca por CNAE/Cidade', 'Automação WhatsApp', 'Integração CRM Dominus', 'Suporte via Chat'],
        isPopular: false
    },
    {
        name: 'Professional',
        price: 'R$ 997',
        credits: '150 Créditos',
        features: ['Tudo no Starter', 'Templates Personalizados', 'Relatórios de Conversão', 'Suporte Prioritário'],
        isPopular: true
    },
    {
        name: 'Enterprise',
        price: 'Sob Consulta',
        credits: 'Créditos Ilimitados',
        features: ['Tudo no Professional', 'Dados de Faturamento', 'API de Integração', 'Account Manager'],
        isPopular: false
    }
];

export default function Pricing() {
    return (
        <section className={styles.pricing}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.subtitle}>Planos e Preços</h2>
                    <h3 className={styles.title}>O modelo mais justo do Brasil</h3>
                    <p className={styles.description}>
                        Pague apenas por leads qualificados. Leads inválidos ou sem resposta não consomem seus créditos.
                    </p>
                </div>
                <div className={styles.grid}>
                    {plans.map((plan, index) => (
                        <div key={index} className={`${styles.card} ${plan.isPopular ? styles.popular : ''}`}>
                            {plan.isPopular && <span className={styles.badge}>Mais Popular</span>}
                            <h4 className={styles.planName}>{plan.name}</h4>
                            <div className={styles.priceWrapper}>
                                <span className={styles.price}>{plan.price}</span>
                                <span className={styles.period}>/mês</span>
                            </div>
                            <p className={styles.credits}>{plan.credits}</p>
                            <ul className={styles.featuresList}>
                                {plan.features.map((feature, i) => (
                                    <li key={i} className={styles.featureItem}>
                                        <span className={styles.check}>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button className={`${styles.cta} ${plan.isPopular ? styles.ctaPopular : ''}`}>
                                Escolher Plano
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
