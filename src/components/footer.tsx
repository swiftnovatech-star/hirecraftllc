import Link from "next/link";
import { ArrowUpRight, Globe2, Mail } from "lucide-react";
import { Brand } from "./brand";
import { company } from "@/lib/company";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Brand light />
            <p>
              Connecting talent with opportunity.
              <br />
              And people with what’s next.
            </p>
            <span className="footer-location">
              <Globe2 size={15} /> Serving teams across the United States
            </span>
          </div>
          <div className="footer-column">
            <h2>Explore</h2>
            <Link href="/">Our services</Link>
            <Link href="/about">About HireCraft</Link>
            <Link href="/contact">Get in touch</Link>
          </div>
          <div className="footer-column">
            <h2>Let’s connect</h2>
            <a className="footer-email" href={`mailto:${company.email}`}>
              <Mail size={16} />
              {company.email}
              <ArrowUpRight size={15} />
            </a>
            <p>Great teams start with a conversation.</p>
            <Link className="footer-contact" href="/contact?intent=career">
              Looking for your next opportunity? <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {company.legalName}. All rights
            reserved.
          </span>
          <span>
            People first. Possibilities next.
            <span className="tiny-star">✳</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
