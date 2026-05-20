"use client";
// features/patients/components/risk-distribution.tsx
// Bottom-left panel: SVG donut chart + Low/Medium/High legend

import { motion } from "framer-motion";

const TOTAL = 142;

// Pure SVG donut — no chart library needed
function DonutChart() {
  const cx = 60, cy = 60, r = 44, sw = 18;
  const circ = 2 * Math.PI * r;
  const gap = 2;

  const lowDash  = circ * 0.627 - gap;
  const medDash  = circ * 0.317 - gap;
  const highDash = circ * 0.056 - gap;

  // strokeDashoffset rotates starting position (top = circ * 0.25)
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {/* Low — emerald */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#10B981" strokeWidth={sw}
        strokeDasharray={`${lowDash} ${circ}`}
        strokeDashoffset={circ * 0.25} />
      {/* Medium — amber */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F59E0B" strokeWidth={sw}
        strokeDasharray={`${medDash} ${circ}`}
        strokeDashoffset={circ * 0.25 - (circ * 0.627)} />
      {/* High — red */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EF4444" strokeWidth={sw}
        strokeDasharray={`${highDash} ${circ}`}
        strokeDashoffset={circ * 0.25 - (circ * 0.627) - (circ * 0.317)} />
      {/* Center label */}
      <text x={cx} y={cy - 4}  textAnchor="middle" fontSize="14" fontWeight="700" fill="#1A1D2E">{TOTAL}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9"             fill="#8B8FA8">patients</text>
    </svg>
  );
}

export function RiskDistribution() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-xl border border-[#E4E5EA] p-4 flex-1"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-[#1A1D2E]">Risk Distribution</h3>
        <span className="text-[11px] text-[#8B8FA8]">{TOTAL} patients</span>
      </div>

      <div className="flex items-center gap-5">
        <DonutChart />

        {/* Legend */}
        <div className="flex flex-col gap-3 flex-1">
          {[
            { label: "Low Risk",    count: 89,  pct: "62.7%", color: "bg-emerald-500" },
            { label: "Medium Risk", count: 45,  pct: "31.7%", color: "bg-amber-400"   },
            { label: "High Risk",   count: 8,   pct: "5.6%",  color: "bg-red-500"     },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`} />
              <span className="text-[12px] text-[#4A4D63] flex-1">{item.label}</span>
              <span className="text-[12px] font-semibold text-[#1A1D2E] w-6 text-right">{item.count}</span>
              <span className="text-[11px] text-[#8B8FA8] w-10 text-right">{item.pct}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
