import { AntiPromise } from "./(landing)/AntiPromise";
import { FinalCTA } from "./(landing)/FinalCTA";
import { HeroSection } from "./(landing)/HeroSection";
import { MechanicDemo } from "./(landing)/MechanicDemo";
import { OpenSourceSection } from "./(landing)/OpenSourceSection";
import { PersonaSection } from "./(landing)/PersonaSection";
import { ProofSection } from "./(landing)/ProofSection";
import { SiteFooter } from "./(landing)/SiteFooter";
import { SmoothScroll } from "./(landing)/SmoothScroll";
import { UtilityBar } from "./(landing)/UtilityBar";

export default function HomePage() {
  return (
    <SmoothScroll>
      <UtilityBar />
      <main id="main" className="relative">
        <HeroSection />
        <ProofSection />
        <MechanicDemo />
        <PersonaSection />
        <AntiPromise />
        <OpenSourceSection />
        <FinalCTA />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
