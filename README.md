# Road to BP2026: Zero to Hero on DLMM

An independent, beginner-friendly learning website about liquidity providing on Meteora. Built for people who have never supplied liquidity, including people new to crypto.

## Features

- Seven short lessons with exchange-booth and bin illustrations
- A knowledge check for every lesson, with explanations and local progress saving
- Optional browser read-aloud
- Interactive Spot, Curve, and Bid-Ask playground with tight/wide ranges
- Price slider, token composition, out-of-range behavior, and a hypothetical fee demo
- Searchable plain-English glossary
- Responsive design, keyboard controls, reduced-motion support, and self-hosted fonts
- Official sources linked from each lesson
- Seven downloadable visual cheat sheets and a complete PNG pack
- Optional deeper explanations of one-sided deposits, bin steps, and out-of-range decisions

The playground is an educational allocation model, not a profit calculator or a live trading tool. It does not connect wallets, execute trades, track visitors, or request personal information. Fees and token value must both be considered when evaluating an actual position.

## Development

Requires Node.js 22.12+ or 24 and npm.

```sh
npm install
npm run dev
```

## Validation and production build

```sh
npm test
npm run build
npm run preview
```

Built with React, TypeScript, Vite, and Lucide. Lesson content lives in `src/data/lessons.ts`. Simulator logic and tests live in `src/lib/`. Source verification and model limitations are recorded in `CONTENT_NOTES.md`.

## Deploy

Import the repository into Vercel. The included configuration selects Vite, builds with `npm run build`, and serves `dist`. No environment variables are needed. Navigation uses URL hashes so lessons can be shared without server routing.

## Content and branding

This is a community educational project, not an official Meteora or LP Army product. Brand names remain the property of their owners. The site uses original logo assets from LP Army and Meteora, with sources recorded in `BRAND_SOURCES.md`. The social graphics were generated for this guide using those assets as visual references. Generation prompts are in `assets/graphics/`. It is not financial advice. Liquidity providing can lose money.

The `#graphics` page offers individual full-resolution PNG downloads and `public/graphics/road-to-bp2026-graphics.zip`. Optimized WebP previews keep the gallery quick to load. The seven graphics are 1672 × 941 pixels.

Learning progress is saved only in the current browser using localStorage, when available. Read-aloud depends on browser and device speech support.
