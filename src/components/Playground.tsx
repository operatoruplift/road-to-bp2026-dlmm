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
  getFeeRates,
  getPosition,
  getRange,
  makeBins,
  PRICE_MAX,
  PRICE_MIN,
  simulateFee,
  START_PRICE,
} from "../lib/simulator";
import type { DepositMode, RangeSize, Shape } from "../lib/simulator";
import "./playground.css";

const shapes: {
  id: Shape;
  name: string;
  icons: Record<DepositMode, string>;
  description: string;
  singleSidedDescription?: string;
}[] = [
  {
    id: "spot",
    name: "Spot",
    icons: {
      "two-sided": "▆▆▆▆▆",
      "buy-lower": "▆▆▆▆▆",
      "sell-higher": "▆▆▆▆▆",
    },
    description: "An even stack. The same amount goes into each bin.",
  },
  {
    id: "curve",
    name: "Curve",
    icons: {
      "two-sided": "▂▅█▅▂",
      "buy-lower": "▁▃▅▆█",
      "sell-higher": "█▆▅▃▁",
    },
    description: "More in the middle of your chosen range.",
    singleSidedDescription:
      "One half of the curve. More stock near the $150 starting price, less at the far end.",
  },
  {
    id: "bid-ask",
    name: "Bid-Ask",
    icons: {
      "two-sided": "█▅▂▅█",
      "buy-lower": "█▆▅▃▁",
      "sell-higher": "▁▃▅▆█",
    },
    description: "More at the two edges of your chosen range.",
    singleSidedDescription:
      "One side of the valley. More stock at the far end, less near the $150 starting price.",
  },
];
const depositModes: { id: DepositMode; name: string; description: string }[] = [
  {
    id: "two-sided",
    name: "Both tokens",
    description: "Start with SOL and USDC around the $150 starting price.",
  },
  {
    id: "buy-lower",
    name: "Buy SOL lower",
    description:
      "Start with only USDC below $150. It buys SOL as price falls through your bins.",
  },
  {
    id: "sell-higher",
    name: "Sell SOL higher",
    description:
      "Start with only SOL above $150. It sells for USDC as price rises through your bins.",
  },
];
const feePercent = (rate: number) => `${(rate * 100).toFixed(2)}%`;
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
  const [depositMode, setDepositMode] = useState<DepositMode>("two-sided");
  const [price, setPrice] = useState(START_PRICE);
  const [volatility, setVolatility] = useState(0);
  const [swapAmount, setSwapAmount] = useState(1_000);
  const [fees, setFees] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const bins = useMemo(
    () => makeBins(shape, rangeSize, depositMode),
    [shape, rangeSize, depositMode],
  );
  const position = getPosition(price, bins);
  const range = getRange(rangeSize, depositMode);
  const selectedShape = shapes.find((item) => item.id === shape)!;
  const selectedMode = depositModes.find((item) => item.id === depositMode)!;
  const below = price < range.lower;
  const waiting =
    (depositMode === "buy-lower" && price >= range.upper) ||
    (depositMode === "sell-higher" && price < range.lower);
  const status = position.inRange
    ? "In your range"
    : waiting
      ? "Waiting for price"
      : "Out of your range";
  const percent = ((price - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxWeight = Math.max(...bins.map((bin) => bin.weight));
  const feeRates = getFeeRates(volatility);
  const nextFee = simulateFee(swapAmount, position.inRange, volatility);
  const solPercent = Math.round(position.solShare * 100);
  const message = position.inRange
    ? "Your booth is open. Swaps in bins where you have liquidity can earn you fees."
    : waiting
      ? `Your ${depositMode === "buy-lower" ? "USDC waits for a lower" : "SOL waits for a higher"} price. No new fees until trades reach your bins.`
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
      setPrice(START_PRICE);
      clearFees();
    }
  }
  function changeRange(next: RangeSize) {
    if (next !== rangeSize) {
      setRangeSize(next);
      setPrice(START_PRICE);
      clearFees();
    }
  }
  function changeDepositMode(next: DepositMode) {
    if (next !== depositMode) {
      setDepositMode(next);
      setPrice(START_PRICE);
      clearFees();
    }
  }
  function reset() {
    setShape("spot");
    setRangeSize("wide");
    setDepositMode("two-sided");
    setPrice(START_PRICE);
    setVolatility(0);
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
                {status}
              </span>
            </div>

            <div
              className="pg-chart"
              role="img"
              aria-label={`Illustrative ${selectedShape.name} liquidity distribution. ${selectedMode.name}. Price ${money(price)}. Range ${money(range.lower)} to ${money(range.upper)}. ${status}.`}
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
                aria-valuetext={`${price} USDC per SOL, ${status.toLowerCase()}`}
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
            {depositMode !== "two-sided" && (
              <p className="pg-reversal-note">
                <strong>Try moving the price back.</strong> Your tokens trade
                back too. Regular single-sided LP does not close itself when
                filled, so a “paid limit order” is only an analogy.
              </p>
            )}
          </div>
        </section>

        <aside className="pg-sidebar" aria-label="Simulator settings">
          <section className="pg-panel pg-settings">
            <h2>
              <SlidersHorizontal size={16} /> Set up your booth
            </h2>
            <div className="pg-setting-label">
              <span>01</span>
              <h3>What do you deposit?</h3>
            </div>
            <div className="pg-deposit-options" aria-label="Deposit mode">
              {depositModes.map((item) => (
                <button
                  key={item.id}
                  aria-pressed={depositMode === item.id}
                  onClick={() => changeDepositMode(item.id)}
                  className={depositMode === item.id ? "selected" : ""}
                >
                  {item.name}
                  {depositMode === item.id && <Check size={13} />}
                </button>
              ))}
            </div>
            <p className="pg-setting-description">{selectedMode.description}</p>
            <div className="pg-setting-label">
              <span>02</span>
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
                  <span aria-hidden="true">{item.icons[depositMode]}</span>
                  {item.name}
                </button>
              ))}
            </div>
            <p className="pg-setting-description">
              {depositMode !== "two-sided"
                ? (selectedShape.singleSidedDescription ??
                  selectedShape.description)
                : selectedShape.description}
            </p>
            <div className="pg-setting-label">
              <span>03</span>
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
            <p className="pg-setup-note">
              Changing your setup starts again at $150 and clears demo fees.
              Bins stay fixed while you move the price.
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
            <div className="pg-volatility-control">
              <div className="pg-swap-label">
                <label htmlFor="pg-volatility">Market volatility</label>
                <strong>
                  {volatility === 0
                    ? "Calm"
                    : volatility < 60
                      ? "Moving"
                      : "Surging"}
                </strong>
              </div>
              <input
                id="pg-volatility"
                type="range"
                min={0}
                max={100}
                step={1}
                value={volatility}
                onChange={(event) => setVolatility(Number(event.target.value))}
                aria-valuetext={`${volatility} out of 100, ${feePercent(feeRates.total)} illustrative total swap fee`}
              />
              <div className="pg-slider-labels">
                <span>Calm chop</span>
                <span>High volatility</span>
              </div>
              <div className="pg-fee-equation" aria-live="polite">
                <div>
                  <span>BASE</span>
                  <strong>{feePercent(feeRates.base)}</strong>
                </div>
                <span>+</span>
                <div>
                  <span>VARIABLE</span>
                  <strong>{feePercent(feeRates.variable)}</strong>
                </div>
                <span>=</span>
                <div>
                  <span>SWAP FEE</span>
                  <strong>{feePercent(feeRates.total)}</strong>
                </div>
              </div>
              <p className="pg-setup-note">
                A made-up fee curve with a 10% total fee cap. This is a trader’s
                swap fee, not your return. Higher fees do not remove price risk.
              </p>
            </div>
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
                Swap × {feePercent(feeRates.total)} fee × 90% example LP share
                after the protocol cut × your 10% share of the active bin. Your
                next {money(swapAmount)} swap earns {money(nextFee, 2)}
                {position.inRange
                  ? " in this example."
                  : " because your liquidity is idle."}
              </p>
              <p>
                These are made-up settings, not a live pool. The whole swap
                stays in one bin. Real fees and your share vary. Fees stay
                separate. Moving the volatility slider changes future swaps
                only. Real variable fees use a volatility accumulator, bin step
                and pool settings, not this simple slider formula.
              </p>
              <p>
                <a
                  href="https://docs.meteora.ag/core-products/dlmm/collect-fee-mode"
                  target="_blank"
                  rel="noreferrer"
                >
                  Quote-only fees
                </a>{" "}
                are a pool setting. When enabled, fees arrive in the pool’s
                quote token, such as USDC or SOL. You cannot switch this when
                claiming. Actual fee splits also vary by pool.
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
