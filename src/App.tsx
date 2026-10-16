import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Coins,
  ExternalLink,
  FlaskConical,
  GraduationCap,
  Layers3,
  Lightbulb,
  Menu,
  Pause,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import HeroArt, { MeteorMark } from "./components/HeroArt";
import Playground from "./components/Playground";
import { lessons } from "./data/lessons";

type Page = "learn" | "playground" | "glossary";
const storageKey = "dlmm-road-progress-v1";
const icons: LucideIcon[] = [
  Store,
  Layers3,
  TrendingUp,
  Coins,
  ShieldCheck,
  CircleHelp,
  GraduationCap,
];
const glossary = [
  [
    "Liquidity",
    "Tokens available for people to swap. Think of the cash in a currency exchange booth.",
  ],
  [
    "Liquidity provider (LP)",
    "A person who puts tokens into a pool so others can trade. They can earn a share of trading fees and can also lose money.",
  ],
  [
    "Liquidity pool",
    "A shared pot of tokens managed by a program. Traders swap tokens with this pot.",
  ],
  [
    "DLMM",
    "Dynamic Liquidity Market Maker. Meteora’s system for placing tokens into price bins and adjusting trading fees as prices move.",
  ],
  [
    "Bin",
    "A small container of liquidity at one specific price. Real bin prices are separated by a percentage step.",
  ],
  [
    "Active bin",
    "The bin at the pool’s current price. It is the first place a swap uses liquidity. A large swap can move through several bins.",
  ],
  [
    "Bin step",
    "The percentage gap between neighboring bin prices. It is a pool setting.",
  ],
  [
    "Range",
    "The lowest and highest prices where you choose to provide liquidity.",
  ],
  [
    "Out of range",
    "The pool price has moved outside your chosen bins. Your idle liquidity earns no new swap fees until it is used again.",
  ],
  [
    "Spot",
    "A distribution that spreads your deposit evenly across the bins you select.",
  ],
  [
    "Curve",
    "A distribution that puts more of your deposit near the middle of your chosen range.",
  ],
  [
    "Bid-Ask",
    "A distribution that places more of your deposit near the two ends of your range.",
  ],
  ["Swap", "Exchanging one token for another, for example SOL for USDC."],
  [
    "SOL and USDC",
    "SOL is Solana’s native token. USDC is a stablecoin designed to track one US dollar, but it is not risk free.",
  ],
  [
    "Base and dynamic fees",
    "The trading fee has a base part set by pool parameters and a variable part that can rise with measured price volatility.",
  ],
  [
    "Impermanent loss (IL)",
    "How much worse your liquidity position performs than simply holding the same starting tokens, usually measured before fees. It does not have to reverse.",
  ],
  [
    "Price impact",
    "The change in the pool’s price caused by your trade. Using up one bin can move a swap into the next bin at a different price.",
  ],
  [
    "Slippage",
    "The difference between the price you expected and the price your trade actually gets.",
  ],
  [
    "Volume",
    "The value of tokens traded over a time period, such as 24 hours. More real trading can create more fees.",
  ],
  [
    "TVL",
    "Total value locked. The combined value of tokens deposited in a pool, usually shown in dollars.",
  ],
  [
    "PnL",
    "Profit and loss. Count the current value of your tokens and earned fees, then subtract what you put in and any costs.",
  ],
  [
    "Rent",
    "SOL held to keep an account on Solana. Some account deposits can be returned when eligible empty accounts are closed. Transaction fees are not returned.",
  ],
];

