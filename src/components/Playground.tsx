import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  FlaskConical,
  Info,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import {
  BIN_STEP,
  getPosition,
  getRange,
  makeBins,
  PRICE_MAX,
  PRICE_MIN,
  simulateFee,
} from "../lib/simulator";
import type { RangeSize, Shape } from "../lib/simulator";
import "./playground.css";

const shapes: { id: Shape; name: string; icon: string; description: string }[] =
  [
    {
      id: "spot",
      name: "Spot",
      icon: "▆▆▆▆▆",
      description: "An even stack. The same amount goes into each bin.",
    },
    {
      id: "curve",
      name: "Curve",
      icon: "▂▅█▅▂",
      description:
        "More in the middle. Most of your liquidity sits near the starting price.",
    },
    {
      id: "bid-ask",
      name: "Bid-Ask",
      icon: "█▅▂▅█",
      description:
        "More at the edges. More liquidity waits farther from the starting price.",
    },
  ];
const money = (amount: number, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);

export default function Playground() {
  const [shape, setShape] = useState<Shape>("spot");
  const [rangeSize, setRangeSize] = useState<RangeSize>("wide");
  const [price, setPrice] = useState(150);
  const [swapAmount, setSwapAmount] = useState(1_000);
  const [fees, setFees] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const bins = useMemo(() => makeBins(shape, rangeSize), [shape, rangeSize]);
  const position = getPosition(price, bins);
  const range = getRange(rangeSize);
  const selectedShape = shapes.find((item) => item.id === shape)!;
  const below = price < range.lower;
  const percent = ((price - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxWeight = Math.max(...bins.map((bin) => bin.weight));
  const nextFee = simulateFee(swapAmount, position.inRange);
  const solPercent = Math.round(position.solShare * 100);
  const message = position.inRange
    ? "Your booth is open. Swaps in bins where you have liquidity can earn you fees."
    : below
      ? "Price fell below your range. Your position is now all SOL, and new fees stop."
      : "Price rose above your range. Your position is now all USDC, and new fees stop.";

  function clearFees() {
    setFees(0);
    setSwaps(0);
  }
  function changeShape(next: Shape) {
    if (next !== shape) {
      setShape(next);
      clearFees();
    }
  }
  function changeRange(next: RangeSize) {
    if (next !== rangeSize) {
      setRangeSize(next);
      clearFees();
    }
  }
  function reset() {
    setShape("spot");
    setRangeSize("wide");
    setPrice(150);
    setSwapAmount(1_000);
    clearFees();
  }

  return (
    <div className="pg-page">
      <header className="pg-header">
        <div>
          <p className="pg-eyebrow">
            <FlaskConical size={14} /> THE PRACTICE ZONE
          </p>
          <h1>
            Move the price.
            <br />
            <span>See what happens.</span>
          </h1>
          <p className="pg-intro">
            A tiny pretend pool. No wallet, no real money. Move SOL’s price to
            see how your tokens change.
          </p>
        </div>
        <span className="pg-demo-badge">
          <span /> LEARN BY DOING
        </span>
      </header>

      <div className="pg-layout">
        <section
          className="pg-main"
          aria-label="Interactive liquidity simulator"
        >
          <div className="pg-panel pg-chart-panel">
            <div className="pg-panel-heading">
              <div className="pg-pair">
                <span className="pg-token">◎</span>
                <div>
                  <strong>SOL / USDC</strong>
                  <span>One SOL, priced in USDC</span>
                </div>
              </div>
              <button className="pg-reset" onClick={reset}>
                <RotateCcw size={13} /> Reset
              </button>
            </div>
            <div className="pg-price-row">
              <div>
                <span className="pg-label">PRETEND SOL PRICE</span>
                <div className="pg-price">
                  {money(price)}
                  <span>USDC</span>
                </div>
              </div>
              <span
                className={`pg-status ${position.inRange ? "is-open" : "is-closed"}`}
              >
                <span />
                {position.inRange ? "In your range" : "Out of your range"}
              </span>
            </div>

            <div
              className="pg-chart"
              role="img"
              aria-label={`Illustrative ${selectedShape.name} liquidity distribution. Price ${money(price)}. Range ${money(range.lower)} to ${money(range.upper)}. ${position.inRange ? "In range." : "Out of range."}`}
            >
              <div className="pg-chart-grid">
                <i />
                <i />
                <i />
              </div>
              <div
                className="pg-range-highlight"
                style={{
                  left: `${((range.lower - PRICE_MIN) / 60) * 100}%`,
                  width: `${((range.upper - range.lower) / 60) * 100}%`,
                }}
              />
              <div className="pg-bars">
                {Array.from({ length: 30 }, (_, i) => {
                  const lower = PRICE_MIN + i * BIN_STEP;
                  const bin = bins.find((item) => item.lower === lower);
                  const active = price >= lower && price < lower + BIN_STEP;
                  const asset =
                    price >= lower + BIN_STEP
                      ? "usdc"
                      : price <= lower
                        ? "sol"
                        : "active";
                  return (
                    <div
                      key={lower}
                      className={`pg-bar ${bin ? asset : "empty"} ${active && bin ? "active" : ""}`}
                      style={{
                        height: bin
                          ? `${24 + (bin.weight / maxWeight) * 72}%`
                          : "7%",
                      }}
                      title={`${money(lower)} to ${money(lower + BIN_STEP)}: ${bin ? `${(bin.weight * 100).toFixed(1)}% of allocation` : "no allocation"}`}
                    />
                  );
                })}
              </div>
              <div className="pg-price-marker" style={{ left: `${percent}%` }}>
                <span>{money(price)}</span>
              </div>
            </div>
            <div className="pg-chart-scale">
              <span>$120</span>
              <span>$150</span>
              <span>$180</span>
            </div>
            <div className="pg-chart-legend">
              <span>
                <i className="usdc" /> USDC bins
              </span>
              <span>
                <i className="active" /> Active bin
              </span>
              <span>
                <i className="sol" /> SOL bins
              </span>
            </div>

            <div className="pg-price-control">
              <div>
                <label htmlFor="pg-price">Drag the price</label>
                <span>Watch your booth change</span>
              </div>
              <input
                id="pg-price"
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={1}
                value={price}
                onChange={(event) => setPrice(Number(event.target.value))}
                aria-valuetext={`${price} USDC per SOL, ${position.inRange ? "in range" : "out of range"}`}
              />
              <div className="pg-slider-labels">
                <span>
                  <ArrowDownLeft size={12} /> Price falls
                </span>
                <span>
                  Price rises <ArrowUpRight size={12} />
                </span>
              </div>
            </div>
            <div
              className={`pg-state-message ${position.inRange ? "" : "is-closed"}`}
              role="status"
            >
              {position.inRange ? <Check size={17} /> : <Info size={17} />}
              <p>{message}</p>
            </div>
          </div>

          <div className="pg-panel pg-mix-panel">
            <div className="pg-mix-heading">
              <div>
                <span className="pg-label">ILLUSTRATED TOKEN MIX</span>
                <h3>What’s in your booth?</h3>
              </div>
              <span className="pg-small-tag">Allocation model</span>
            </div>
            <div className="pg-mix-labels">
              <span>
                <i className="sol" /> SOL <strong>{solPercent}%</strong>
              </span>
              <span>
                <i className="usdc" /> USDC <strong>{100 - solPercent}%</strong>
              </span>
            </div>
            <div
              className="pg-mix-track"
              role="img"
              aria-label={`Illustrated composition: ${solPercent} percent SOL and ${100 - solPercent} percent USDC`}
            >
              <span style={{ width: `${position.solShare * 100}%` }} />
              <span style={{ width: `${position.usdcShare * 100}%` }} />
            </div>
            <p>
              Price goes up: you sell SOL bit by bit. Price goes down: you buy
              SOL bit by bit.
            </p>
          </div>
        </section>

        <aside className="pg-sidebar" aria-label="Simulator settings">
          <section className="pg-panel pg-settings">
            <h2>
              <SlidersHorizontal size={16} /> Set up your booth
            </h2>
            <div className="pg-setting-label">
              <span>01</span>
              <h3>Choose your shape</h3>
            </div>
            <div className="pg-shape-options" aria-label="Liquidity shape">
              {shapes.map((item) => (
                <button
                  key={item.id}
                  aria-pressed={shape === item.id}
                  onClick={() => changeShape(item.id)}
                  className={shape === item.id ? "selected" : ""}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
            <p className="pg-setting-description">
              {selectedShape.description}
            </p>
            <div className="pg-setting-label">
              <span>02</span>
              <h3>Choose your range</h3>
            </div>
            <div className="pg-range-options" aria-label="Price range">
              {(["tight", "wide"] as RangeSize[]).map((item) => (
                <button
                  key={item}
                  aria-pressed={rangeSize === item}
                  onClick={() => changeRange(item)}
                  className={rangeSize === item ? "selected" : ""}
                >
                  {item === "tight" ? "Tight range" : "Wide range"}
                  {rangeSize === item && <Check size={13} />}
                </button>
              ))}
            </div>
            <div className="pg-boundaries">
              <div>
                <span>LOWER PRICE</span>
                <strong>{money(range.lower)}</strong>
              </div>
              <ArrowRight size={16} />
              <div>
                <span>UPPER PRICE</span>
                <strong>{money(range.upper)}</strong>
              </div>
            </div>
            <p className="pg-setting-description">
              {rangeSize === "tight"
                ? "More money in fewer bins. Price can leave your range sooner."
                : "The same money across more bins. More room for price to move."}
            </p>
          </section>

          <section className="pg-panel pg-fee-panel">
            <div className="pg-fee-heading">
              <h2>
                <Sparkles size={16} /> Try earning a fee
              </h2>
              <span>DEMO</span>
            </div>
            <p>
              A trader visits your booth. You get a small slice of their swap
              fee.
            </p>
            <div className="pg-swap-label">
              <label htmlFor="pg-swap">Pretend swap amount</label>
              <strong>{money(swapAmount)}</strong>
            </div>
            <input
              id="pg-swap"
              type="range"
              min={100}
              max={5_000}
              step={100}
              value={swapAmount}
              onChange={(event) => setSwapAmount(Number(event.target.value))}
              aria-valuetext={`${money(swapAmount)} swap`}
            />
            <button
              className="pg-swap-button"
              disabled={!position.inRange}
              onClick={() => {
                setFees((value) => value + nextFee);
                setSwaps((value) => value + 1);
              }}
            >
              {position.inRange
                ? "Simulate a swap"
                : "Move price into your range"}
              <ChevronRight size={16} />
            </button>
            <div className="pg-fee-total" role="status">
              <div>
                <span>Your example fees</span>
                <strong>{money(fees, 2)}</strong>
              </div>
              <span>
                {swaps} {swaps === 1 ? "swap" : "swaps"}
              </span>
            </div>
            <details className="pg-fee-details">
              <summary>
                How this example works <Info size={12} />
              </summary>
              <p>
                Swap × 0.3% fee × 95% left after a hypothetical 5% protocol cut
                × your 10% share of the active bin. A $1,000 swap gives you
                $0.285 before rounding.
              </p>
              <p>
                These are made-up settings, not a live pool. The whole swap
                stays in one bin. Real fees and your share vary. Fees stay
                separate. Changing shape or range starts a fresh fee example.
              </p>
            </details>
          </section>
        </aside>
      </div>

      <footer className="pg-model-note">
        <Info size={15} />
        <p>
          <strong>A simple picture, not a profit calculator.</strong> Every
          setup divides the same pretend $1,000 across its bins. The token mix
          uses those starting allocation weights and a simple conversion inside
          each bin. It does not calculate exact token balances, price losses, or
          returns. Real DLMM bins use percentage price steps; these use $2 steps
          to make learning easier. The upper range boundary is out of range.
        </p>
      </footer>
    </div>
  );
}
