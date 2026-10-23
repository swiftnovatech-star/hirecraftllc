import Link from "next/link";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand${light ? " brand-light" : ""}`}
      aria-label="HireCraft home"
    >
      <span className="brand-word">
        Hire<span>Craft</span>
        <span className="brand-period">.</span>
      </span>
    </Link>
  );
}
