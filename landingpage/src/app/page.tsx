import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import ICP from '@/components/sections/ICP';
import HowItWorks from '@/components/sections/HowItWorks';
import Pricing from '@/components/sections/Pricing';
import Footer from '@/components/layout/Footer';

export default function Home() {
    return (
        <main>
            <Hero />
            <Features />
            <ICP />
            <HowItWorks />
            <Pricing />
            <Footer />
        </main>
    );
}
