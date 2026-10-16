import { useId, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { boundedAmount, calculatePnl } from "../lib/learning-tools";
import "./lesson-tools.css";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function signedMoney(value: number) {
  return `${value > 0 ? "+" : value < 0 ? "−" : ""}${money.format(Math.abs(value))}`;
}

function PnlRealityCheck() {
  const id = useId();
  const [fees, setFees] = useState(40);
  const [drop, setDrop] = useState(90);
  const [costs, setCosts] = useState(0);
  const [holdingValue, setHoldingValue] = useState(1_000);
  const result = calculatePnl({
    deposit: 1_000,
    tokenValue: 1_000 - drop,
    fees,
    costs,
    holdingValue,
  });

  function reset() {
    setFees(40);
    setDrop(90);
    setCosts(0);
    setHoldingValue(1_000);
  }

  return (
    <section className="lt-tool" aria-labelledby={`${id}-title`}>
      <div className="lt-heading">
        <span className="lt-eyebrow">TRY THE MATH</span>
        <button className="lt-reset" type="button" onClick={reset}>
          <RotateCcw size={12} aria-hidden="true" /> Reset example
        </button>
      </div>
      <h3 id={`${id}-title`}>Fees in. But are you ahead?</h3>
      <p className="lt-intro">
        A high APR is an annualized rate, not a profit promise. Imagine starting
        with $1,000. Move the sliders to see the whole result.
      </p>
      <div className="lt-sliders">
        <div className="lt-slider-field">
          <label htmlFor={`${id}-fees`}>
            Fees earned <strong>{money.format(fees)}</strong>
          </label>
          <input
            id={`${id}-fees`}
            type="range"
            min="0"
            max="200"
            step="5"
            value={fees}
            aria-valuetext={`${money.format(fees)} earned in fees`}
            onChange={(event) =>
              setFees(boundedAmount(event.currentTarget.valueAsNumber, 200))
            }
          />
        </div>
        <div className="lt-slider-field">
          <label htmlFor={`${id}-drop`}>
            Drop in your tokens' value <strong>{money.format(drop)}</strong>
          </label>
          <input
            id={`${id}-drop`}
            type="range"
            min="0"
            max="1000"
            step="10"
            value={drop}
            aria-valuetext={`${money.format(drop)} drop in token value`}
            onChange={(event) =>
              setDrop(boundedAmount(event.currentTarget.valueAsNumber, 1_000))
            }
          />
        </div>
      </div>
      <div className="lt-equation" aria-label="Value after fees and costs">
        <span>
          <strong>{money.format(result.tokenValue)}</strong>tokens now
        </span>
        <b aria-hidden="true">+</b>
        <span>
          <strong>{money.format(result.fees)}</strong>fees
        </span>
        <b aria-hidden="true">−</b>
        <span>
          <strong>{money.format(result.costs)}</strong>costs
        </span>
        <b aria-hidden="true">=</b>
        <span>
          <strong>{money.format(result.withdrawalValue)}</strong>net value
        </span>
      </div>
      <div className="lt-result" aria-live="polite" aria-atomic="true">
        <span>Net profit or loss</span>
        <strong className={result.netPnl < 0 ? "lt-negative" : "lt-positive"}>
          {signedMoney(result.netPnl)}
        </strong>
        <span>compared with your $1,000 start</span>
      </div>
      <details className="lt-compare">
        <summary>Compare with simply holding</summary>
        <p>
          What would the <strong>same starting tokens</strong> be worth today if
          you had kept them in your wallet? Enter that value, not a new
          portfolio.
        </p>
        <div className="lt-number-fields">
          <label htmlFor={`${id}-holding`}>
            Holding value today ($)
            <input
              id={`${id}-holding`}
              type="number"
              min="0"
              max="1000000"
              step="any"
              value={holdingValue}
              onChange={(event) =>
                setHoldingValue(
                  boundedAmount(event.currentTarget.valueAsNumber),
                )
              }
            />
          </label>
          <label htmlFor={`${id}-costs`}>
            Your LP costs ($)
            <input
              id={`${id}-costs`}
              type="number"
              min="0"
              max="1000000"
              step="any"
              value={costs}
              onChange={(event) =>
                setCosts(boundedAmount(event.currentTarget.valueAsNumber))
              }
            />
          </label>
        </div>
        <div className="lt-holding-result" aria-live="polite">
          <span>LP result vs holding, after fees and costs</span>
          <strong
            className={result.versusHolding < 0 ? "lt-negative" : "lt-positive"}
          >
            {signedMoney(result.versusHolding)}
          </strong>
        </div>
        <p>
          Impermanent loss compares your LP token value with holding the same
          starting tokens, before fees and costs. That is different from net
          profit.
        </p>
      </details>
      <p className="lt-note">
        Made-up values, not a return forecast. Going out of range stops new fees
        from idle liquidity. It does not itself cause a price loss.
      </p>
    </section>
  );
}

const checks = [
  {
    title: "I checked real trading activity.",
    body: "I reviewed recent volume and fees relative to pool liquidity. A high ratio alone is not enough.",
  },
  {
    title: "I know why I chose this range.",
    body: "I reviewed recent price movement and support. A chart pattern cannot promise the price will stay here.",
  },
  {
    title: "I can accept holding the downside token.",
    body: "If price falls below my bottom bin, I understand which token I could end up holding.",
  },
  {
    title: "I wrote down my exit plan.",
    body: "I set a profit target and a point where my reason for entering no longer holds. Out of range is not an automatic stop-loss.",
  },
];

function PreFlight() {
  const id = useId();
  const [checked, setChecked] = useState<boolean[]>(checks.map(() => false));
  const count = checked.filter(Boolean).length;
  const complete = count === checks.length;

  return (
    <section className="lt-tool" aria-labelledby={`${id}-title`}>
      <div className="lt-heading">
        <span className="lt-eyebrow">BEFORE YOU DEPOSIT</span>
        <span className="lt-counter" aria-live="polite">
          {count} / 4 reviewed
        </span>
      </div>
      <h3 id={`${id}-title`}>Do you have a plan?</h3>
      <p className="lt-intro">
        Take a moment to check each idea. It is fine to keep learning.
      </p>
      <div className="lt-checks">
        {checks.map((check, index) => (
          <label
            key={check.title}
            className={`lt-check${checked[index] ? " is-checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={checked[index]}
              onChange={(event) => {
                const next = event.currentTarget.checked;
                setChecked((previous) =>
                  previous.map((value, item) =>
                    item === index ? next : value,
                  ),
                );
              }}
            />
            <span>
              <strong>{check.title}</strong>
              <span>{check.body}</span>
            </span>
          </label>
        ))}
      </div>
      <div
        className={`lt-plan-status${complete ? " is-complete" : ""}`}
        role="status"
      >
        {complete && <Check size={16} aria-hidden="true" />}
        {complete
          ? "PLAN COMPLETE · START SMALL"
          : "YOUR PLAN IS STILL IN PROGRESS"}
      </div>
      <p className="lt-note">
        A plan is not a safety check or a recommendation to deposit.
      </p>
    </section>
  );
}

export default function LessonTools({ lessonId }: { lessonId: string }) {
  if (lessonId === "risks") return <PnlRealityCheck />;
  if (lessonId === "entry-exit") return <PreFlight />;
  return null;
}
