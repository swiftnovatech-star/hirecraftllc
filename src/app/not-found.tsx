import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container not-found">
      <span className="eyebrow">404 — A DIFFERENT DIRECTION</span>
      <h1>
        Let’s get you
        <br />
        <span className="blue-text">back on track.</span>
      </h1>
      <p>We couldn’t find that page, but your next connection is still here.</p>
      <Link href="/" className="button button-blue">
        Back to HireCraft <ArrowUpRight size={18} />
      </Link>
    </section>
  );
}
