// components/ui/stories/dashboard-attention.stories.tsx
// Stories for NeedsAttention panel and OnShiftNow section

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

// ---------------------------------------------------------------------------
// Data & sub-components
// ---------------------------------------------------------------------------
const ALL_ISSUES = [
  { color:"bg-[#EF4444]", title:"Missed visit — Dorothy Chen",  sub:"James Dight · no check-in · 6:30 AM", tag: null    },
  { color:"bg-[#F97316]", title:"Safeguarding concern filed",   sub:"Edna Morris · Personal abuse",         tag: null    },
  { color:"bg-[#3B82F6]", title:"3 care plans overdue",         sub:"R. Strand · B. Williams · H. Smith",   tag:"Today"  },
  { color:"bg-[#F59E0B]", title:"DBS expiring — Lucy Chen",     sub:"",                                      tag:"Today"  },
  { color:"bg-[#8B5CF6]", title:"AI Fluid Intake declining",    sub:"James Johnson · 40% below baseline",   tag:"Done"   },
]

const SHIFT_CARERS = [
  { initials:"SW", color:"bg-[#6366F1]", label:"Sarah W."  },
  { initials:"PP", color:"bg-[#3B82F6]", label:"Priya P."  },
  { initials:"JO", color:"bg-[#10B981]", label:"James O."  },
  { initials:"FK", color:"bg-[#EC4899]", label:"Fatima K." },
  { initials:"LC", color:"bg-[#F97316]", label:"Lucy C."   },
]

const TAG_STYLES: Record<string, string> = {
  Today: "bg-[#FFF4EC] text-[#F97316]",
  Done:  "bg-[#E6FAF4] text-[#00A86B]",
}

// Needs Attention card
function NeedsAttentionCard({ issues = ALL_ISSUES }: { issues?: typeof ALL_ISSUES }) {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F1F5]">
        <h2 className="text-sm font-bold text-[#111318]">Needs Attention</h2>
        <span className="bg-[#EF4444] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {issues.length} items
        </span>
      </div>
      <ul className="divide-y divide-[#F5F6FA]">
        {issues.map((issue) => (
          <li key={issue.title} className="flex items-start gap-3 px-5 py-3 hover:bg-[#FAFBFC] transition-colors cursor-pointer">
            <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${issue.color}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#111318] truncate">{issue.title}</p>
              {issue.sub && <p className="text-[11px] text-[#A0A3B1] truncate">{issue.sub}</p>}
            </div>
            {issue.tag && (
              <span className={`ml-auto shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${TAG_STYLES[issue.tag]}`}>
                {issue.tag}
              </span>
            )}
          </li>
        ))}
        {issues.length === 0 && (
          <li className="px-5 py-6 text-center text-xs text-[#A0A3B1]">
            No items need attention right now 🎉
          </li>
        )}
      </ul>
    </div>
  )
}

// On Shift Now card
function OnShiftNowCard() {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-[#111318]">On Shift Now</h2>
        <span className="text-[11px] font-semibold text-[#00C48C]">23/31</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SHIFT_CARERS.map((c) => (
          <div key={c.initials} className="flex items-center gap-1.5 bg-[#F5F6FA] rounded-full px-2.5 py-1">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${c.color}`}>
              {c.initials}
            </span>
            <span className="text-[11px] text-[#5C5F6A] font-medium">{c.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 bg-[#F5F6FA] rounded-full px-2.5 py-1">
          <span className="text-[11px] text-[#8B8FA8] font-medium">+16 more</span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------
const meta = {
  title: "Dashboard/Needs Attention",
  parameters: { controls: { expanded: true } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Full panel as it appears on the dashboard — all 5 items */
export const Playground: Story = {
  render: () => (
    <div className="p-6 bg-[#F5F6FA] w-[360px] space-y-4">
      <NeedsAttentionCard />
      <OnShiftNowCard />
    </div>
  ),
}

/** Only critical (red) items — safeguarding + missed */
export const CriticalOnly: Story = {
  name: "Critical Items Only",
  render: () => (
    <div className="p-6 bg-[#F5F6FA] w-[360px]">
      <NeedsAttentionCard issues={ALL_ISSUES.filter((i) => i.color === "bg-[#EF4444]")} />
    </div>
  ),
}

/** Nothing flagged — empty state */
export const AllClear: Story = {
  name: "All Clear (Empty State)",
  render: () => (
    <div className="p-6 bg-[#F5F6FA] w-[360px]">
      <NeedsAttentionCard issues={[]} />
    </div>
  ),
}

/** On Shift Now in isolation */
export const OnShiftNow: Story = {
  name: "On Shift Now",
  render: () => (
    <div className="p-6 bg-[#F5F6FA] w-[360px]">
      <OnShiftNowCard />
    </div>
  ),
}
