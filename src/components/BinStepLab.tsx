import { useState } from "react";
import { ArrowUpRight, MoveHorizontal } from "lucide-react";
import "./learning-extras.css";

const steps = [1, 10, 25, 100];
const dollars = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function BinStepLab() {
  const [bps, setBps] = useState(10);
  // 69 bin prices have 68 gaps, with 34 on either side of the middle bin.
  const factor = (1 + bps / 10_000) ** 34;
  const lower = 150 / factor;
  const upper = 150 * factor;
  return (
    <details className="bin-lab">
      <summary>
        <MoveHorizontal size={17} />
        <span>Try bin step: same bins, wider reach</span>
        <small>TRY IT</small>
      </summary>
      <div className="bin-lab-body">
        <h4>How far apart are the price tags?</h4>
        <p>
          Keep 69 example bins. Change the gap between each price. A basis
          point, or bp, is 0.01%.
        </p>
        <div className="bin-step-choices" aria-label="Example bin step">
          {steps.map((step) => (
            <button
              key={step}
              aria-pressed={step === bps}
              onClick={() => setBps(step)}
            >
              {step} {step === 1 ? "bp" : "bps"}
              <small>{step / 100}%</small>
            </button>
          ))}
        </div>
        <div className="bin-step-result" role="status">
          <div>
            <span>FIRST BIN PRICE</span>
            <strong>{dollars(lower)}</strong>
          </div>
          <div>
            <span>MIDDLE BIN</span>
            <strong>$150.00</strong>
          </div>
          <div>
            <span>LAST BIN PRICE</span>
            <strong>{dollars(upper)}</strong>
          </div>
        </div>
        <div className="bin-span-track" aria-hidden="true">
          <span
            style={{ width: `${Math.max(8, (Math.log10(bps) / 2) * 100)}%` }}
          >
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
        <p className="bin-lab-caption">
          69 prices, 68 gaps. The labels use percentage spacing. The track shows
          relative spread.
        </p>
        <div className="bin-lab-facts">
          <p>
            <strong>69 is an example, not today’s limit.</strong> Current
            dynamic positions start with a 70-bin layout and can expand to 1,400
            bins. More bins can require more rent.
          </p>
          <p>
            <strong>Rent is a storage deposit.</strong> Eligible position rent
            is returned when you withdraw and close. The amount varies. Network
            fees and some setup costs are not refunded. Read the transaction
            preview.
          </p>
          <p>
            Smaller steps mean closer prices. Wider steps cover more movement
            with the same bin count. Check the pool and pair; no step is best
            for every token.
          </p>
        </div>
        <div className="learning-source-links">
          <a
            href="https://docs.meteora.ag/core-products/dlmm/dynamic-positions"
            target="_blank"
            rel="noreferrer"
          >
            Position limits <ArrowUpRight size={12} />
          </a>
          <a
            href="https://docs.meteora.ag/user-guides/getting-started-with-meteora"
            target="_blank"
            rel="noreferrer"
          >
            Rent and costs <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </details>
  );
}
