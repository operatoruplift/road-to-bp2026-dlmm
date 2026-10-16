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

`Lesson.extra?: LessonSection[]` contains optional deeper explanations. The ranges and risks lessons each have two extras. Keep these behind an optional disclosure so the seven-lesson beginner path remains short.

## Advanced context corrections

Rechecked on 16 October 2026 using the Solana MCP source catalogue, its Meteora documentation search, and the current Meteora pages. The corpus contains both older and current routes; current `core-products` pages take precedence over older `overview/products` pages.

- Single-sided buying: in SOL/USDC, USDC below the current price can gradually buy SOL as trading reaches those bins. SOL above price can gradually sell for USDC. The same direction rule depends on which token is base and which is quote. [Strategies and use cases](https://docs.meteora.ag/core-products/dlmm/strategies-and-use-cases)
- “Paid limit order” is only an analogy for a regular single-sided LP position. Its inventory can trade back on a reversal and it does not automatically close after a target is reached. Meteora now also has a distinct native Limit Order feature on eligible pools. Its order-account rules must not be confused with normal LP position rules. [Native DLMM limit orders](https://docs.meteora.ag/core-products/dlmm/limit-order), [DLMM swap mechanics](https://docs.meteora.ag/core-products/dlmm/what-is-dlmm)
- The claim that every position is limited to 69 bins is outdated. Current dynamic position documentation states a 70-bin default layout that can grow to a supported maximum of 1,400 bins. The current rent guide still references an extension threshold of more than 69 bins. Avoid treating either default or rent threshold as the maximum capacity. [Dynamic positions](https://docs.meteora.ag/core-products/dlmm/dynamic-positions)
- Bin step is measured in basis points. 10 means 0.1%; 100 means 1%. The overview documents support up to 400 basis points, or 4%, but pool creation options depend on the fee configuration. No numeric step is recommended for every pair. [DLMM formulas](https://docs.meteora.ag/core-products/dlmm/formulas), [DLMM overview](https://docs.meteora.ag/core-products/dlmm/what-is-dlmm), [Pool creation](https://docs.meteora.ag/user-guides/creating-a-liquidity-pool)
- A fixed 0.057 SOL total opening cost is not supported by current documentation. The setup guide currently gives roughly 0.059 SOL for standard position rent, with possible extension rent, account creation, and transaction costs. The UI preview is the appropriate source for a particular position. Fixed amounts are deliberately omitted from the beginner lesson. [Getting started](https://docs.meteora.ag/user-guides/getting-started-with-meteora)
- The $50 minus $120 example assumes $120 is the deposited tokens’ value decline, producing a $70 loss before costs. It must not label every token value drop as impermanent loss. A comparison with holding the original token amounts is a separate benchmark. [Understanding LP returns](https://developers.uniswap.org/docs/protocols/v2/concepts/understanding-returns)
- Waiting preserves the position but does not earn swap fees while idle. Rebalancing changes the working range and can change exposure and costs. Withdrawing returns the current token mix. None promises recovery. [Dynamic Terminal](https://docs.meteora.ag/user-guides/how-to-use-dlmm/dynamic-terminal)

## Interactive audit additions

The eight-point feature audit is documented in `AUDIT.md`. The playground now supports single-sided deposits, with ranges fixed around a $150 setup price; it can illustrate conversion in either direction and does not model self-closing native limit orders. Price, range, shape, or deposit mode do not change the pretend starting notional. Setup changes start a fresh example.

The fee illustration maps a 0–100 volatility control linearly to a variable rate from 0% to 9.7%, added to a 0.3% base. This is deliberately not the real volatility formula. The maximum total is 10%. The demo uses 90% LP allocation after a 10% protocol share, consistent with the documented standard pool split, then a hypothetical 10% share of the active bin. A $1,000 calm swap therefore yields $0.27 in example LP fees. Rates and ownership vary in real pools. Volatility changes affect subsequent demo swaps, leaving accrued fees unchanged.

The separate PnL exercise subtracts costs and the original deposit from current token value plus fees. Its optional holding comparison uses the same original token quantities. The entry checklist signals that four planning statements are acknowledged, not an investment recommendation. No precise APR, forecast, or safe-pool score is produced.

## User-supplied community references

The supplied X posts returned 403 errors during research, so their contents were not treated as verified sources. The guide uses the user’s pasted context alongside the official documentation above.

- https://x.com/0xthanhle/status/2110324677248012789
- https://x.com/met_lparmy/status/2086423045690863793
- https://x.com/krisquant/status/2099252984701968462
