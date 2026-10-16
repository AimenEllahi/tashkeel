import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl || "http://localhost:3000"),
  title: "Tashkeel Atelier | Wedding Design & Planning in Lahore",
  description: "Wedding planning in Lahore. Tashkeel Atelier brings your inspiration, family traditions, and wedding details into a considered direction and a clear plan.",
  alternates: siteUrl ? { canonical: "/" } : undefined,
  openGraph: { title: "Tashkeel Atelier", description: "You have 47 Pinterest boards. We have a plan. Wedding design and planning in Lahore, Pakistan.", type: "website", locale: "en_PK", siteName: "Tashkeel Atelier" },
  twitter: { card: "summary_large_image", title: "Tashkeel Atelier", description: "Wedding design and planning in Lahore. You bring the ideas. We bring them together." },
};

export const viewport: Viewport = { themeColor: "#F5F2EB" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
