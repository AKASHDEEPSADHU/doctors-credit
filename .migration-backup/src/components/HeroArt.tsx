export default function HeroArt() {
  return (
    <svg
      className="hero-art"
      viewBox="0 0 480 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="480" height="620" fill="#F3EDE1" />
      <rect x="24" y="24" width="432" height="572" stroke="#B8935A" strokeWidth="1" />
      <path
        d="M80 560V220C80 220 80 96 240 96C400 96 400 220 400 220V560"
        stroke="#5C1F2E"
        strokeWidth="1.2"
      />
      <path d="M80 560H400" stroke="#5C1F2E" strokeWidth="1.2" />
      <path
        d="M140 560V280C140 280 140 170 240 170C340 170 340 280 340 280V560"
        stroke="#B8935A"
        strokeWidth="1"
      />
      <circle cx="240" cy="250" r="28" stroke="#5C1F2E" strokeWidth="1" />
      <path d="M212 250H268M240 222V278" stroke="#B8935A" strokeWidth="0.8" />
      <g stroke="#4A342A" strokeWidth="0.6" opacity="0.45">
        {Array.from({ length: 7 }).map((_, i) => {
          const y = 320 + i * 28;
          return <path key={y} d={`M160 ${y}H320`} />;
        })}
        {Array.from({ length: 6 }).map((_, i) => {
          const x = 168 + i * 26;
          return <path key={x} d={`M${x} 320V508`} />;
        })}
      </g>
      <text
        x="240"
        y="590"
        textAnchor="middle"
        fill="#4A342A"
        fontSize="11"
        letterSpacing="3"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        HYDERABAD
      </text>
    </svg>
  );
}
