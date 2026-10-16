export interface PnlInputs {
  deposit: number;
  tokenValue: number;
  fees: number;
  costs: number;
  holdingValue: number;
}

export const MAX_EXAMPLE_VALUE = 1_000_000;

export function boundedAmount(value: number, maximum = MAX_EXAMPLE_VALUE) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), maximum);
}

export function calculatePnl(inputs: PnlInputs) {
  const deposit = boundedAmount(inputs.deposit);
  const tokenValue = boundedAmount(inputs.tokenValue);
  const fees = boundedAmount(inputs.fees);
  const costs = boundedAmount(inputs.costs);
  const holdingValue = boundedAmount(inputs.holdingValue);
  const withdrawalValue = tokenValue + fees - costs;

  return {
    deposit,
    tokenValue,
    fees,
    costs,
    holdingValue,
    withdrawalValue,
    netPnl: withdrawalValue - deposit,
    versusHolding: withdrawalValue - holdingValue,
    tokenValueVersusHolding: tokenValue - holdingValue,
  };
}
