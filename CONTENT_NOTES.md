# Content notes

Reviewed against primary sources on 16 October 2026.

The seven lessons are original beginner explanations. The airport booth analogy comes from the user. All SOL/USDC examples quote the price of SOL in USDC. Dollar values and simple bin labels are teaching examples, not current market data or suggested entries.

## Editorial decisions

- Use short paragraphs, everyday examples, and one-question checks.
- Explain a term before relying on it. LP means liquidity provider, volume means trading during a period, and TVL means the value held in a pool.
- Keep fee income separate from total profit and loss. Numerical examples are hypothetical arithmetic, not predicted returns.
- Avoid a universal 80% to 90% fee-share claim. An individual LP receives only their applicable share in the liquidity that serves a swap.
- Do not describe LPing as guaranteed income or a way to avoid being a losing trader.
- Do not prescribe a safe deposit size or number of wins that qualifies someone to increase it.
- The entry and exit checklist is an educational decision framework. It is not a prediction, a trade signal, or personalized financial advice.
- No em dashes are used in the authored lessons.

## Verified sources and scope

| Primary source                                                                                                    | Used for                                                                         |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [Becoming a liquidity provider](https://docs.meteora.ag/user-guides/becoming-a-liquidity-provider)                | LP basics and changing token balances                                            |
| [Why liquidity pools matter](https://docs.meteora.ag/get-started/why-are-liquidity-pools-important)               | Who supplies liquidity and why swaps need it                                     |
| [What is DLMM?](https://docs.meteora.ag/core-products/dlmm/what-is-dlmm)                                          | Price bins, active bin, and crossing bins                                        |
| [DLMM formulas](https://docs.meteora.ag/core-products/dlmm/formulas)                                              | Percentage spacing, fee parameters, total fee cap, and fee splits                |
| [Strategies and use cases](https://docs.meteora.ag/core-products/dlmm/strategies-and-use-cases)                   | Spot, Curve, Bid-Ask, and gradual token conversion                               |
| [Dynamic positions](https://docs.meteora.ag/core-products/dlmm/dynamic-positions)                                 | Range, fee ownership, pending fees, and no native auto-compounding               |
| [Collect fee mode](https://docs.meteora.ag/core-products/dlmm/collect-fee-mode)                                   | InputOnly and OnlyY are pool-level settings                                      |
| [Dynamic Terminal](https://docs.meteora.ag/user-guides/how-to-use-dlmm/dynamic-terminal)                          | Pool metrics, idle liquidity, claims, removal, and closing                       |
| [TradingView charts](https://docs.meteora.ag/user-guides/how-to-use-dlmm/tradingview-charts)                      | Using charts to set and review ranges                                            |
| [Staying safe](https://docs.meteora.ag/user-guides/staying-safe-on-meteora)                                       | Token risk tools and potentially inflated volume                                 |
| [Getting started](https://docs.meteora.ag/user-guides/getting-started-with-meteora)                               | SOL requirements and refundable versus nonrefundable costs                       |
| [LP Army Playground](https://www.lparmy.com/playground)                                                           | Simulation with no real-money gains or losses                                    |
| [LP Army glossary](https://www.lparmy.com/glossary)                                                               | General token, software, and liquidity risks                                     |
| [Uniswap: Understanding returns](https://developers.uniswap.org/docs/protocols/v2/concepts/understanding-returns) | General LP-versus-holding comparison only; no Uniswap formula is applied to DLMM |

## Accuracy guardrails for accompanying graphics

1. A bin has a fixed price. Adjacent prices follow a percentage step, so equally spaced dollar labels must be marked as simplified.
2. With SOL as base and USDC as quote, lower bins hold USDC and higher bins hold SOL. The active bin can contain both, but should not be described as always holding both.
3. One bin is active at an instant. A single swap can cross multiple bins. Fixed price within a bin does not eliminate fees or cross-bin price impact.
4. When price passes the full range, the deposited liquidity becomes one-sided. Its token amounts stay unchanged by swaps while idle, but its value can still change. Accrued fees are tracked separately.
5. Do not show a live or guaranteed yield in a learning calculator. Fees depend on traded volume, the pool settings, and competing liquidity in the bins used.
6. The 10% figure is a total swap-fee protocol cap. It is not a typical fee, an LP return, or a promise that a pool reaches it.
7. The glossary's suggestion that impermanent loss only becomes real on withdrawal is deliberately not repeated. The comparison already matters before withdrawal, and recovery is not assured.
8. The range does not automatically withdraw the position or act as a stop-loss. Rebalancing changes exposure and can incur costs; it does not remove an existing loss.
9. Claiming fees and withdrawing liquidity are different actions. Eligible rent recovery requires closing the relevant account, and not all setup costs are refundable.

## Content API

`src/data/lessons.ts` exports `Lesson`, `LessonSection`, `LessonSource`, `LessonQuiz`, and `lessons`.

Lesson IDs are `lp-basics`, `bins`, `ranges`, `fees`, `risks`, `entry-exit`, and `start-small`. Quiz answers use a zero-based `correct` index.

## User-supplied community references

The supplied X posts returned 403 errors during research, so their contents were not treated as verified sources. The guide uses the user’s pasted context alongside the official documentation above.

- https://x.com/0xthanhle/status/2110324677248012789
- https://x.com/met_lparmy/status/2086423045690863793
- https://x.com/krisquant/status/2099252984701968462