function readProgress(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (id): id is string =>
                typeof id === "string" && lessons.some((l) => l.id === id),
            ),
          ),
        ]
      : [];
  } catch {
    return [];
  }
}
function currentRoute() {
  const hash = window.location.hash.slice(1);
  return {
    page: (hash === "playground" || hash === "glossary"
      ? hash
      : "learn") as Page,
    lesson: hash.startsWith("lesson/") ? hash.slice(7) : "",
  };
}
function App() {
  const [route, setRoute] = useState(currentRoute);
  const [activeLesson, setActiveLesson] = useState(() =>
    Math.max(
      0,
      lessons.findIndex((l) => l.id === currentRoute().lesson),
    ),
  );
  const [completed, setCompleted] = useState<string[]>(readProgress);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const lessonRef = useRef<HTMLElement>(null);
  const lesson = lessons[activeLesson];
  const totalMinutes = lessons.reduce(
    (sum, item) => sum + (Number.parseInt(String(item.duration), 10) || 3),
    0,
  );
  useEffect(() => {
    const onHash = () => {
      const next = currentRoute();
      setRoute(next);
      setMobileMenu(false);
      if (next.lesson) {
        const index = lessons.findIndex((l) => l.id === next.lesson);
        if (index >= 0) setActiveLesson(index);
        setTimeout(
          () =>
            lessonRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            }),
          60,
        );
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("hashchange", onHash);
    if (currentRoute().lesson)
      setTimeout(
        () => lessonRef.current?.scrollIntoView({ block: "start" }),
        80,
      );
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completed));
    } catch {
      /* Learning still works when storage is unavailable. */
    }
  }, [completed]);
  useEffect(() => {
    setAnswer(null);
    setSpeaking(false);
    window.speechSynthesis?.cancel();
  }, [activeLesson, route.page]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  function openLesson(index: number) {
    setActiveLesson(index);
    window.location.hash = `lesson/${lessons[index].id}`;
    setTimeout(() => {
      lessonRef.current?.focus({ preventScroll: true });
      lessonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
  function chooseAnswer(index: number) {
    setAnswer(index);
    if (index === lesson.quiz.correct)
      setCompleted((prev) =>
        prev.includes(lesson.id) ? prev : [...prev, lesson.id],
      );
  }
  function listen() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const speech = new SpeechSynthesisUtterance(
      [
        lesson.title,
        lesson.intro,
        ...lesson.sections.flatMap((s) => [s.title, s.body]),
        "Remember.",
        lesson.takeaway,
      ].join(". "),
    );
    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.onend = () => setSpeaking(false);
    speech.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(speech);
    setSpeaking(true);
  }
  const startIndex = lessons.findIndex((l) => !completed.includes(l.id));
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("main-content");
          main?.focus({ preventScroll: true });
          main?.scrollIntoView({ block: "start" });
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a href="#learn" className="brand" aria-label="Meteora learning home">
            <MeteorMark />
            <span>meteora</span>
            <span className="brand-divider" />
            <span className="learn-label">LEARN</span>
          </a>
          <nav
            className={`main-nav ${mobileMenu ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            <a
              href="#learn"
              className={route.page === "learn" ? "active" : ""}
              aria-current={route.page === "learn" ? "page" : undefined}
            >
              <BookOpen size={15} />
              The guide
            </a>
            <a
              href="#playground"
              className={route.page === "playground" ? "active" : ""}
              aria-current={route.page === "playground" ? "page" : undefined}
            >
              <FlaskConical size={15} />
              Playground<span className="tiny-badge">TRY IT</span>
            </a>
            <a
              href="#glossary"
              className={route.page === "glossary" ? "active" : ""}
              aria-current={route.page === "glossary" ? "page" : undefined}
            >
              Glossary
            </a>
          </nav>
          <a
            className="community-link"
            href="https://www.lparmy.com/"
            target="_blank"
            rel="noreferrer"
          >
            Meet the LP Army
            <ArrowUpRight size={15} />
          </a>
          <button
            className="mobile-toggle icon-button"
            aria-label={mobileMenu ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        {route.page === "learn" && (
          <>
            <section className="hero container">
              <div className="hero-copy">
                <div className="hero-eyebrow">
                  <span className="road-pill">
                    <span className="tiny-star">✳</span> ROAD TO BP2026
                  </span>
                  <span className="beginner-label">
                    <i />
                    BEGINNER FRIENDLY
                  </span>
                </div>
                <h1>
                  Zero to hero.
                  <br />
                  <span>One bin at a time.</span>
                </h1>
                <p className="hero-description">
                  You know how to swap tokens.
                  <br />
                  Now learn how the other side works.
                </p>
                <p className="hero-detail">
                  A simple, hands-on guide to Meteora DLMM. From your very first
                  liquidity pool to bins, fees, and knowing when to walk away.
                </p>
                <div className="hero-actions">
                  <button
                    className="button button-primary"
                    onClick={() => openLesson(startIndex < 0 ? 0 : startIndex)}
                  >
                    {completed.length > 0
                      ? "Continue learning"
                      : "Start from zero"}
                    <ArrowRight size={18} />
                  </button>
                  <a className="button button-quiet" href="#playground">
                    <FlaskConical size={17} />
                    Try the playground
                    <ArrowUpRight size={16} />
                  </a>
                </div>
                <div className="hero-meta">
                  <span>
                    <BookOpen size={14} />7 bite-sized lessons
                  </span>
                  <span>
                    <Clock3 size={14} />
                    About {totalMinutes} minutes
                  </span>
                  <span>
                    <Wallet size={14} />
                    No wallet needed
                  </span>
                </div>
              </div>
              <HeroArt />
            </section>
            <div className="journey-strip">
              <div className="container journey-inner">
                <span className="journey-label">YOUR NEXT CHAPTER</span>
                <div>
                  <span className="journey-number">01</span>Understand the
                  basics
                </div>
                <ChevronRight size={15} />
                <div>
                  <span className="journey-number">02</span>Play with the
                  possibilities
                </div>
                <ChevronRight size={15} />
                <div>
                  <span className="journey-number">03</span>Know the risks
                </div>
                <span className="strip-spark">✳</span>
              </div>
            </div>
            <section
              className="course container"
              aria-labelledby="course-title"
            >
              <div className="section-heading">
                <div>
                  <div className="eyebrow">THE LEARNING PATH</div>
                  <h2 id="course-title">Big ideas. Small steps.</h2>
                  <p>
                    No finance degree. No confusing jargon. Just one lightbulb
                    moment at a time.
                  </p>
                </div>
                <span className="course-counter">
                  <span>{String(completed.length).padStart(2, "0")}</span> / 07
                  lessons completed
                </span>
              </div>
              <div className="course-layout">
                <aside className="course-sidebar">
                  <div className="sidebar-top">
                    <span>YOUR ROAD TO DLMM</span>
                    <span>
                      {Math.round((completed.length / lessons.length) * 100)}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      style={{
                        width: `${(completed.length / lessons.length) * 100}%`,
                      }}
                    />
                  </div>
                  <nav className="lesson-list" aria-label="Course lessons">
                    {lessons.map((item, index) => {
                      const Icon = icons[index];
                      return (
                        <button
                          key={item.id}
                          className={`lesson-tab ${activeLesson === index ? "selected" : ""}`}
                          onClick={() => openLesson(index)}
                          aria-current={
                            activeLesson === index ? "step" : undefined
                          }
                        >
                          <span
                            className={`lesson-number ${completed.includes(item.id) ? "done" : ""}`}
                          >
                            {completed.includes(item.id) ? (
                              <Check size={15} />
                            ) : (
                              String(index + 1).padStart(2, "0")
                            )}
                          </span>
                          <span className="lesson-tab-text">
                            <strong>{item.shortTitle}</strong>
                            <small>
                              <Icon size={11} />
                              {item.duration} read
                            </small>
                          </span>
                          {activeLesson === index && <ChevronRight size={16} />}
                        </button>
                      );
                    })}
                  </nav>
                  <div className="sidebar-note">
                    <div className="note-symbol">
                      <Lightbulb size={18} />
                    </div>
                    <strong>New here? You belong here.</strong>
                    <p>
                      You can take your time, replay a lesson, or try things
                      out. There is no rush.
                    </p>
                  </div>
                  <a href="#playground" className="sidebar-practice">
                    <FlaskConical size={17} />
                    <span>
                      Learn by doing<small>Open the practice playground</small>
                    </span>
                    <ArrowUpRight size={16} />
                  </a>
                </aside>
                <article
                  className="lesson-content"
                  key={lesson.id}
                  ref={lessonRef}
                  tabIndex={-1}
                >
                  <div className="lesson-kicker">
                    <span>
                      LESSON {String(activeLesson + 1).padStart(2, "0")}{" "}
                      <span className="muted">/ 07</span>
                    </span>
                    {"speechSynthesis" in window && (
                      <button
                        className={`listen-button ${speaking ? "speaking" : ""}`}
                        onClick={listen}
                      >
                        {speaking ? (
                          <Pause size={14} />
                        ) : (
                          <AudioLines size={15} />
                        )}{" "}
                        {speaking ? "Stop listening" : "Listen to lesson"}
                      </button>
                    )}
                  </div>
                  <h3>{lesson.title}</h3>
                  <p className="lesson-intro">{lesson.intro}</p>
                  <LessonVisual index={activeLesson} />
                  <div className="lesson-sections">
                    {lesson.sections.map((section, index) => (
                      <section key={section.title}>
                        <div className="section-number">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <h4>{section.title}</h4>
                          <p>{section.body}</p>
                        </div>
                      </section>
                    ))}
                  </div>
                  <div className="takeaway">
                    <Lightbulb size={20} />
                    <div>
                      <strong>The one thing to remember</strong>
                      <p>{lesson.takeaway}</p>
                    </div>
                  </div>
                  <section className="quiz" aria-labelledby="quiz-heading">
                    <div className="eyebrow">
                      <Sparkles size={13} /> A QUICK LIGHTBULB CHECK
                    </div>
                    <h4 id="quiz-heading">{lesson.quiz.question}</h4>
                    <div className="quiz-options">
                      {lesson.quiz.options.map((option, index) => (
                        <button
                          key={option}
                          onClick={() => chooseAnswer(index)}
                          disabled={answer === lesson.quiz.correct}
                          className={
                            answer === index
                              ? index === lesson.quiz.correct
                                ? "correct"
                                : "incorrect"
                              : ""
                          }
                        >
                          <span>
                            {answer === index &&
                            index === lesson.quiz.correct ? (
                              <Check size={14} />
                            ) : (
                              String.fromCharCode(65 + index)
                            )}
                          </span>
                          {option}
                        </button>
                      ))}
                    </div>
                    {answer !== null && (
                      <div
                        className={`quiz-feedback ${answer === lesson.quiz.correct ? "success" : ""}`}
                        role="status"
                      >
                        <strong>
                          {answer === lesson.quiz.correct
                            ? "You got it."
                            : "Almost. Let’s think it through."}
                        </strong>{" "}
                        {lesson.quiz.explanation}
                        {answer !== lesson.quiz.correct &&
                          " Give it another try."}
                      </div>
                    )}
                  </section>
                  <div className="lesson-footer">
                    <details className="sources">
                      <summary>
                        Check the sources <ExternalLink size={12} />
                      </summary>
                      {lesson.sources.map((source) => (
                        <a
                          key={source.url}
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {source.label}
                          <ArrowUpRight size={12} />
                        </a>
                      ))}
                    </details>
                    {activeLesson < lessons.length - 1 ? (
                      <button
                        className="button button-primary"
                        onClick={() => openLesson(activeLesson + 1)}
                      >
                        Next lesson
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <a href="#playground" className="button button-primary">
                        Put it into practice
                        <ArrowRight size={16} />
                      </a>
                    )}
                  </div>
                  {completed.length === lessons.length && (
                    <div className="course-complete">
                      <CheckCircle2 size={26} />
                      <div>
                        <strong>Seven lightbulb moments. A solid start.</strong>
                        <p>
                          You finished every knowledge check. Practice is your
                          next step. Completing the course is not a signal to
                          invest.
                        </p>
                      </div>
                    </div>
                  )}
                </article>
              </div>
            </section>
            <section className="practice-banner container">
              <div className="banner-art" aria-hidden="true">
                {[24, 38, 56, 73, 90, 73, 56, 38, 24].map((h, i) => (
                  <i key={i} style={{ height: h }} />
                ))}
              </div>
              <div>
                <span className="eyebrow">
                  LESS READING. MORE “OH, I GET IT.”
                </span>
                <h2>
                  Your first position?
                  <br />
                  Make it a pretend one.
                </h2>
                <p>
                  Move the price. Try a shape. See what happens when you go out
                  of range.
                </p>
              </div>
              <a href="#playground" className="button button-primary">
                Enter the playground
                <ArrowUpRight size={17} />
              </a>
            </section>
            <section className="resources container">
              <div>
                <div className="eyebrow">KEEP EXPLORING</div>
                <h2>Good company for the road.</h2>
              </div>
              <a
                href="https://www.lparmy.com/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="resource-icon">
                  <GraduationCap />
                </span>
                <div>
                  <strong>Learn with the LP Army</strong>
                  <p>Community, coaching, and more practice.</p>
                </div>
                <ArrowUpRight size={20} />
              </a>
              <a
                href="https://docs.meteora.ag/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="resource-icon">
                  <BookOpen />
                </span>
                <div>
                  <strong>Straight from Meteora</strong>
                  <p>Go deeper with the official documentation.</p>
                </div>
                <ArrowUpRight size={20} />
              </a>
            </section>
          </>
        )}
        {route.page === "playground" && (
          <div className="container playground-wrapper">
            <Playground />
            <div className="playground-next">
              <a href="#lesson/bins">
                <ArrowDown size={16} />
                Need a refresher? Read the bins lesson
              </a>
              <a
                href="https://www.lparmy.com/"
                target="_blank"
                rel="noreferrer"
              >
                Explore the LP Army
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        )}
        {route.page === "glossary" && (
          <section className="glossary-page container">
            <div className="eyebrow">CRYPTO, IN HUMAN WORDS</div>
            <h1>
              A little less jargon.
              <br />
              <span>A lot more clarity.</span>
            </h1>
            <p>Every unfamiliar word is just an idea you haven’t met yet.</p>
            <div className="glossary-search">
              <Search size={19} />
              <input
                aria-label="Search the glossary"
                type="search"
                placeholder="Find a word, like ‘bin’ or ‘liquidity’"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  className="icon-button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <p className="search-count" role="status">
              {
                glossary.filter((item) =>
                  item.join(" ").toLowerCase().includes(query.toLowerCase()),
                ).length
              }{" "}
              simple explanations
            </p>
            <dl className="glossary-grid">
              {glossary
                .filter((item) =>
                  item.join(" ").toLowerCase().includes(query.toLowerCase()),
                )
                .map(([term, meaning]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{meaning}</dd>
                  </div>
                ))}
            </dl>
            {!glossary.some((item) =>
              item.join(" ").toLowerCase().includes(query.toLowerCase()),
            ) && (
              <div className="no-results">
                <Search size={28} />
                <h2>No match yet.</h2>
                <p>
                  Try a shorter word, or clear the search to see every
                  explanation.
                </p>
                <button
                  className="button button-primary"
                  onClick={() => setQuery("")}
                >
                  Show all words
                </button>
              </div>
            )}
            <a className="back-to-guide" href="#learn">
              <BookOpen size={16} />
              Back to the guide
              <ArrowRight size={16} />
            </a>
          </section>
        )}
      </main>
      <footer className="site-footer container">
        <div className="footer-top">
          <a href="#learn" className="brand">
            <MeteorMark />
            <span>meteora</span>
            <span className="learn-label">LEARN</span>
          </a>
          <span>Made for the curious. Built for the journey.</span>
          <a href="https://www.meteora.ag/" target="_blank" rel="noreferrer">
            Explore Meteora
            <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="footer-bottom">
          <p>
            An independent community learning guide, inspired by Meteora and the
            LP Army. Not an official Meteora product. Educational examples, not
            financial advice. Providing liquidity can lose money.
          </p>
          <span>
            ROAD TO BP2026 <span className="footer-star">✳</span>
          </span>
        </div>
      </footer>
    </>
  );
}

function LessonVisual({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="booth-visual">
        <div className="booth-caption">THINK OF A CURRENCY EXCHANGE BOOTH</div>
        <div className="booth-flow">
          <div className="flow-person">
            <div className="flow-circle">
              <Wallet size={23} />
            </div>
            <strong>You, the LP</strong>
            <span>Put tokens in</span>
          </div>
          <div className="flow-arrow">
            <span>SOL + USDC</span>
            <ArrowRight size={25} />
          </div>
          <div className="exchange-booth">
            <div className="booth-awning">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="booth-body">
              <Store size={25} />
              <strong>The pool</strong>
              <div>
                <span className="token-sol">◎</span>
                <span className="token-usdc">$</span>
              </div>
            </div>
          </div>
          <div className="flow-arrow">
            <span>SWAP + FEE</span>
            <ArrowRight size={25} />
          </div>
          <div className="flow-person">
            <div className="flow-circle">
              <ArrowRight size={23} />
            </div>
            <strong>The trader</strong>
            <span>Swaps tokens</span>
          </div>
        </div>
        <div className="booth-return">
          <Coins size={15} />
          <span>A share of trading fees comes back to you.</span>
        </div>
      </div>
    );
  if (index === 1)
    return (
      <div className="concept-visual">
        <div className="booth-caption">ONE PRICE. ONE LITTLE BUCKET.</div>
        <div className="simple-bins">
          {[140, 145, 150, 155, 160].map((p, i) => (
            <div key={p} className={i === 2 ? "is-active" : ""}>
              <span>{i === 2 ? "ACTIVE" : i < 2 ? "USDC" : "SOL"}</span>
              <div style={{ height: 58 + (i % 3) * 22 }}>
                {i === 2 ? "SOL + USDC" : i < 2 ? "$" : "◎"}
              </div>
              <strong>${p}</strong>
            </div>
          ))}
        </div>
        <p>Illustrative prices. Real bins use percentage steps.</p>
      </div>
    );
  if (index === 2)
    return (
      <div className="concept-visual shape-preview">
        {["Spot", "Curve", "Bid-Ask"].map((shape, i) => (
          <div key={shape}>
            <div className="mini-bars">
              {Array.from({ length: 9 }, (_, j) => (
                <i
                  key={j}
                  style={{
                    height:
                      i === 0
                        ? 44
                        : i === 1
                          ? 70 - Math.abs(j - 4) * 13
                          : 20 + Math.abs(j - 4) * 13,
                  }}
                />
              ))}
            </div>
            <strong>{shape}</strong>
            <span>
              {["Evenly spread", "More in the middle", "More at the edges"][i]}
            </span>
          </div>
        ))}
      </div>
    );
  if (index === 3)
    return (
      <div className="fee-visual">
        <span>
          <small>BASE FEE</small>
          <Coins />
          <strong>The regular toll</strong>
        </span>
        <b>+</b>
        <span>
          <small>VARIABLE FEE</small>
          <TrendingUp />
          <strong>Adjusts to movement</strong>
        </span>
        <b>=</b>
        <span>
          <small>TOTAL SWAP FEE</small>
          <Wallet />
          <strong>Shared with LPs</strong>
        </span>
        <p>Your share depends on liquidity used and the pool’s fee settings.</p>
      </div>
    );
  if (index === 4)
    return (
      <div className="risk-visual">
        <div>
          <span className="risk-direction">PRICE FALLS ↓</span>
          <strong>More SOL</strong>
          <small>You buy SOL as it falls through your bins.</small>
        </div>
        <div className="risk-center">
          <Layers3 />
          <span>Your range</span>
        </div>
        <div>
          <span className="risk-direction">PRICE RISES ↑</span>
          <strong>More USDC</strong>
          <small>You sell SOL as it rises through your bins.</small>
        </div>
        <p>
          Outside your range: no new fees from idle liquidity. Your tokens can
          still lose value.
        </p>
      </div>
    );
  if (index === 5)
    return (
      <div className="decision-visual">
        <div>
          <span className="decision-dot green" />
          <strong>Before entering</strong>
          <p>
            Know the tokens.
            <br />
            Understand the activity.
            <br />
            Write your exit plan.
          </p>
        </div>
        <ArrowRight />
        <div>
          <span className="decision-dot orange" />
          <strong>While you are in</strong>
          <p>
            Check the whole position.
            <br />
            Watch price and volume.
            <br />
            Revisit your original plan.
          </p>
        </div>
      </div>
    );
  return (
    <div className="start-visual">
      <FlaskConical size={32} />
      <ArrowRight />
      <GraduationCap size={32} />
      <ArrowRight />
      <ShieldCheck size={32} />
      <strong>Practice first. Understand the risks. Start small.</strong>
    </div>
  );
}
export default App;
