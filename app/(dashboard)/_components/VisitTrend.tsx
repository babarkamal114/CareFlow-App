// app/(dashboard)/_components/VisitTrend.tsx
// Visit Trend (30 days) — SVG area/line chart comparing Completed vs Scheduled

// ── Fake 30-day data ──────────────────────────────────────────────────────────
// Each pair: [completed, scheduled]
const data: [number, number][] = [
  [85,90],[88,92],[82,88],[90,95],[87,91],[92,96],[95,98],
  [88,93],[91,95],[94,99],[90,94],[93,97],[96,100],[98,102],
  [94,99],[97,101],[100,105],[96,101],[99,104],[102,107],
  [98,103],[101,106],[104,110],[100,105],[103,108],[106,112],
  [102,107],[105,110],[108,114],[110,116],
];

const W = 400;     // SVG viewport width
const H = 100;     // SVG viewport height
const PAD = 8;

// Scale value to SVG y-coordinate (inverted)
function scaleY(v: number, min: number, max: number): number {
  return PAD + (1 - (v - min) / (max - min)) * (H - PAD * 2);
}

function buildPath(values: number[], min: number, max: number, fill?: boolean): string {
  const n = values.length;
  const pts = values.map((v, i) => {
    const x = PAD + (i / (n - 1)) * (W - PAD * 2);
    const y = scaleY(v, min, max);
    return `${x},${y}`;
  });

  const line = `M ${pts.join(" L ")}`;
  if (!fill) return line;

  // Close for fill area
  const lastX = PAD + W - PAD * 2;
  return `${line} L ${lastX},${H - PAD} L ${PAD},${H - PAD} Z`;
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function VisitTrend() {
  const completed  = data.map(d => d[0]);
  const scheduled  = data.map(d => d[1]);
  const allVals    = [...completed, ...scheduled];
  const min        = Math.min(...allVals) - 5;
  const max        = Math.max(...allVals) + 5;

  // Build x-axis labels (just first/mid/last dates for cleanliness)
  const xLabels = ["Apr 1", "Apr 10", "Apr 20", "Apr 30"];

  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111318]">Visit Trend — 30 Days</h2>
        {/* Legend */}
        <div className="flex items-center gap-3">
          {[["#00C48C","Completed"],["#A0A3B1","Scheduled"]].map(([color, lbl]) => (
            <div key={lbl} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-[#A0A3B1]">{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: 110 }}
      >
        <defs>
          {/* Green gradient fill for completed */}
          <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#00C48C" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#00C48C" stopOpacity="0.01" />
          </linearGradient>
          {/* Grey gradient fill for scheduled */}
          <linearGradient id="gradScheduled" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#A0A3B1" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#A0A3B1" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Scheduled fill + line */}
        <path d={buildPath(scheduled, min, max, true)}  fill="url(#gradScheduled)" />
        <path d={buildPath(scheduled, min, max, false)} fill="none" stroke="#A0A3B1" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* Completed fill + line */}
        <path d={buildPath(completed, min, max, true)}  fill="url(#gradCompleted)" />
        <path d={buildPath(completed, min, max, false)} fill="none" stroke="#00C48C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* End dot on completed line */}
        {(() => {
          const lastX = PAD + W - PAD * 2;
          const lastY = scaleY(completed[completed.length - 1], min, max);
          return (
            <circle cx={lastX} cy={lastY} r="4" fill="#00C48C" stroke="white" strokeWidth="1.5" />
          );
        })()}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between -mt-2">
        {xLabels.map((l) => (
          <span key={l} className="text-[10px] text-[#A0A3B1]">{l}</span>
        ))}
      </div>

    </div>
  );
}
