import styles from './HowItWorks.module.css';

const steps = [
    {
        number: '01',
        title: 'Mineração de Dados',
        description: 'Nossa engine processa mensalmente a base da Receita Federal, selecionando empresas ativas com base no seu CNAE alvo.'
    },
    {
        number: '02',
        title: 'Segmentação Inteligente',
        description: 'Você define a região, o porte e o tempo de abertura. Nós filtramos apenas as empresas com maior probabilidade de conversão.'
    },
    {
        number: '03',
        title: 'Abordagem Automatizada',
        description: 'O sistema inicia uma conversa via WhatsApp para validar o decisor e entender o interesse real no seu produto/serviço.'
    },
    {
        number: '04',
        title: 'Lead Qualificado no CRM',
        description: 'Apenas os leads que demonstraram interesse e foram qualificados são entregues no seu CRM Dominus para o fechamento.'
    }
];

export default function HowItWorks() {
    return (
        <section className={styles.howItWorks}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.subtitle}>Como Funciona?</h2>
                    <h3 className={styles.title}>Do dado bruto ao <br /> lead qualificado</h3>
                </div>
                <div className={styles.steps}>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.step}>
                            <div className={styles.numberWrapper}>
                                <span className={styles.number}>{step.number}</span>
                                {index !== steps.length - 1 && <div className={styles.line} />}
                            </div>
                            <div className={styles.content}>
                                <h4 className={styles.stepTitle}>{step.title}</h4>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
