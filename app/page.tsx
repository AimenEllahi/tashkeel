import { EditorialHero } from "@/components/home/editorial-hero";
import { ExperienceProvider } from "@/components/experience/experience-provider";
import { AtelierCabinet } from "@/components/scenes/atelier-cabinet";
import { IdeasToPlan } from "@/components/scenes/ideas-to-plan";
import { InquirySection } from "@/components/scenes/inquiry-section";
import { MeetAtelier } from "@/components/scenes/meet-atelier";
import { ServicesVenue } from "@/components/scenes/services-venue";
import { StyleExplorer } from "@/components/scenes/style-explorer";
import { WeddingStudio } from "@/components/scenes/wedding-studio";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function Home() {
  return (
    <>
      <div id="page-top" aria-hidden="true" />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <SiteHeader />
      <ExperienceProvider><main id="main-content" tabIndex={-1}>
        <EditorialHero />
        <IdeasToPlan />
        <StyleExplorer />
        <WeddingStudio />
        <AtelierCabinet />
        <ServicesVenue />
        <MeetAtelier />
        <InquirySection />
      </main></ExperienceProvider>
      <SiteFooter />
    </>
  );
}
