# HireCraft

A responsive, three-page IT staffing website built with Next.js App Router, TypeScript, React, Motion, and Lucide icons. The Services landing page, About Us page, and Contact page share a responsive header and footer, with client-side navigation provided by Next.js.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production build, run `npm run build` followed by `npm start`.

```bash
npm run typecheck
npm run test:e2e
```

The browser tests require Playwright Chromium (`npx playwright install chromium`) and launch their own Next.js development server on port 3100. They cover navigation, mobile layout, inquiry intent, service selection, form validation, email drafts, FAQs, and reduced-motion behavior.

## Pages

- `/`: Services landing page, hero, capabilities, staffing options, approach, and process.
- `/about`: Company purpose, approach, and principles.
- `/contact`: Hiring and career inquiries, email contact, and FAQs.

## Brand and content

The supplied HireCraft image informs the navy (`#061c3b`), blue (`#0068d9`), and cyan (`#009cf1`) palette. Its original is kept at `public/images/brand-reference.jpeg`. The header uses a responsive text wordmark inspired by the image; it is not a traced replacement for the original logo. Typography is self-hosted Manrope.

The email, `pavan.velaga@gmail.com`, and core staffing descriptions were taken from https://hirecraftllc.net/ on October 22, 2026. The source page lists `(+1) 23456789`, which appears incomplete, and does not publish a street address. Neither a fabricated address nor that placeholder phone is shown. Verified company contact settings live in `src/lib/company.ts`. Additional copy and service positioning are editorial proposals for company review, including contract-to-hire and the specialization categories.

The contact form prepares a `mailto:` draft and provides a clipboard fallback; it does not send mail, store inquiries, or imply successful delivery. Direct email submission would require a server endpoint and an email provider. There are no invented testimonials, placement statistics, or customer logos.

## 21st MCP components

Retrieved through the user's connected 21st MCP and adapted to this brand:

- [Dot Pattern by dillionverma / Magic UI](https://21st.dev/community/components/dillionverma/dot-pattern/default), demo ID 1537: `src/components/ui/dot-pattern.tsx`. Replaced loose types with SVG props and local CSS.
- [Blur Fade by dillionverma / Magic UI](https://21st.dev/community/components/dillionverma/blur-fade/default), demo ID 1079: `src/components/ui/blur-fade.tsx`. Uses Motion's React API, respects reduced motion, and preserves server-rendered content visibility.

21st catalog search was unavailable during implementation; component IDs were resolved through public listings before retrieving code via MCP. The layout and remaining components are custom-built around these two primitives.

## Assets

- The current hero illustration is live HTML/CSS in `src/components/hero-art.tsx`, with artwork-only styles extracted from the supplied `style.css` into `src/components/hero-art.css`: gradient spheres, a translucent bordered semicircle, a subtle grid, and editable text. It loads no image asset. `public/images/hero-spheres.webp` is the unused earlier generated version retained for reference.

- [Team photograph](https://images.unsplash.com/photo-1521737711867-e3b97375f902) served from Unsplash.
- [Office photograph](https://images.unsplash.com/photo-1497366811353-6870744d04b2) served from Unsplash.
- [Manrope](https://fonts.google.com/specimen/Manrope), self-hosted under the SIL Open Font License in `public/fonts/OFL.txt`.

Photography is illustrative and does not represent HireCraft's actual employees or premises.

## Deployment

Deploy as a standard Next.js application to a Node.js host or Vercel. The website includes metadata, a sitemap, robots configuration, a favicon, optimized local images, keyboard-accessible navigation, and reduced-motion handling. No hosting or domain changes have been made.
