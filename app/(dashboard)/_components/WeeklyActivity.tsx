// app/(dashboard)/_components/WeeklyActivity.tsx
// Weekly Activity — stacked bar chart (Done / At Risk / Missed) for Mon–Sun

// ── Data ──────────────────────────────────────────────────────────────────────
// Each entry: [done, atRisk, missed] visit counts
const days = [
  { label: "Mon", done: 110, atRisk: 20, missed: 8  },
  { label: "Tue", done: 130, atRisk: 15, missed: 5  },
  { label: "Wed", done: 95,  atRisk: 40, missed: 15 }, // today — highlighted
  { label: "Thu", done: 0,   atRisk: 0,  missed: 0  },
  { label: "Fri", done: 0,   atRisk: 0,  missed: 0  },
  { label: "Sat", done: 0,   atRisk: 0,  missed: 0  },
  { label: "Sun", done: 0,   atRisk: 0,  missed: 0  },
];

const MAX_VAL = 160; // chart ceiling for scaling bars

// Colours matching Figma
const COLORS = {
  done:   "#00C48C",
  atRisk: "#F59E0B",
  missed: "#EF4444",
};

// ── Bar renderer ──────────────────────────────────────────────────────────────
function Bar({ done, atRisk, missed, label, today }: {
  done: number; atRisk: number; missed: number; label: string; today: boolean;
}) {
  const toH = (v: number) => `${(v / MAX_VAL) * 100}%`;

  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      {/* Stacked bars container — fixed height */}
      <div className="relative w-7 h-[90px] flex flex-col justify-end gap-px">
        {done > 0   && <div style={{ height: toH(done),   backgroundColor: COLORS.done   }} className="rounded-t-sm w-full" />}
        {atRisk > 0 && <div style={{ height: toH(atRisk), backgroundColor: COLORS.atRisk }} className="w-full" />}
        {missed > 0 && <div style={{ height: toH(missed), backgroundColor: COLORS.missed }} className="rounded-b-sm w-full" />}
        {done === 0 && atRisk === 0 && missed === 0 && (
          /* empty future days — faint placeholder */
          <div className="w-full h-1 bg-[#E4E5EA] rounded-full" />
        )}
      </div>

      {/* Day label — today gets accent colour */}
      <span className={`text-[10px] font-semibold ${today ? "text-[#00C48C]" : "text-[#A0A3B1]"}`}>
        {label}
      </span>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function WeeklyActivity() {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-[#111318]">Weekly Activity</h2>
        {/* Legend */}
        <div className="flex items-center gap-3">
          {Object.entries(COLORS).map(([key, hex]) => (
            <div key={key} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hex }} />
              <span className="text-[10px] text-[#A0A3B1] capitalize">{key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-1">
        {days.map((d, i) => (
          <Bar key={d.label} {...d} today={i === 2} />
        ))}
      </div>

    </div>
  );
}
