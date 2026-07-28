export function NetworkBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <line
          className="network-line"
          x1="120"
          y1="160"
          x2="380"
          y2="240"
          stroke="#123C31"
          strokeOpacity="0.18"
          strokeWidth="1"
        />
        <line
          className="network-line"
          style={{ animationDelay: "-3s" }}
          x1="380"
          y1="240"
          x2="620"
          y2="180"
          stroke="#123C31"
          strokeOpacity="0.15"
          strokeWidth="1"
        />
        <line
          className="network-line"
          style={{ animationDelay: "-7s" }}
          x1="620"
          y1="180"
          x2="880"
          y2="280"
          stroke="#B3935F"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
        <line
          className="network-line"
          style={{ animationDelay: "-11s" }}
          x1="380"
          y1="240"
          x2="480"
          y2="480"
          stroke="#123C31"
          strokeOpacity="0.12"
          strokeWidth="1"
        />
        <line
          className="network-line"
          style={{ animationDelay: "-5s" }}
          x1="480"
          y1="480"
          x2="760"
          y2="520"
          stroke="#506B5B"
          strokeOpacity="0.16"
          strokeWidth="1"
        />
        <line
          className="network-line"
          style={{ animationDelay: "-14s" }}
          x1="880"
          y1="280"
          x2="1040"
          y2="420"
          stroke="#123C31"
          strokeOpacity="0.14"
          strokeWidth="1"
        />
        <line
          className="network-line"
          style={{ animationDelay: "-9s" }}
          x1="760"
          y1="520"
          x2="1040"
          y2="420"
          stroke="#B3935F"
          strokeOpacity="0.12"
          strokeWidth="1"
        />

        {[
          [120, 160],
          [380, 240],
          [620, 180],
          [880, 280],
          [480, 480],
          [760, 520],
          [1040, 420],
          [260, 560],
          [940, 140],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            className="network-node"
            cx={cx}
            cy={cy}
            r={i % 3 === 0 ? 3.5 : 2.5}
            fill={i % 4 === 0 ? "#B3935F" : "#123C31"}
            fillOpacity="0.45"
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-ivory/40 via-transparent to-ivory" />
    </div>
  );
}
