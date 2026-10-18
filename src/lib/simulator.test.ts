import assert from "node:assert/strict";
import test from "node:test";
import {
  DEMO_NOTIONAL,
  getFeeRates,
  getPosition,
  getRange,
  makeBins,
  simulateFee,
  START_PRICE,
} from "./simulator.ts";
import type { DepositMode, RangeSize, Shape } from "./simulator.ts";

test("every range and shape starts with the same normalized allocation", () => {
  for (const shape of ["spot", "curve", "bid-ask"] as Shape[]) {
    for (const range of ["tight", "wide"] as RangeSize[]) {
      const bins = makeBins(shape, range);
      assert.ok(
        Math.abs(bins.reduce((sum, bin) => sum + bin.weight, 0) - 1) < 1e-12,
      );
      assert.ok(
        Math.abs(
          bins.reduce((sum, bin) => sum + bin.allocation, 0) - DEMO_NOTIONAL,
        ) < 1e-9,
      );
      assert.ok(Math.abs(getPosition(150, bins).solShare - 0.5) < 1e-12);
    }
  }
});

test("below the range holds SOL and above the range holds USDC", () => {
  const bins = makeBins("spot", "tight");
  assert.deepEqual(getPosition(130, bins), {
    solShare: 1,
    usdcShare: 0,
    activeBin: -1,
    inRange: false,
  });
  const above = getPosition(170, bins);
  assert.equal(above.solShare, 0);
  assert.equal(above.usdcShare, 1);
  assert.equal(above.inRange, false);
  assert.equal(getPosition(142, bins).inRange, true);
  assert.equal(getPosition(158, bins).inRange, false);
});

test("rising prices gradually exchange SOL for USDC", () => {
  const bins = makeBins("curve", "wide");
  let previous = 1;
  for (let price = 120; price <= 180; price += 0.5) {
    const state = getPosition(price, bins);
    assert.ok(state.solShare <= previous + 1e-12);
    assert.ok(Math.abs(state.solShare + state.usdcShare - 1) < 1e-12);
    previous = state.solShare;
  }
});

test("fee demo applies protocol and active-bin shares and earns nothing out of range", () => {
  assert.ok(Math.abs(simulateFee(1_000, true) - 0.27) < 1e-12);
  assert.equal(simulateFee(1_000, false), 0);
  assert.equal(simulateFee(-1, true), 0);
  assert.equal(simulateFee(Number.NaN, true), 0);
});

test("one-sided deposits wait in their initial asset, enter, and fully convert", () => {
  for (const shape of ["spot", "curve", "bid-ask"] as Shape[]) {
    for (const size of ["tight", "wide"] as RangeSize[]) {
      for (const mode of ["buy-lower", "sell-higher"] as DepositMode[]) {
        const bins = makeBins(shape, size, mode);
        const range = getRange(size, mode);
        const start = getPosition(START_PRICE, bins);
        assert.ok(
          Math.abs(
            bins.reduce((sum, bin) => sum + bin.allocation, 0) - DEMO_NOTIONAL,
          ) < 1e-9,
        );
        assert.equal(start.inRange, false);
        assert.equal(simulateFee(1_000, start.inRange, 100), 0);
        assert.ok(
          Math.abs(start.solShare - (mode === "buy-lower" ? 0 : 1)) < 1e-12,
        );
        const halfway = getPosition((range.lower + range.upper) / 2, bins);
        assert.equal(halfway.inRange, true);
        assert.ok(halfway.solShare > 0 && halfway.solShare < 1);
        if (shape === "spot") {
          assert.ok(Math.abs(halfway.solShare - 0.5) < 1e-12);
        } else {
          const heavierSolHalf =
            (shape === "curve" && mode === "buy-lower") ||
            (shape === "bid-ask" && mode === "sell-higher");
          assert.ok(
            heavierSolHalf ? halfway.solShare > 0.5 : halfway.solShare < 0.5,
          );
        }
        assert.ok(simulateFee(1_000, halfway.inRange) > 0);
        const endPrice =
          mode === "buy-lower" ? range.lower - 1 : range.upper + 1;
        const end = getPosition(endPrice, bins);
        assert.equal(end.inRange, false);
        assert.ok(
          Math.abs(end.solShare - (mode === "buy-lower" ? 1 : 0)) < 1e-12,
        );
      }
    }
  }
});

test("single-sided shapes keep one half of the distribution instead of recentering it", () => {
  for (const size of ["tight", "wide"] as RangeSize[]) {
    for (const shape of ["spot", "curve", "bid-ask"] as Shape[]) {
      const buy = makeBins(shape, size, "buy-lower");
      const sell = makeBins(shape, size, "sell-higher");
      for (let i = 0; i < buy.length; i++) {
        assert.ok(
          Math.abs(buy[i].weight - sell[sell.length - 1 - i].weight) < 1e-12,
        );
        if (i === 0) continue;
        if (shape === "spot") {
          assert.equal(buy[i].weight, buy[i - 1].weight);
          assert.equal(sell[i].weight, sell[i - 1].weight);
        } else if (shape === "curve") {
          assert.ok(
            buy[i].weight > buy[i - 1].weight,
            "buy Curve grows toward the starting price",
          );
          assert.ok(
            sell[i].weight < sell[i - 1].weight,
            "sell Curve shrinks away from the starting price",
          );
        } else {
          assert.ok(
            buy[i].weight < buy[i - 1].weight,
            "buy Bid-Ask grows toward the lower outer edge",
          );
          assert.ok(
            sell[i].weight > sell[i - 1].weight,
            "sell Bid-Ask grows toward the upper outer edge",
          );
        }
      }
    }
  }
});

test("a one-sided position trades back on reversal instead of acting as a closed order", () => {
  for (const mode of ["buy-lower", "sell-higher"] as DepositMode[]) {
    const bins = makeBins("bid-ask", "wide", mode);
    const range = getRange("wide", mode);
    const start = getPosition(START_PRICE, bins);
    const middlePrice = (range.lower + range.upper) / 2;
    const onEntry = getPosition(middlePrice, bins);
    const end = getPosition(mode === "buy-lower" ? 120 : 180, bins);
    assert.notEqual(end.solShare, start.solShare);
    const onReversal = getPosition(middlePrice, bins);
    assert.deepEqual(onReversal, onEntry);
    assert.deepEqual(getPosition(START_PRICE, bins), start);
  }
});

test("the illustrative fee curve is monotonic and capped at a 10 percent total fee", () => {
  assert.deepEqual(getFeeRates(0), { base: 0.003, variable: 0, total: 0.003 });
  assert.equal(getFeeRates(100).total, 0.1);
  assert.ok(Math.abs(getFeeRates(100).variable - 0.097) < 1e-12);
  let previous = 0;
  for (let level = 0; level <= 100; level += 1) {
    const rate = getFeeRates(level);
    assert.ok(rate.total >= previous);
    assert.ok(rate.total <= 0.1);
    assert.ok(Math.abs(rate.base + rate.variable - rate.total) < 1e-12);
    previous = rate.total;
  }
  assert.ok(Math.abs(simulateFee(1_000, true, 100) - 9) < 1e-12);
  assert.equal(simulateFee(1_000, false, 100), 0);
});

test("invalid volatility cannot produce negative fees or exceed the cap", () => {
  assert.deepEqual(getFeeRates(-50), getFeeRates(0));
  assert.deepEqual(getFeeRates(150), getFeeRates(100));
  for (const invalid of [Number.NaN, Infinity, -Infinity]) {
    assert.deepEqual(getFeeRates(invalid), getFeeRates(0));
    assert.equal(simulateFee(invalid, true, 50), 0);
  }
});
