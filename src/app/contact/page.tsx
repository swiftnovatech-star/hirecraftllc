import type { Metadata } from "next";
import { ArrowUpRight, Globe2, Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { BlurFade } from "@/components/ui/blur-fade";
import { DotPattern } from "@/components/ui/dot-pattern";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Connect with HireCraft to discuss IT hiring, contract staffing, direct placement, or your next career opportunity.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="contact-section">
        <DotPattern />
        <div className="container contact-grid">
          <BlurFade className="contact-copy">
            <h1>
              Big things start
              <br />
              with a simple
              <br />
              <span className="blue-text">hello.</span>
              <span className="hello-spark" aria-hidden="true">
                ✳
              </span>
            </h1>
            <p>
              Building your team? Planning your next move? Let’s talk about
              where you want to go.
            </p>
            <div className="contact-details">
              <div className="contact-detail">
                <span className="detail-icon">
                  <Mail size={21} />
                </span>
                <div>
                  <span>DROP US A LINE</span>
                  <a href={`mailto:${company.email}`}>
                    {company.email}
                    <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>
              <div className="contact-detail">
                <span className="detail-icon">
                  <Globe2 size={21} />
                </span>
                <div>
                  <span>WHERE WE CONNECT</span>
                  <p>Serving teams across the United States</p>
                </div>
              </div>
            </div>
            <div className="contact-promise">
              <MessageCircle size={20} />
              <p>
                A real conversation.
                <br />
                <strong>A thoughtful next step.</strong>
              </p>
            </div>
          </BlurFade>
          <BlurFade delay={0.12}>
            <ContactForm />
          </BlurFade>
        </div>
      </section>
      <section className="container contact-faq">
        <div>
          <span className="eyebrow">
            <span className="section-line" /> A LITTLE MORE CLARITY
          </span>
          <h2>Before we say hello.</h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>What types of IT roles do you support?</summary>
            <p>
              We focus on developers, engineers, and IT specialists across
              software engineering, cloud and infrastructure, data and
              analytics, and cybersecurity. Tell us about your role so we can
              discuss your specific needs.
            </p>
          </details>
          <details>
            <summary>Can I contact you about career opportunities?</summary>
            <p>
              Absolutely. Select “Find my next role” in the form and tell us
              about your background and what you’re looking for. You can attach
              your resume when you send the prepared email from your email app.
            </p>
          </details>
          <details>
            <summary>What happens after I prepare my message?</summary>
            <p>
              You’ll see a link to open the draft in your email app. Review it
              and press send there. The form does not submit or store your
              details on a server.
            </p>
          </details>
        </div>
      </section>
    </>
  );
}
