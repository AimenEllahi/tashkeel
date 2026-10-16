import { Container } from "@/components/layout/container";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Container className="header-inner">
        <a href="#page-top" className="wordmark" aria-label="Tashkeel Atelier home">
          Tashkeel <span>Atelier</span>
        </a>
        <nav aria-label="Main navigation">
          <ul className="nav-items">
            <li><a href="#atelier-stage">Explore</a></li>
            <li><a href="#what-we-do">What We Do</a></li>
            <li><a href="#the-atelier">The Atelier</a></li>
            <li><a href="#inquire">Inquire</a></li>
          </ul>
        </nav>
        <a className="header-cta" href="#inquire">Let&apos;s Plan <span aria-hidden="true">↗</span></a>
      </Container>
    </header>
  );
}
