import { Hero } from "./(landing)/Hero";
import { MeetTheCast } from "./(landing)/MeetTheCast";
import { PaydayDemo } from "./(landing)/PaydayDemo";
import { PlayBand } from "./(landing)/PlayBand";
import { SiteFooter } from "./(landing)/SiteFooter";
import { ThreeVerbs } from "./(landing)/ThreeVerbs";
import { UtilityBar } from "./(landing)/UtilityBar";

export default function HomePage() {
  return (
    <>
      <UtilityBar />
      <main id="main" className="relative">
        <Hero />
        <ThreeVerbs />
        <MeetTheCast />
        <PaydayDemo />
        <PlayBand />
      </main>
      <SiteFooter />
    </>
  );
}
