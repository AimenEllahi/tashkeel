import { HeroMotion } from "@/animations/hero-motion";
import { AtelierScene } from "@/components/home/atelier-scene";
import { Container } from "@/components/layout/container";

export function EditorialHero() {
  return (
    <HeroMotion>
      <section className="editorial-hero" aria-labelledby="hero-heading">
        <Container>
          <div className="hero-composition">
            <div className="hero-copy">
              <h1 id="hero-heading" className="hero-heading" data-hero-enter>
                You have 47 Pinterest boards.{" "}
                <em>We have a plan.</em>
              </h1>
              <p className="hero-description" data-hero-enter>
                Your wedding doesn&apos;t need more inspiration. It needs someone who understands yours.
              </p>
            </div>
            <AtelierScene />
          </div>
          <div className="hero-foot">
            <a href="#atelier-stage" className="scroll-cue" data-scroll-cue>
              <span className="cue-line" aria-hidden="true" />
              Explore the Atelier <span aria-hidden="true">↓</span>
            </a>
          </div>
        </Container>
      </section>
    </HeroMotion>
  );
}
