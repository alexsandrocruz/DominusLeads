import styles from './ICP.module.css';

const targets = [
    {
        category: 'Serviços B2B',
        examples: 'Advogados, Contadores, Consultorias de RH e TI.',
        description: 'Empresas que dependem de prospecção consultiva e qualificada.'
    },
    {
        category: 'Negócios Locais',
        examples: 'Manutenção Industrial, Segurança, Facilities.',
        description: 'Foque em segmentos específicos dentro de uma região geográfica.'
    },
    {
        category: 'Agências e SDRs',
        examples: 'Agências de Marketing, Consultores Comerciais.',
        description: 'Gerencie múltiplos clientes e escale sua entrega de leads.'
    }
];

export default function ICP() {
    return (
        <section className={styles.icp}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.info}>
                        <h2 className={styles.subtitle}>Para quem é?</h2>
                        <h3 className={styles.title}>Foque onde o <br /> resultado acontece</h3>
                        <p className={styles.description}>
                            O Dominus Leads foi desenhado para negócios que vendem para outras empresas (B2B) e precisam de previsibilidade no funil de vendas.
                        </p>
                        <div className={styles.checkList}>
                            <div className={styles.checkItem}>
                                <div className={styles.checkIcon}>✓</div>
                                <span>Ideal para Vendas Complexas</span>
                            </div>
                            <div className={styles.checkItem}>
                                <div className={styles.checkIcon}>✓</div>
                                <span>Foco Total em Resultados CNPJ</span>
                            </div>
                            <div className={styles.checkItem}>
                                <div className={styles.checkIcon}>✓</div>
                                <span>Perfeito para Escala Regional</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.cards}>
                        {targets.map((target, index) => (
                            <div key={index} className={styles.card}>
                                <span className={styles.cardCategory}>{target.category}</span>
                                <p className={styles.cardExamples}>{target.examples}</p>
                                <p className={styles.cardDescription}>{target.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
