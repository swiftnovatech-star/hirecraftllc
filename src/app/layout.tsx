import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const manrope = localFont({
  src: [
    {
      path: "../../public/fonts/manrope-400.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope-500.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope-600.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope-700.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope-800.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hirecraftllc.net"),
  title: {
    default: "HireCraft | IT Talent. Human Connections.",
    template: "%s | HireCraft",
  },
  description:
    "HireCraft connects US businesses with skilled IT professionals through contract staffing, contract-to-hire, and direct placement. Build your next great team.",
  openGraph: {
    title: "HireCraft — Connecting Talent with Opportunity",
    description:
      "The right IT talent. The right human connection. Staffing solutions built around your next chapter.",
    type: "website",
    locale: "en_US",
    siteName: "HireCraft",
    images: [
      {
        url: "/images/brand-reference.jpeg",
        width: 1536,
        height: 1024,
        alt: "HireCraft Staffing Company",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable} data-scroll-behavior="smooth">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
