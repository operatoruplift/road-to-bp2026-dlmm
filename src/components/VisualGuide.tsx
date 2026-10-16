import { ArrowRight, ArrowUpRight, Download, Images } from "lucide-react";
import "./visual-guide.css";

const graphics = [
  {
    file: "01-cover",
    title: "Meet your little exchange booth",
    summary:
      "You supply the tokens. Traders swap them. You collect a share of the fees.",
    alt: "An illustrated introduction to providing liquidity on Meteora DLMM.",
    lesson: "lp-basics",
  },
  {
    file: "02-bins",
    title: "One price. One little bin.",
    summary:
      "See where your SOL and USDC wait, and which bin is open for business.",
    alt: "Price bins showing SOL, USDC, and the active bin between them.",
    lesson: "bins",
  },
  {
    file: "03-shapes",
    title: "Choose how to stack your tokens",
    summary:
      "Spot spreads them evenly. Curve favors the middle. Bid-Ask favors the edges.",
    alt: "A visual comparison of Spot, Curve, and Bid-Ask liquidity shapes.",
    lesson: "ranges",
  },
  {
    file: "04-fees",
    title: "Follow the fee",
    summary:
      "Every swap fee has a journey. Learn how a small slice can reach your position.",
    alt: "A simple diagram explaining trading fees and the liquidity provider’s share.",
    lesson: "fees",
  },
  {
    file: "05-range-risk",
    title: "What if price leaves your range?",
    summary:
      "Your token mix changes as price moves. Outside your range, new swap fees stop.",
    alt: "A liquidity range showing how price movements change the tokens you hold.",
    lesson: "risks",
  },
  {
    file: "06-entry-exit",
    title: "Make a plan before you jump in",
    summary:
      "Know what you are looking for, what could go wrong, and when you would leave.",
    alt: "A beginner checklist for planning when to enter and exit an LP position.",
    lesson: "entry-exit",
  },
  {
    file: "07-sizing",
    title: "Learn small. Grow slowly.",
    summary:
      "Practice first. Track the whole result. Bigger positions can wait.",
    alt: "A step-by-step learning path from practice to carefully sizing an LP position.",
    lesson: "start-small",
  },
];

export default function VisualGuide() {
  return (
    <div className="vg-page">
      <header className="vg-header">
        <div>
          <p className="vg-eyebrow">
            <Images size={15} aria-hidden="true" /> THE VISUAL GUIDE
          </p>
          <h1>
            Less reading.
            <br />
            <span>More lightbulbs.</span>
          </h1>
          <p className="vg-intro">
            Seven pictures to make the basics click. Save them, share them, or
            keep one nearby while you learn.
          </p>
        </div>
        <a
          className="vg-download-all"
          href="/graphics/road-to-bp2026-graphics.zip"
          download
        >
          <Download size={17} aria-hidden="true" />
          <span>
            Download all 7<small>Full-size PNGs · ZIP file</small>
          </span>
        </a>
      </header>

      <div className="vg-collection-heading">
        <span>YOUR DLMM CHEAT SHEETS</span>
        <span>7 GRAPHICS</span>
      </div>
      <div className="vg-grid">
        {graphics.map((graphic, index) => (
          <article
            className="vg-card"
            key={graphic.file}
            aria-labelledby={`vg-title-${index}`}
          >
            <a
              className="vg-image-link"
              href={`/graphics/${graphic.file}.png`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View full-size graphic: ${graphic.title} (opens in a new tab)`}
            >
              <img
                src={`/graphics/${graphic.file}.webp`}
                alt={graphic.alt}
                loading="lazy"
                decoding="async"
                width={1600}
                height={900}
              />
              <span className="vg-image-action" aria-hidden="true">
                <ArrowUpRight size={16} />
              </span>
            </a>
            <div className="vg-card-body">
              <div className="vg-card-kicker">
                <span>FIELD NOTE {String(index + 1).padStart(2, "0")}</span>
                <a href={`#lesson/${graphic.lesson}`}>
                  Explore lesson <ArrowRight size={12} aria-hidden="true" />
                </a>
              </div>
              <h2 id={`vg-title-${index}`}>{graphic.title}</h2>
              <p>{graphic.summary}</p>
              <div className="vg-card-actions">
                <a
                  href={`/graphics/${graphic.file}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View full PNG: ${graphic.title} (opens in a new tab)`}
                >
                  View full PNG <ArrowUpRight size={14} aria-hidden="true" />
                </a>
                <a
                  className="vg-download"
                  href={`/graphics/${graphic.file}.png`}
                  download
                  aria-label={`Download PNG: ${graphic.title}`}
                >
                  <Download size={14} aria-hidden="true" /> Download PNG
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <footer className="vg-footer">
        <p>
          Illustrative examples. Fees are not profit. Independent community
          guide.
        </p>
        <div>
          <span>Keep learning</span>
          <a
            href="https://docs.meteora.ag/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meteora docs <ArrowUpRight size={12} aria-hidden="true" />
          </a>
          <a
            href="https://lparmy.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LP Army <ArrowUpRight size={12} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  );
}
