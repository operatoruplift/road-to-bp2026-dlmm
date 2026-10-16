import { useState } from "react";
import { ArrowLeftRight, Store } from "lucide-react";
import "./learning-extras.css";

export default function RoleHook() {
  const [role, setRole] = useState<"swapper" | "provider">("swapper");
  return (
    <section className="role-hook" aria-label="Swapper or liquidity provider">
      <p className="role-prompt">Same swap. Two sides. Tap a role.</p>
      <div className="role-choices">
        <button
          aria-pressed={role === "swapper"}
          onClick={() => setRole("swapper")}
        >
          <ArrowLeftRight size={19} />
          <span>
            <strong>The swapper</strong>
            <small>Pay a swap fee</small>
          </span>
        </button>
        <button
          aria-pressed={role === "provider"}
          onClick={() => setRole("provider")}
        >
          <Store size={19} />
          <span>
            <strong>The liquidity provider</strong>
            <small>Supply tokens. Earn a share.</small>
          </span>
        </button>
      </div>
      <p className="role-explanation" role="status">
        {role === "swapper"
          ? "You give USDC and receive SOL. You pay a swap fee, may face price impact, and hold the token you bought."
          : "You stock the exchange booth. Traders change your token mix. You earn a share when they use your bins, but your tokens can lose value."}
      </p>
    </section>
  );
}
