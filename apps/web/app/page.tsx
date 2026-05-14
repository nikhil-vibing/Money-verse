import { UtilityBar } from "./(landing)/UtilityBar";
import { HeroSection } from "./(landing)/HeroSection";
import { PaydayDemo } from "./(landing)/PaydayDemo";
import { DistrictMap } from "./(landing)/DistrictMap";
import { PillarsRail } from "./(landing)/PillarsRail";
import { PersonaTriptych } from "./(landing)/PersonaTriptych";
import { InspiredByRail } from "./(landing)/InspiredByRail";
import { AntiPromiseBand } from "./(landing)/AntiPromiseBand";
import { OpenSourceCard } from "./(landing)/OpenSourceCard";
import { FinalCTA } from "./(landing)/FinalCTA";
import { SiteFooter } from "./(landing)/SiteFooter";

export default function HomePage() {
  return (
    <>
      <UtilityBar />
      <main id="main" className="overflow-x-hidden">
        <HeroSection />
        <PaydayDemo />
        <DistrictMap />
        <PillarsRail />
        <PersonaTriptych />
        <InspiredByRail />
        <AntiPromiseBand />
        <OpenSourceCard />
        <FinalCTA />
      </main>
      <SiteFooter />
    </>
  );
}
