import Image from "next/image";
import { Container } from "@/components/layout/container";

export function MeetAtelier() {
  return <section id="the-atelier" className="founder-section scene-section" aria-labelledby="founder-heading">
    <Container className="founder-layout">
      <figure className="founder-portrait"><Image src="/assets/images/founder/hafsa-illustration.webp" alt="Illustrated portrait of Hafsa, founder of Tashkeel Atelier" fill sizes="(min-width: 900px) 500px, 100vw" /></figure>
      <div className="founder-copy"><p className="scene-kicker">05 / The people behind the plan</p><h2 id="founder-heading" className="scene-heading">Meet <em>Hafsa.</em></h2><p>Tashkeel Atelier is a Lahore-based wedding design and planning studio. We bring together inspiration, family traditions and the practical decisions that turn an idea into a celebration.</p><a className="text-link" href="https://www.instagram.com/tashkeelatelier/" target="_blank" rel="noopener noreferrer">Find Tashkeel on Instagram <span aria-hidden="true">↗</span></a></div>
    </Container>
  </section>;
}
