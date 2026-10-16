import assert from "node:assert/strict";
import test from "node:test";
import { boundedAmount, calculatePnl } from "./learning-tools.ts";

const example = {
  deposit: 1_000,
  tokenValue: 910,
  fees: 40,
  costs: 0,
  holdingValue: 1_000,
};

test("fees do not hide a larger loss in token value", () => {
  const result = calculatePnl(example);
  assert.equal(result.withdrawalValue, 950);
  assert.equal(result.netPnl, -50);
  assert.equal(result.versusHolding, -50);
  assert.equal(result.tokenValueVersusHolding, -90);
});

test("costs reduce returns while the holding benchmark stays independent", () => {
  const result = calculatePnl({ ...example, costs: 10, holdingValue: 900 });
  assert.equal(result.withdrawalValue, 940);
  assert.equal(result.netPnl, -60);
  assert.equal(result.versusHolding, 40);
  assert.equal(result.tokenValueVersusHolding, 10);
});

test("breaking even and earning a net profit are distinct from collecting fees", () => {
  assert.equal(calculatePnl({ ...example, fees: 90 }).netPnl, 0);
  assert.equal(calculatePnl({ ...example, fees: 100 }).netPnl, 10);
  assert.equal(
    calculatePnl({ ...example, fees: 90, holdingValue: 1_050 }).versusHolding,
    -50,
  );
});

test("invalid or outsize inputs produce bounded finite amounts", () => {
  assert.equal(boundedAmount(-20), 0);
  assert.equal(boundedAmount(Number.NaN), 0);
  assert.equal(boundedAmount(Number.POSITIVE_INFINITY), 0);
  assert.equal(boundedAmount(2_000_000), 1_000_000);
  assert.equal(boundedAmount(1_200, 1_000), 1_000);
  const result = calculatePnl({
    deposit: Number.NaN,
    tokenValue: Number.POSITIVE_INFINITY,
    fees: -20,
    costs: 2_000_000,
    holdingValue: Number.NEGATIVE_INFINITY,
  });
  assert.ok(Object.values(result).every(Number.isFinite));
  assert.equal(result.netPnl, -1_000_000);
});
