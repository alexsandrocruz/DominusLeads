import styles from './Footer.module.css';

export default function Footer() {
    return (
        <>
            <section className={styles.ctaBanner}>
                <div className="container">
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaTitle}>Pronto para dominar seu mercado?</h2>
                        <p className={styles.ctaDescription}>
                            Junte-se a centenas de empresas que já escalaram sua prospecção com a Dominus Leads.
                        </p>
                        <button className={styles.finalCta}>Começar Agora</button>
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerGrid}>
                        <div className={styles.brand}>
                            <h3 className={styles.brandName}>Dominus Leads</h3>
                            <p className={styles.brandDesc}>
                                Sua máquina de prospecção B2B alimentada por inteligência de dados.
                            </p>
                        </div>
                        <div className={styles.links}>
                            <h4 className={styles.linkTitle}>Produto</h4>
                            <a href="#">Funcionalidades</a>
                            <a href="#">Preços</a>
                            <a href="#">Estudos de Caso</a>
                        </div>
                        <div className={styles.links}>
                            <h4 className={styles.linkTitle}>Empresa</h4>
                            <a href="#">Sobre nós</a>
                            <a href="#">Contato</a>
                            <a href="#">Blog</a>
                        </div>
                        <div className={styles.links}>
                            <h4 className={styles.linkTitle}>Legal</h4>
                            <a href="#">Termos de Uso</a>
                            <a href="#">Privacidade</a>
                            <a href="#">LGPD</a>
                        </div>
                    </div>
                    <div className={styles.bottom}>
                        <p>© 2026 Dominus Leads. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
