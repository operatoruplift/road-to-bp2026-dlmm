export type Shape = "spot" | "curve" | "bid-ask";
export type RangeSize = "tight" | "wide";
export type DepositMode = "two-sided" | "buy-lower" | "sell-higher";

export const DEMO_NOTIONAL = 1_000;
export const BIN_STEP = 2;
export const PRICE_MIN = 120;
export const PRICE_MAX = 180;
export const START_PRICE = 150;
export const FEE_ASSUMPTIONS = {
  swapRate: 0.003,
  maximumSwapRate: 0.1,
  protocolShare: 0.1,
  activeBinShare: 0.1,
};

export interface DemoBin {
  lower: number;
  upper: number;
  weight: number;
  allocation: number;
}

export function getRange(size: RangeSize, mode: DepositMode = "two-sided") {
  if (mode === "buy-lower") {
    return { lower: size === "tight" ? 140 : 122, upper: 148 };
  }
  if (mode === "sell-higher") {
    return { lower: 152, upper: size === "tight" ? 160 : 178 };
  }
  return size === "tight"
    ? { lower: 142, upper: 158 }
    : { lower: 130, upper: 170 };
}

export function makeBins(
  shape: Shape,
  size: RangeSize,
  mode: DepositMode = "two-sided",
): DemoBin[] {
  const range = getRange(size, mode);
  const count = (range.upper - range.lower) / BIN_STEP;
  const raw = Array.from({ length: count }, (_, i) => {
    const distance = Math.abs((2 * i) / (count - 1) - 1);
    if (shape === "curve") return 0.12 + Math.exp(-3 * distance ** 2);
    if (shape === "bid-ask") return 0.24 + distance ** 2;
    return 1;
  });
  const total = raw.reduce((sum, weight) => sum + weight, 0);
  return raw.map((weight, i) => ({
    lower: range.lower + i * BIN_STEP,
    upper: range.lower + (i + 1) * BIN_STEP,
    weight: weight / total,
    allocation: (weight / total) * DEMO_NOTIONAL,
  }));
}

// Allocation shares explain conversion direction, not live token balances or PnL.
// Inside a bin, conversion is linear for this teaching model.
export function getPosition(price: number, bins: DemoBin[]) {
  const solShare = bins.reduce((sum, bin) => {
    const fraction = Math.max(0, Math.min(1, (bin.upper - price) / BIN_STEP));
    return sum + bin.weight * fraction;
  }, 0);
  const activeBin = bins.findIndex(
    (bin) => price >= bin.lower && price < bin.upper,
  );
  return {
    solShare: Math.max(0, Math.min(1, solShare)),
    usdcShare: Math.max(0, Math.min(1, 1 - solShare)),
    activeBin,
    inRange: activeBin !== -1,
  };
}

// A deliberately simple teaching curve, not Meteora's volatility accumulator.
export function getFeeRates(volatility: number) {
  const level = Number.isFinite(volatility)
    ? Math.max(0, Math.min(100, volatility))
    : 0;
  const base = FEE_ASSUMPTIONS.swapRate;
  const variable = (FEE_ASSUMPTIONS.maximumSwapRate - base) * (level / 100);
  return {
    base,
    variable,
    total: Math.min(FEE_ASSUMPTIONS.maximumSwapRate, base + variable),
  };
}

export function simulateFee(
  swapAmount: number,
  inRange: boolean,
  volatility = 0,
) {
  if (!inRange || !Number.isFinite(swapAmount) || swapAmount <= 0) return 0;
  const { protocolShare, activeBinShare } = FEE_ASSUMPTIONS;
  return (
    swapAmount *
    getFeeRates(volatility).total *
    (1 - protocolShare) *
    activeBinShare
  );
}
