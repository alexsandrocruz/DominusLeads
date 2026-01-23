import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.badge}>
                        <span>Novo: Prospecção assistida por IA e Dados Oficiais</span>
                    </div>
                    <h1 className={styles.title}>
                        Transforme dados do <br /><span className={styles.highlight}>CNPJ</span> em
                        clientes reais no seu <span className={styles.highlight}>WhatsApp</span>.
                    </h1>
                    <p className={styles.description}>
                        A Dominus Leads utiliza a base oficial da Receita Federal e automações inteligentes para encontrar, qualificar e entregar leads B2B prontos para fechar negócio.
                    </p>
                    <div className={styles.actions}>
                        <button className={styles.cta}>Começar Teste Grátis</button>
                        <button className={styles.secondaryCta}>Ver Demonstração</button>
                    </div>
                    <div className={styles.metrics}>
                        <div className={styles.metric}>
                            <strong>30M+</strong>
                            <span>Empresas na Base</span>
                        </div>
                        <div className={styles.metricDivider} />
                        <div className={styles.metric}>
                            <strong>24h</strong>
                            <span>Setup da Campanha</span>
                        </div>
                        <div className={styles.metricDivider} />
                        <div className={styles.metric}>
                            <strong>100%</strong>
                            <span>Conforme LGPD</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
