export interface LessonSection {
  title: string;
  body: string;
}

export interface LessonSource {
  label: string;
  url: string;
}

export interface LessonQuiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  duration: string;
  intro: string;
  sections: LessonSection[];
  takeaway: string;
  quiz: LessonQuiz;
  sources: LessonSource[];
}

export const lessons: Lesson[] = [
  {
    id: "lp-basics",
    number: 1,
    title: "You are the exchange booth",
    shortTitle: "What is LPing?",
    subtitle: "From paying swap fees to supplying the tokens.",
    duration: "3 min",
    intro:
      "Imagine an airport booth that swaps dollars for yen. It needs both currencies in its drawers. Crypto swaps need stocked drawers, too.",
    sections: [
      {
        title: "A pool is a shared booth",
        body: "A liquidity pool is a shared supply of tokens. A trader puts one token in and takes the other out. Software on the blockchain handles the exchange. On Meteora, people can supply the tokens that make those swaps possible.",
      },
      {
        title: "LP just means you supply the stock",
        body: "LP means liquidity provider. LPing means putting tokens into a pool for traders to use. We will use SOL and USDC: SOL is Solana’s main coin. USDC is a token designed to track one US dollar. It is still a crypto asset, with its own risks.",
      },
      {
        title: "Your payment comes from swaps",
        body: "Traders pay a swap fee. When a trade uses your liquidity, you earn a share of the LP fees. Other providers share the earnings, and the protocol takes a portion. Supplying tokens does not give you every fee from the whole pool.",
      },
      {
        title: "Your stock keeps changing",
        body: "If customers buy SOL from your booth, you end up with less SOL and more USDC. If they sell SOL to it, you get more SOL and less USDC. You can earn fees while the value of your stock falls. LPing is not a savings account.",
      },
    ],
    takeaway:
      "You supply tokens for other people to swap. Fees are payment for taking that risk.",
    quiz: {
      question: "What are you doing when you LP?",
      options: [
        "Lending money to a bank for a fixed return",
        "Supplying tokens that other people can swap",
        "Buying a token that can only go up",
      ],
      correct: 1,
      explanation:
        "You stock the shared exchange booth. Traders swap against that stock, which changes the mix of tokens you own.",
    },
    sources: [
      {
        label: "Meteora: Becoming a liquidity provider",
        url: "https://docs.meteora.ag/user-guides/becoming-a-liquidity-provider",
      },
      {
        label: "Meteora: Why liquidity pools matter",
        url: "https://docs.meteora.ag/get-started/why-are-liquidity-pools-important",
      },
    ],
  },
  {
    id: "bins",
    number: 2,
    title: "One price. One little bucket.",
    shortTitle: "Meet the bins",
    subtitle: "DLMM organizes your tokens by price.",
    duration: "3 min",
    intro:
      "DLMM means Dynamic Liquidity Market Maker. The name is a mouthful. The useful idea is simple: put your stock on shelves with price tags.",
    sections: [
      {
        title: "Each bin has one price",
        body: "A bin is a bucket of liquidity at one fixed price. Imagine shelves marked $149, $150, and $151 per SOL. Those are rounded teaching labels. Real bins are separated by a percentage called the bin step, set for the pool.",
      },
      {
        title: "The active bin is the open counter",
        body: "One bin is active at a time. That is the pool’s current trading price. It can contain both tokens. When a swap uses up the needed token in that bin, it continues through other bins at their prices. One swap can visit several bins.",
      },
      {
        title: "What is waiting on each side?",
        body: "In our example, price means USDC per SOL. Bins below the active price hold USDC, ready to exchange for SOL as price falls. Bins above it hold SOL, ready to exchange for USDC as price rises. Your tokens change sides as trading moves through them.",
      },
      {
        title: "Fixed price does not mean free",
        body: "A swap filled inside one bin does not move that bin’s price. It still pays a fee. A larger swap can cross into other bins and move the pool price. So “zero slippage inside a bin” does not mean every swap has zero price impact.",
      },
    ],
    takeaway:
      "Your bins earn when swaps use their liquidity. Just being in the pool is not enough.",
    quiz: {
      question: "A swap is too big for one bin. What can happen?",
      options: [
        "It uses other bins at different prices",
        "Every bin trades at the same price forever",
        "The swap becomes free",
      ],
      correct: 0,
      explanation:
        "The pool can move through multiple bins. Each has its own price, and fees still apply.",
    },
    sources: [
      {
        label: "Meteora: What is DLMM?",
        url: "https://docs.meteora.ag/core-products/dlmm/what-is-dlmm",
      },
      {
        label: "Meteora: Bin prices and swap mechanics",
        url: "https://docs.meteora.ag/core-products/dlmm/formulas",
      },
    ],
  },
  {
    id: "ranges",
    number: 3,
    title: "Choose your shelves. Stack your stock.",
    shortTitle: "Ranges & shapes",
    subtitle: "Where you put tokens matters as much as how much you put in.",
    duration: "3 min",
    intro:
      "Your range chooses the price bins you cover. Your shape chooses how much liquidity goes into each of those bins.",
    sections: [
      {
        title: "A small net or a big net?",
        body: "A narrow range concentrates your deposit into fewer bins. That can mean more fees per dollar while those bins are used, but price can leave quickly. A wide range covers more prices. Your money is spread thinner, and it can still go out of range.",
      },
      {
        title: "Spot: an even row",
        body: "Spot spreads liquidity evenly across your chosen bins. Picture a row of equally filled buckets. It is the easiest shape to understand first. “Spot” here is a distribution shape, not a prediction that the market will stay still.",
      },
      {
        title: "Curve: a hill in the middle",
        body: "Curve puts more liquidity near the middle of your range. It focuses your stock where you expect trading to stay. If price moves toward the edges, less of your stock is there to serve it. A calm pair can still make a sudden move.",
      },
      {
        title: "Bid-Ask: more at the edges",
        body: "Bid-Ask puts more liquidity near the outer bins. Think of a valley between two hills. It can help spread buying or selling across a price move. Much of the deposit may wait away from the active price. It does not make a falling token safe.",
      },
    ],
    takeaway:
      "Range is where your money waits. Shape is how you divide it. Neither guarantees fees.",
    quiz: {
      question:
        "Which shape spreads liquidity evenly across your selected bins?",
      options: ["Curve", "Bid-Ask", "Spot"],
      correct: 2,
      explanation:
        "Spot is the even row. Curve builds a hill in the middle. Bid-Ask puts more near the edges.",
    },
    sources: [
      {
        label: "Meteora: Strategies and use cases",
        url: "https://docs.meteora.ag/core-products/dlmm/strategies-and-use-cases",
      },
      {
        label: "Meteora: Position ranges",
        url: "https://docs.meteora.ag/core-products/dlmm/dynamic-positions",
      },
    ],
  },
  {
    id: "fees",
    number: 4,
    title: "Fees are income. Profit is the whole picture.",
    shortTitle: "How fees work",
    subtitle: "Follow the fee without forgetting the value of your tokens.",
    duration: "3 min",
    intro:
      "A busy booth can collect lots of fees. But if its stock loses more value than those fees earn, the owner still loses money.",
    sections: [
      {
        title: "A base fee, plus a possible extra",
        body: "The base fee is the pool’s starting swap fee. A variable fee can rise as recent trading moves across bins, then cool down. The settings decide how it works. The protocol’s total fee cap is 10%, not a normal rate or a promised return.",
      },
      {
        title: "You get a share where you participate",
        body: "Only liquidity used by swaps earns those swap fees. Your share depends on your share of liquidity in the bins being used, after the applicable fee splits. A huge pool fee number is not a promise about your own small position.",
      },
      {
        title: "Fees wait to be claimed",
        body: "DLMM fees do not automatically become more liquidity. They build up separately until claimed. The pool’s fee mode decides the token: fees may arrive in the token a trader pays, or in the pool’s quote token only. It is not a free choice on every deposit.",
      },
      {
        title: "Count what you actually have",
        body: "Example: you deposit $100. Later, your remaining tokens are worth $90 and your separate fees are worth $3. Together you have $93, a $7 loss before costs. Your fee counter can be green while your total result is red.",
      },
    ],
    takeaway:
      "Net result includes token value, fees, and costs. A fee percentage alone cannot tell you that.",
    quiz: {
      question:
        "You start with $100. Your tokens are now worth $90 and fees are $3. Before costs, you have...",
      options: [
        "$103, because fees are profit",
        "$93, so you are down $7",
        "$100, because the loss is temporary",
      ],
      correct: 1,
      explanation:
        "$90 of tokens plus $3 of fees equals $93. Fees can soften a loss without turning it into a profit.",
    },
    sources: [
      {
        label: "Meteora: Fee formulas and limits",
        url: "https://docs.meteora.ag/core-products/dlmm/formulas",
      },
      {
        label: "Meteora: Fee collection modes",
        url: "https://docs.meteora.ag/core-products/dlmm/collect-fee-mode",
      },
      {
        label: "Meteora: Fee claims",
        url: "https://docs.meteora.ag/core-products/dlmm/dynamic-positions",
      },
    ],
  },
  {
    id: "risks",
    number: 5,
    title: "What happens when price leaves?",
    shortTitle: "Know the risks",
    subtitle: "Learn what you could end up holding before you deposit.",
    duration: "4 min",
    intro:
      "Your range is a working area, not a safety barrier. It does not stop the token’s price from falling.",
    sections: [
      {
        title: "Up means selling. Down means buying.",
        body: "With SOL priced in USDC, trades moving up through your bins gradually exchange your SOL for USDC. Moving down does the reverse. Once price passes above your whole range, the deposited liquidity is USDC. Below the whole range, it is SOL. Separately earned fees may contain either token.",
      },
      {
        title: "Out of range means your counter is idle",
        body: "Your deposited token amounts stop changing through swaps while price stays outside your range. That liquidity earns no new swap fees. Fees already earned remain claimable. Your tokens still have market risk. If price returns, your liquidity can be used again. A return is never promised.",
      },
      {
        title: "Impermanent loss compares LPing with holding",
        body: "Imagine keeping the exact tokens you started with in a wallet instead. If those tokens would now be worth more than your LP holdings before fees, the gap is called impermanent loss. You can face that gap even when your LP is up in dollars. “Impermanent” does not mean harmless or guaranteed to recover.",
      },
      {
        title: "The pool cannot fix a bad token",
        body: "Tokens can crash, lose their peg, or become hard to sell. Bugs in the software can also put funds at risk. An audited protocol does not make every token safe. Fees can be too small to cover losses, even when the displayed rate looks exciting.",
      },
    ],
    takeaway:
      "Before entering, be comfortable with the tokens you could end up holding and the loss you could face.",
    quiz: {
      question:
        "SOL falls below your whole SOL/USDC range. What is the usual result for deposited liquidity?",
      options: [
        "It becomes USDC and keeps earning",
        "It is automatically sold by a stop-loss",
        "It is SOL and earns no new swap fees while out of range",
      ],
      correct: 2,
      explanation:
        "As SOL falls through the range, the position exchanges USDC for SOL. Out of range, that deposited liquidity is idle. Previously earned fees remain claimable.",
    },
    sources: [
      {
        label: "Meteora: Out-of-range positions",
        url: "https://docs.meteora.ag/user-guides/how-to-use-dlmm/dynamic-terminal",
      },
      {
        label: "Meteora: Single-sided buying and selling",
        url: "https://docs.meteora.ag/core-products/dlmm/strategies-and-use-cases",
      },
      {
        label: "Uniswap: Understanding LP returns",
        url: "https://developers.uniswap.org/docs/protocols/v2/concepts/understanding-returns",
      },
      {
        label: "LP Army: LP risks glossary",
        url: "https://www.lparmy.com/glossary",
      },
    ],
  },
  {
    id: "entry-exit",
    number: 6,
    title: "Make the exit plan before the entrance",
    shortTitle: "Enter & exit",
    subtitle: "A checklist for decisions, not a signal to buy.",
    duration: "4 min",
    intro:
      "There is no perfect entry indicator. Your job is to understand the pair, decide what could go wrong, and know what you will do next.",
    sections: [
      {
        title: "Know both tokens first",
        body: "Check the token addresses and pool warnings. Look at who holds the supply and whether a creator can mint more tokens or freeze transfers. Use the risk tools linked by Meteora. A familiar ticker or a big trading number is not proof that a token is safe.",
      },
      {
        title: "Look for customers, not just a full booth",
        body: "Volume means how much was traded during a period. TVL means the value sitting in the pool. Volume divided by TVL is a rough activity clue. Compare the same time period, then inspect fees and activity across your bins. Volume can be inflated and yesterday’s activity can disappear.",
      },
      {
        title: "Write a plan in plain words",
        body: "For example: “I expect trading between these prices. I will review if it leaves that area, if volume fades, or if my loss reaches my limit.” Note when you will check again. A chart can help you choose a range, but no drawn support line guarantees a bounce.",
      },
      {
        title: "Leave when your reason no longer holds",
        body: "Review or exit when the token story changes, activity dries up, your planned loss limit is reached, or your objective is met. Going out of range is a prompt to reassess. Waiting, rebalancing, and withdrawing have different costs. Moving the range does not erase a loss. A range is not an automatic stop-loss.",
      },
    ],
    takeaway:
      "Choose your risk limit and review triggers before you deposit. High fees are only one input.",
    quiz: {
      question:
        "A pool shows a huge recent fee rate. What should you do first?",
      options: [
        "Check the tokens, activity, range, costs, and exit plan",
        "Assume the same rate will continue all year",
        "Deposit more because high fees remove risk",
      ],
      correct: 0,
      explanation:
        "Recent fees describe what happened. They do not promise future returns or make the token safe.",
    },
    sources: [
      {
        label: "Meteora: Staying safe",
        url: "https://docs.meteora.ag/user-guides/staying-safe-on-meteora",
      },
      {
        label: "Meteora: Pool statistics and position management",
        url: "https://docs.meteora.ag/user-guides/how-to-use-dlmm/dynamic-terminal",
      },
      {
        label: "Meteora: Ranges, entries, and monitoring",
        url: "https://docs.meteora.ag/user-guides/how-to-use-dlmm/tradingview-charts",
      },
    ],
  },
  {
    id: "start-small",
    number: 7,
    title: "Your first win is understanding it",
    shortTitle: "Start small",
    subtitle: "Practice a full lap before adding more money.",
    duration: "3 min",
    intro:
      "Learning to open a position is only half the job. Learn to check it, claim its fees, and close it, too.",
    sections: [
      {
        title: "Use pretend money first",
        body: "Try the LP Army Playground. Move price through your range and compare Spot, Curve, and Bid-Ask. Watch which token you end up holding. It is a simulation for learning. You cannot earn or lose real money there, and a simulation is not a forecast.",
      },
      {
        title: "Budget for the whole experiment",
        body: "If you move to real funds, use an amount you can afford to lose. Keep SOL for network fees and account rent. Rent is SOL set aside for on-chain account storage. Position rent can be reclaimed when closed. Some costs, including new bin-array creation, are not refundable. Check the cost preview.",
      },
      {
        title: "Finish one complete practice lap",
        body: "Choose a pair you understand and a range you can explain. Open a small position, watch the token mix, and practice claiming fees. When ready to finish, remove the liquidity and use Withdraw and Close to recover eligible position rent. Claiming fees alone does not close the position.",
      },
      {
        title: "Keep a simple scorecard",
        body: "Write down your deposits, withdrawals, fees, costs, and why you entered and left. Use one unit, such as USD, to compare results. Also compare with holding the original tokens. Review several positions in different market conditions before increasing size. A winning streak is not proof that a strategy is safe.",
      },
    ],
    takeaway:
      "Learn the whole process with a small amount. Size should follow understanding, not excitement.",
    quiz: {
      question: "Which result is the best reason to feel more prepared?",
      options: [
        "One position earned a large fee percentage",
        "You can explain your range, risks, total result, and how to exit",
        "Someone posted a screenshot of a big win",
      ],
      correct: 1,
      explanation:
        "Understanding the full process helps you make informed decisions. One win or a fee screenshot cannot measure the risk.",
    },
    sources: [
      {
        label: "LP Army: DLMM Playground",
        url: "https://www.lparmy.com/playground",
      },
      {
        label: "Meteora: SOL, transaction fees, and rent",
        url: "https://docs.meteora.ag/user-guides/getting-started-with-meteora",
      },
      {
        label: "Meteora: Withdrawing and closing",
        url: "https://docs.meteora.ag/user-guides/how-to-use-dlmm/dynamic-terminal",
      },
    ],
  },
];
