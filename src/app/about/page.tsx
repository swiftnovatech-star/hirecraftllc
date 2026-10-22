import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Compass,
  HeartHandshake,
  ScanEye,
  Sparkles,
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { CtaBanner } from "@/components/cta-banner";
import { DotPattern } from "@/components/ui/dot-pattern";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Meet HireCraft, a US IT staffing company built around meaningful connections, technical understanding, and people-first partnerships.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero about-hero">
        <DotPattern />
        <div className="container">
          <BlurFade>
            <h1>
              Behind every great team,
              <br />
              there’s a <span className="blue-text">human connection.</span>
            </h1>
            <div className="about-intro">
              <p>
                We’re here to make that connection count. HireCraft brings
                people, technology, and opportunity together to help teams build
                their next chapter.
              </p>
              <span className="about-star" aria-hidden="true">
                ✳
              </span>
            </div>
          </BlurFade>
        </div>
      </section>
      <section className="container about-photo-section">
        <div className="about-wide-image">
          <Image
            src="/images/team.jpg"
            alt="A team sharing ideas and collaborating around a table"
            fill
            priority
            sizes="100vw"
          />
          <div className="about-photo-caption">
            <span>OUR BELIEF</span>
            <p>
              People make the difference.
              <br />
              The right connection makes it possible.
            </p>
          </div>
        </div>
      </section>
      <section className="section container story-grid">
        <BlurFade>
          <span className="eyebrow">
            <span className="section-line" /> OUR PURPOSE
          </span>
          <h2>
            More possibility.
            <br />
            For both sides
            <br />
            of the table.
          </h2>
        </BlurFade>
        <BlurFade className="story-copy">
          <p className="lead-copy">
            An opportunity to grow. A person who moves a project forward. That’s
            what a good staffing partnership should create.
          </p>
          <p>
            HireCraft is an IT staffing company serving businesses and
            technology professionals across the United States. We help
            organizations find skilled developers, engineers, and specialists
            through flexible staffing and permanent placements.
          </p>
          <p>
            Our approach starts with understanding. We take the time to learn
            what your team needs and what a professional wants from their next
            role, so every conversation moves toward a meaningful fit.
          </p>
          <Link href="/" className="text-link">
            Explore our staffing services <ArrowUpRight size={18} />
          </Link>
        </BlurFade>
      </section>
      <section className="values-section">
        <div className="container">
          <BlurFade className="section-heading">
            <div>
              <span className="eyebrow">
                <span className="section-line" /> WHAT GUIDES US
              </span>
              <h2>
                Good people.
                <br />
                Grounded principles.
              </h2>
            </div>
            <p>The way we work matters as much as the connections we make.</p>
          </BlurFade>
          <div className="values-grid">
            {[
              {
                icon: HeartHandshake,
                title: "People come first.",
                description:
                  "We treat every candidate and every client as a person with goals worth understanding.",
              },
              {
                icon: ScanEye,
                title: "Fit goes deeper.",
                description:
                  "We look beyond a job description to the technical needs, working styles, and ambitions behind it.",
              },
              {
                icon: Compass,
                title: "Clarity builds trust.",
                description:
                  "We believe in honest conversations, clear expectations, and keeping you informed.",
              },
              {
                icon: Sparkles,
                title: "Growth is shared.",
                description:
                  "We focus on connections that help professionals develop and teams move forward together.",
              },
            ].map((value) => (
              <BlurFade key={value.title}>
                <article className="value-card">
                  <value.icon size={28} strokeWidth={1.5} />
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section className="section container purpose-statement">
        <span className="eyebrow">CONNECTING TALENT WITH OPPORTUNITY</span>
        <h2>
          Your next great hire.
          <br />
          Your next big step.
          <br />
          <span className="blue-text">Let’s make it happen.</span>
        </h2>
        <p>
          Whether you’re building a team or exploring your next role, we’d like
          to hear what’s next for you.
        </p>
      </section>
      <CtaBanner />
    </>
  );
}
