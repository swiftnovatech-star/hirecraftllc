import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  Code2,
  Database,
  Layers3,
  Network,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { CtaBanner } from "@/components/cta-banner";
import { HeroArt } from "@/components/hero-art";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const services = [
  {
    number: "01",
    icon: BriefcaseBusiness,
    title: "Staffing",
    description:
      "Connect with the IT talent your team needs. From flexible project support to permanent hires, we help you find the right people for your next chapter.",
    query: "staffing",
    action: "Let’s build your team",
  },
  {
    number: "02",
    icon: Code2,
    title: "Development",
    description:
      "Turn your ideas into software that works for your business. We help you plan, build, and improve digital solutions around your goals.",
    query: "development",
    action: "Let’s build your solution",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <BlurFade className="hero-copy">
            <h1 id="hero-title">
              Great talent.
              <br />
              The right fit.
              <br />
              <span className="blue-text">Your next chapter.</span>
            </h1>
            <p className="hero-description">
              Technology moves fast. The right people move you forward. We
              connect ambitious teams with the IT talent that makes a
              difference.
            </p>
            <div className="hero-actions">
              <Link
                href="/contact?intent=hiring"
                className="button button-blue"
              >
                Find your next hire <ArrowUpRight size={19} />
              </Link>
              <Link href="/contact?intent=career" className="text-link">
                Find your next opportunity <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="hero-proof">
              <div className="proof-icon">
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong>Technical expertise. Human connection.</strong>
                <span>IT staffing built around you.</span>
              </div>
            </div>
          </BlurFade>
          <BlurFade className="hero-visual" delay={0.15}>
            <HeroArt />
          </BlurFade>
        </div>
        <div className="container hero-bottom">
          <span>THE RIGHT CONNECTION CHANGES EVERYTHING.</span>
          <a href="#services" className="discover-link">
            Discover what we do <ArrowDown size={15} />
          </a>
        </div>
      </section>

      <div className="expertise-strip">
        <div className="container expertise-inner">
          <span className="expertise-label">
            SPECIALIZED IN
            <br />
            <strong>What’s next.</strong>
          </span>
          <span>
            <Code2 />
            Software engineering
          </span>
          <span>
            <Layers3 />
            Cloud & infrastructure
          </span>
          <span>
            <Database />
            Data & analytics
          </span>
          <span>
            <ShieldCheck />
            Cybersecurity
          </span>
        </div>
      </div>

      <section
        id="services"
        className="section container"
        aria-labelledby="services-title"
      >
        <BlurFade className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="section-line" /> OUR SERVICES
            </span>
            <h2 id="services-title">
              Your goals.
              <br />
              Our kind of challenge.
            </h2>
          </div>
          <p>
            The people to strengthen your team. The development expertise to
            bring your ideas to life. Two ways to move your business forward.
          </p>
        </BlurFade>
        <div className="services-grid">
          {services.map((service) => (
            <BlurFade
              key={service.number}
              delay={Number(service.number) * 0.06}
            >
              <article className="service-card">
                <div className="service-card-top">
                  <span className="service-icon">
                    <service.icon size={26} strokeWidth={1.6} />
                  </span>
                  <span className="service-number">/{service.number}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link
                  className="service-link"
                  href={`/contact?intent=hiring&service=${service.query}`}
                >
                  {service.action}{" "}
                  <span>
                    <ArrowUpRight size={21} />
                  </span>
                  <span className="sr-only"> with {service.title}</span>
                </Link>
              </article>
            </BlurFade>
          ))}
        </div>
      </section>

      <section className="why-section" aria-labelledby="why-title">
        <div className="container why-grid">
          <BlurFade className="why-visual">
            <div className="why-image">
              <Image
                src="/images/office.jpg"
                alt="An open, light-filled workspace with collaborative seating"
                fill
                sizes="(max-width: 760px) 100vw, 45vw"
              />
            </div>
            <div className="why-note">
              <Sparkles size={24} />
              <p>
                Better together.
                <br />
                <strong>Built to go further.</strong>
              </p>
            </div>
            <span className="why-corner" aria-hidden="true">
              ↗
            </span>
          </BlurFade>
          <BlurFade className="why-copy">
            <span className="eyebrow">
              <span className="section-line" /> THE HIRECRAFT APPROACH
            </span>
            <h2 id="why-title">
              We see the person.
              <br />
              You see the potential.
            </h2>
            <p>
              A resume is a starting point. We look deeper—at the skills,
              ambitions, and human qualities that turn a good candidate into a
              great teammate.
            </p>
            <ul className="benefit-list">
              <li>
                <Check />
                Technical skills aligned with your real needs
              </li>
              <li>
                <Check />
                People who connect with your team and culture
              </li>
              <li>
                <Check />A hands-on partner, from first conversation onward
              </li>
            </ul>
            <Link href="/about" className="text-link">
              Get to know HireCraft <ArrowUpRight size={18} />
            </Link>
          </BlurFade>
        </div>
      </section>

      <section
        className="section container process-section"
        aria-labelledby="process-title"
      >
        <BlurFade className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="section-line" /> SIMPLE PROCESS. THOUGHTFUL
              MATCHES.
            </span>
            <h2 id="process-title">
              A better way to build
              <br />
              your next great team.
            </h2>
          </div>
          <Link className="text-link" href="/contact">
            Start a conversation <ArrowUpRight size={18} />
          </Link>
        </BlurFade>
        <div className="process-grid">
          {[
            {
              number: "01",
              icon: Network,
              title: "We listen first.",
              text: "Your technology. Your culture. Your goals. We take the time to understand what a great fit looks like for you.",
            },
            {
              number: "02",
              icon: Workflow,
              title: "We make the connection.",
              text: "We identify and evaluate professionals with the skills and mindset to contribute to your team.",
            },
            {
              number: "03",
              icon: BadgeCheck,
              title: "You move forward.",
              text: "Meet your match, bring them on board, and build what’s next—with a staffing partner in your corner.",
            },
          ].map((step) => (
            <BlurFade key={step.number}>
              <div className="process-item">
                <div className="process-top">
                  <span>{step.number}</span>
                  <step.icon size={22} />
                  <ArrowRight size={20} className="process-arrow" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
