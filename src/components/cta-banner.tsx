import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DotPattern } from "./ui/dot-pattern";

export function CtaBanner() {
  return (
    <section className="container cta-wrap" aria-labelledby="cta-heading">
      <div className="cta-banner">
        <DotPattern />
        <div className="cta-copy">
          <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h2 id="cta-heading">
            Great people.
            <br />
            Extraordinary possibilities.
          </h2>
          <p>Let’s build the team that takes you forward.</p>
        </div>
        <Link className="button button-white" href="/contact">
          Let’s talk talent <ArrowUpRight size={19} />
        </Link>
        <span className="cta-orbit" aria-hidden="true" />
      </div>
    </section>
  );
}
