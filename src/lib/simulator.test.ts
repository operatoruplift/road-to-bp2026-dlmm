import assert from "node:assert/strict";
import test from "node:test";
import {
  DEMO_NOTIONAL,
  getPosition,
  makeBins,
  simulateFee,
} from "./simulator.ts";
import type { RangeSize, Shape } from "./simulator.ts";

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
  assert.ok(Math.abs(simulateFee(1_000, true) - 0.285) < 1e-12);
  assert.equal(simulateFee(1_000, false), 0);
  assert.equal(simulateFee(-1, true), 0);
  assert.equal(simulateFee(Number.NaN, true), 0);
});
