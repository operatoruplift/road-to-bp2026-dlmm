# Eight-point learning experience audit

Reviewed on 16 October 2026 against the requested checklist. The baseline was production commit `a66fb30`. These eight points are user-supplied review criteria, not a verified official judging rubric. The [LP Army bounty](https://www.lparmy.com/bounties/ca13defa-7639-41d2-b26f-50c4010cf95b) asks for a beginner guide covering bins, ranges, fees, entry, exit, and sizing.

| Item                                | Before                                                                          | Change                                                                                                | Where to try it       |
| ----------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------- |
| 1. Swapper vs LP hook               | Explained in the first lesson and cover graphic; no interactive hero comparison | Two role buttons explain paying a swap fee versus supplying inventory and receiving a share           | Home hero             |
| 2. Bin step, capacity, and rent     | Accurate written explanation in optional lesson details                         | Interactive percentage-step comparison with 69 example bins, current capacity and variable rent notes | Meet the bins lesson  |
| 3. Shapes and single-sided mode     | Three shapes worked; single-sided was text only                                 | Independent deposit modes: both tokens, USDC to buy SOL lower, SOL to sell higher                     | Playground            |
| 4. Dynamic fees and quote-only fees | Static 0.3% fee demonstration; quote-only explained in the lesson               | Volatility slider shows base plus variable fees, capped at 10% total, with pool fee-mode explanation  | Playground fee panel  |
| 5. Fees versus net PnL              | Written examples and holding comparison                                         | Fees and token-value-drop sliders, optional costs and same-starting-token holding benchmark           | Know the risks lesson |
| 6. Entry checklist                  | Written checklist and graphic                                                   | Four native checkboxes, live completion count and preparation badge                                   | Enter & exit lesson   |
| 7. LP Army resources                | Homepage links and Playground source link                                       | Direct Academy, Playground, Strategy Library and Community Tools buttons                              | Start small lesson    |
| 8. Sharing metadata                 | Correct og:image and summary_large_image; no explicit twitter:image             | Explicit X image, title, description, alt text, OG URL and site name                                  | Page source           |

## Corrections to the proposed copy

- **69 bins is not a current hard limit.** Current positions have a 70-bin default layout and support expansion to 1,400 bins. The interactive example deliberately uses 69 prices, which means 68 gaps. Its endpoints use `150 / (1 + bps / 10000)^34` and `150 * (1 + bps / 10000)^34`. [Dynamic positions](https://docs.meteora.ag/core-products/dlmm/dynamic-positions), [formulas](https://docs.meteora.ag/core-products/dlmm/formulas)
- **Rent varies.** Eligible position and extension rent can be recovered on closing. Transaction fees and some setup costs cannot. Do not promise a fixed 0.057 SOL refund. [Getting started](https://docs.meteora.ag/user-guides/getting-started-with-meteora)
- **10% caps the total swap fee.** It is neither an LP return nor a typical rate. The volatility slider is an illustrative linear mapping, not Meteora's real volatility accumulator. Its example pool sends 90% of swap fees to LPs, and the user has a hypothetical 10% share of the active bin. [Formulas](https://docs.meteora.ag/core-products/dlmm/formulas), [protocol revenues](https://docs.meteora.ag/protocol/protocol-revenues)
- **Single-sided LP is not a self-closing order.** Swaps can reverse the inventory on a price reversal. Fees require trading in the deposited bins. Meteora also has separate native limit orders. [Strategies](https://docs.meteora.ag/core-products/dlmm/strategies-and-use-cases), [limit orders](https://docs.meteora.ag/core-products/dlmm/limit-order)
- **Quote-only fees are a pool setting.** OnlyY pays in token Y, potentially SOL or USDC. LPs cannot arbitrarily select another fee token when claiming. [Collect fee mode](https://docs.meteora.ag/core-products/dlmm/collect-fee-mode)
- **Going out of range does not itself cause a price loss.** The PnL example separates falling token value, fees, costs and the value of holding the original tokens. The checklist's green state means the plan is complete, not that the pool is safe or that someone should deposit.
- **Decoder Farmer is one listed tool.** Official resource destinations are [Academy](https://www.lparmy.com/academy), [Playground](https://www.lparmy.com/playground), [Strategy Library](https://www.lparmy.com/strategies) and [Community Tools](https://www.lparmy.com/community-tools).

## Scope and limits

The site remains an independent educational guide. Practice values are illustrative, with no wallet, transactions, live market data, or backtesting. The main simulator uses fixed $2 price steps and allocation weights, not exact DLMM token accounting. The PnL calculator is a separate arithmetic example. Neither forecasts returns.

Sharing metadata makes the image available to X's crawler, but X controls card rendering and caching. No post was published as part of this audit.

## Validation

- 12 automated arithmetic and simulator behavior tests passed.
- TypeScript and the production build passed; code and TypeScript reviewers reported no actionable defects.
- Browser checks covered role switching, bin-step outputs, single-sided waiting and conversion, reversal, fee cap and accrued-fee preservation, reset, PnL and holding comparisons, checklist completion and unchecking, and direct resource links.
- Narrow-screen checks at 320 pixels found no horizontal overflow. The compact shape icons were adjusted to fit their buttons.
