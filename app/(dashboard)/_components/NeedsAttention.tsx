// app/(dashboard)/_components/NeedsAttention.tsx
// Needs Attention panel: flagged issues + On Shift Now carer avatars

// ── Data ──────────────────────────────────────────────────────────────────────
const issues = [
  { color:"bg-[#EF4444]", title:"Missed visit — Dorothy Chen",     sub:"James Dight · no check-in · 6:30 AM",  tag:null          },
  { color:"bg-[#F97316]", title:"Safeguarding concern filed",      sub:"Edna Morris · Personal abuse",          tag:null          },
  { color:"bg-[#3B82F6]", title:"3 care plans overdue",            sub:"R. Strand · B. Williams · H. Smith",    tag:"Today"       },
  { color:"bg-[#F59E0B]", title:"DBS expiring — Lucy Chen",        sub:"",                                       tag:"Today"       },
  { color:"bg-[#8B5CF6]", title:"AI Fluid Intake declining",       sub:"James Johnson · 40% below baseline",    tag:"Done"        },
];

// On-shift carer bubble colours
const shiftCarers = [
  { initials:"SW", color:"bg-[#6366F1]", label:"Sarah W." },
  { initials:"PP", color:"bg-[#3B82F6]", label:"Priya P." },
  { initials:"JO", color:"bg-[#10B981]", label:"James O." },
  { initials:"FK", color:"bg-[#EC4899]", label:"Fatima K." },
  { initials:"LC", color:"bg-[#F97316]", label:"Lucy C." },
];

// Tag colour helper
function Tag({ text }: { text: string }) {
  const map: Record<string, string> = {
    Today: "bg-[#FFF4EC] text-[#F97316]",
    Done:  "bg-[#E6FAF4] text-[#00A86B]",
  };
  return (
    <span className={`ml-auto shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[text] ?? ""}`}>
      {text}
    </span>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function NeedsAttention() {
  return (
    <div className="flex flex-col gap-4">

      {/* ── Needs Attention card ── */}
      <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F1F5]">
          <h2 className="text-sm font-bold text-[#111318]">Needs Attention</h2>
          {/* item count badge */}
          <span className="bg-[#EF4444] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {issues.length} items
          </span>
        </div>

        {/* Issue list */}
        <ul className="divide-y divide-[#F5F6FA]">
          {issues.map((issue) => (
            <li key={issue.title} className="flex items-start gap-3 px-5 py-3 hover:bg-[#FAFBFC] transition-colors cursor-pointer">
              {/* Colour dot */}
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${issue.color}`} />

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#111318] truncate">{issue.title}</p>
                {issue.sub && (
                  <p className="text-[11px] text-[#A0A3B1] truncate">{issue.sub}</p>
                )}
              </div>

              {issue.tag && <Tag text={issue.tag} />}
            </li>
          ))}
        </ul>
      </div>

      {/* ── On Shift Now card ── */}
      <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] px-5 py-4">

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#111318]">On Shift Now</h2>
          <span className="text-[11px] font-semibold text-[#00C48C]">23/31</span>
        </div>

        {/* Avatar grid */}
        <div className="flex flex-wrap gap-2">
          {shiftCarers.map((c) => (
            <div key={c.initials} className="flex items-center gap-1.5 bg-[#F5F6FA] rounded-full px-2.5 py-1">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${c.color}`}>
                {c.initials}
              </span>
              <span className="text-[11px] text-[#5C5F6A] font-medium">{c.label}</span>
            </div>
          ))}
          {/* +16 more pill */}
          <div className="flex items-center gap-1.5 bg-[#F5F6FA] rounded-full px-2.5 py-1">
            <span className="text-[11px] text-[#8B8FA8] font-medium">+16 more</span>
          </div>
        </div>

      </div>
    </div>
  );
}
