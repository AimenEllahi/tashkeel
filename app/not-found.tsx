import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return <main className="not-found-page"><Container><Link href="/" className="wordmark">Tashkeel <span>Atelier</span></Link><p className="scene-kicker">404 / A little off the plan</p><h1 className="scene-heading">Let&apos;s find your <em>way back.</em></h1><p>The page you&apos;re looking for isn&apos;t here. The atelier is just a step away.</p><Link href="/" className="primary-action">Return to the atelier <span aria-hidden="true">↗</span></Link></Container></main>;
}
