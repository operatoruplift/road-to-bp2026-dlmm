export function MeteorMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 28 14 8l6 13 6-13 9 20H26l-6-9-6 9H5Z" fill="currentColor" />
      <path d="M12 33h16" stroke="currentColor" strokeWidth="3.5" />
    </svg>
  );
}

export default function HeroArt() {
  const heights = [48, 73, 108, 141, 179, 141, 108, 73, 48];
  return (
    <div
      className="hero-art"
      aria-label="Illustration of liquidity divided into price bins. The bright center column is the active bin."
    >
      <div className="art-topline">
        <span>
          <i /> LIQUIDITY, VISUALIZED
        </span>
        <span>SOL / USDC</span>
      </div>
      <svg
        className="bin-art"
        viewBox="0 0 570 420"
        role="img"
        aria-label="Nine three-dimensional liquidity bins, with the active bin highlighted orange"
      >
        <defs>
          <linearGradient id="front" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#ba482a" />
            <stop offset="1" stopColor="#552b21" />
          </linearGradient>
          <linearGradient id="active" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#ff9968" />
            <stop offset=".5" stopColor="#ff6537" />
            <stop offset="1" stopColor="#bf3820" />
          </linearGradient>
          <radialGradient id="ground">
            <stop stopColor="#ff6033" stopOpacity=".22" />
            <stop offset="1" stopColor="#ff6033" stopOpacity="0" />
          </radialGradient>
          <pattern
            id="grid"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
            patternTransform="matrix(1 .32 -1 .32 290 200)"
          >
            <path
              d="M 36 0 L 0 0 0 36"
              fill="none"
              stroke="#77716a"
              strokeOpacity=".21"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <ellipse cx="294" cy="300" rx="245" ry="95" fill="url(#ground)" />
        <path d="M12 276 302 172 565 294 268 414Z" fill="url(#grid)" />
        <path
          d="M60 202C80 67 440 27 510 180"
          stroke="#5c4638"
          strokeDasharray="3 7"
          fill="none"
        />
        <path d="m504 172 6 9 4-10" stroke="#9e7259" fill="none" />
        <circle cx="450" cy="88" r="32" fill="#2b211c" stroke="#6e422e" />
        <path
          d="m430 97 13-25 7 15 7-15 13 25h-12l-8-12-8 12Z"
          fill="#ff8355"
        />
        <path d="M440 103h20" stroke="#ff8355" strokeWidth="3" />
        <path
          d="M40 312 273 391 540 301"
          stroke="#584237"
          strokeWidth="1"
          fill="none"
        />
        {heights.map((h, i) => {
          const x = 58 + i * 49,
            y = 300 + Math.min(i, 4) * 11 - Math.max(0, i - 4) * 11;
          return (
            <g key={i} className={`art-column column-${i}`}>
              <path
                d={`M${x} ${y - h}h32v${h}h-32Z`}
                fill={i === 4 ? "url(#active)" : "url(#front)"}
                stroke={i === 4 ? "#ffb388" : "#975039"}
                strokeWidth=".7"
              />
              <path
                d={`M${x + 32} ${y - h}l17 -12v${h}l-17 12Z`}
                fill={i === 4 ? "#da4928" : "#54271c"}
                stroke={i === 4 ? "#ff8b59" : "#783c28"}
                strokeWidth=".7"
              />
              <path
                d={`M${x} ${y - h}l17 -12h32l-17 12Z`}
                fill={i === 4 ? "#ffbc8f" : "#bc5938"}
                stroke={i === 4 ? "#ffd5b5" : "#d37d50"}
                strokeWidth=".7"
              />
              {[1, 2, 3]
                .filter((n) => n * 30 < h)
                .map((n) => (
                  <path
                    key={n}
                    d={`M${x} ${y - n * 30}h32l17 -12`}
                    stroke={i === 4 ? "#ffbc8f" : "#b96744"}
                    strokeOpacity=".25"
                    fill="none"
                  />
                ))}
            </g>
          );
        })}
        <path d="M282 151v-45" stroke="#ffc7a4" strokeDasharray="3 4" />
        <rect x="233" y="77" width="102" height="29" rx="6" fill="#ff6a39" />
        <circle cx="248" cy="91.5" r="3" fill="#19110d" />
        <text
          x="260"
          y="96"
          fill="#21130c"
          fontSize="11"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          ACTIVE BIN
        </text>
        <text
          x="66"
          y="345"
          fill="#99928b"
          fontSize="12"
          fontFamily="Space Grotesk, sans-serif"
        >
          $140
        </text>
        <text
          x="264"
          y="378"
          fill="#ffc2a0"
          fontSize="12"
          fontFamily="Space Grotesk, sans-serif"
        >
          $150
        </text>
        <text
          x="470"
          y="335"
          fill="#99928b"
          fontSize="12"
          fontFamily="Space Grotesk, sans-serif"
        >
          $160
        </text>
        <path
          d="M90 99v12m-6-6h12M520 218v8m-4-4h8"
          stroke="#c7ab93"
          strokeWidth="1.5"
        />
        <circle cx="173" cy="65" r="2" fill="#9b765f" />
      </svg>
      <div className="art-bottomline">
        <span className="art-dot" /> Small bins. A whole new way to LP.
        <span className="art-footnote">ILLUSTRATION</span>
      </div>
    </div>
  );
}
