// components/ui/stories/dashboard-charts.stories.tsx
// Stories for: WeeklyActivity · CQCBreakdown · ComplianceDue · RevenuePanel · VisitTrend

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ArrowUpRight, BadgeCheck, ClipboardList, FileText, ShieldAlert } from "lucide-react"

// ===========================================================================
// WEEKLY ACTIVITY
// ===========================================================================
const WEEK_DATA = [
  { label:"Mon", done:110, atRisk:20, missed:8  },
  { label:"Tue", done:130, atRisk:15, missed:5  },
  { label:"Wed", done:95,  atRisk:40, missed:15 }, // today
  { label:"Thu", done:0,   atRisk:0,  missed:0  },
  { label:"Fri", done:0,   atRisk:0,  missed:0  },
  { label:"Sat", done:0,   atRisk:0,  missed:0  },
  { label:"Sun", done:0,   atRisk:0,  missed:0  },
]
const MAX_VAL = 160
const BAR_COLORS = { done:"#00C48C", atRisk:"#F59E0B", missed:"#EF4444" }

function Bar({ done, atRisk, missed, label, today }: { done:number; atRisk:number; missed:number; label:string; today:boolean }) {
  const toH = (v: number) => `${(v / MAX_VAL) * 100}%`
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="relative w-7 h-[90px] flex flex-col justify-end gap-px">
        {done   > 0 && <div style={{ height:toH(done),   backgroundColor:BAR_COLORS.done   }} className="rounded-t-sm w-full" />}
        {atRisk > 0 && <div style={{ height:toH(atRisk), backgroundColor:BAR_COLORS.atRisk }} className="w-full" />}
        {missed > 0 && <div style={{ height:toH(missed), backgroundColor:BAR_COLORS.missed }} className="rounded-b-sm w-full" />}
        {done === 0 && atRisk === 0 && missed === 0 && <div className="w-full h-1 bg-[#E4E5EA] rounded-full" />}
      </div>
      <span className={`text-[10px] font-semibold ${today ? "text-[#00C48C]" : "text-[#A0A3B1]"}`}>{label}</span>
    </div>
  )
}

function WeeklyActivityCard() {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-[#111318]">Weekly Activity</h2>
        <div className="flex items-center gap-3">
          {Object.entries(BAR_COLORS).map(([key, hex]) => (
            <div key={key} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor:hex }} />
              <span className="text-[10px] text-[#A0A3B1] capitalize">{key}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-1">
        {WEEK_DATA.map((d, i) => <Bar key={d.label} {...d} today={i === 2} />)}
      </div>
    </div>
  )
}

// ===========================================================================
// CQC BREAKDOWN
// ===========================================================================
const CQC_DOMAINS = [
  { label:"Safe",       score:80, color:"#00C48C" },
  { label:"Effective",  score:85, color:"#00C48C" },
  { label:"Caring",     score:92, color:"#00C48C" },
  { label:"Responsive", score:62, color:"#F59E0B" },
  { label:"Well-led",   score:88, color:"#00C48C" },
]

function CQCBreakdownCard({ domains = CQC_DOMAINS }: { domains?: typeof CQC_DOMAINS }) {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111318]">CQC Breakdown</h2>
        <button className="text-xs font-semibold text-[#00C48C] hover:underline">Details</button>
      </div>
      <div className="space-y-3.5">
        {domains.map((d) => (
          <div key={d.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#5C5F6A]">{d.label}</span>
              <span className="text-xs font-semibold text-[#111318]">{d.score}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#F0F1F5] overflow-hidden">
              <div className="h-full rounded-full" style={{ width:`${d.score}%`, backgroundColor:d.color }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-[#A0A3B1] mt-auto">
        Overall: <span className="font-semibold text-[#111318]">87/100</span> · +4 this month
      </p>
    </div>
  )
}

// ===========================================================================
// COMPLIANCE DUE
// ===========================================================================
const COMPLIANCE_ITEMS = [
  { icon:<ShieldAlert size={14}/>, iconBg:"bg-[#FEE2E2] text-[#EF4444]", title:"Safeguarding training", sub:"Mark Child · Updated 28 ago",  urgency:"overdue", label:"Overdue" },
  { icon:<BadgeCheck  size={14}/>, iconBg:"bg-[#FFF4EC] text-[#F97316]", title:"DBS renewal",           sub:"Lucy Chen · 14 days",           urgency:"soon",    label:"14 days" },
  { icon:<FileText    size={14}/>, iconBg:"bg-[#EFF6FF] text-[#3B82F6]", title:"Care plan reviews",     sub:"3 patients · Due by 10 Apr",    urgency:"due",     label:"Due"     },
  { icon:<ClipboardList size={14}/>, iconBg:"bg-[#F5F3FF] text-[#7C3AED]", title:"Supervisions due",    sub:"5 staff · By 15 April",         urgency:"due",     label:"Due"     },
]
const URGENCY_STYLES: Record<string, string> = {
  overdue:"bg-[#FEE2E2] text-[#EF4444]",
  soon:   "bg-[#FFF4EC] text-[#F97316]",
  due:    "bg-[#EFF6FF] text-[#2563EB]",
}

function ComplianceDueCard() {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111318]">Compliance Due</h2>
        <span className="text-[10px] text-[#A0A3B1]">Next 14 days</span>
      </div>
      <div className="space-y-3">
        {COMPLIANCE_ITEMS.map((item) => (
          <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg bg-[#FAFBFC] hover:bg-[#F5F6FA] transition-colors cursor-pointer">
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}>{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#111318] truncate">{item.title}</p>
              <p className="text-[11px] text-[#A0A3B1] truncate">{item.sub}</p>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${URGENCY_STYLES[item.urgency]}`}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===========================================================================
// REVENUE PANEL
// ===========================================================================
const REVENUE_STATS = [
  { label:"INVOICED",    value:"£42,380", change:"+8.2% vs March",        changeOk:true,  bg:"bg-white"        },
  { label:"COLLECTED",   value:"£34,150", change:"80.6% collection rate", changeOk:true,  bg:"bg-[#F0FDF8]"    },
  { label:"OUTSTANDING", value:"£8,230",  change:"3 invoices overdue",    changeOk:false, bg:"bg-[#FFF4EC]"    },
  { label:"PAYROLL DUE", value:"£28,400", change:"Next run: 15 April",    changeOk:null,  bg:"bg-[#F5F3FF]"    },
]

function RevenuePanelCard() {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111318]">Revenue — April</h2>
        <button className="flex items-center gap-1 text-xs font-semibold text-[#00C48C] hover:underline">
          View Finance <ArrowUpRight size={12} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {REVENUE_STATS.map((s) => {
          const cc = s.changeOk === true ? "text-[#00A86B]" : s.changeOk === false ? "text-[#EF4444]" : "text-[#8B8FA8]"
          return (
            <div key={s.label} className={`rounded-xl p-4 flex flex-col gap-1 border border-[#E4E5EA] ${s.bg}`}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A0A3B1]">{s.label}</p>
              <p className="text-xl font-extrabold text-[#111318]">{s.value}</p>
              <p className={`text-[11px] font-medium ${cc}`}>{s.change}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ===========================================================================
// VISIT TREND (SVG area chart)
// ===========================================================================
const TREND_DATA: [number, number][] = [
  [85,90],[88,92],[82,88],[90,95],[87,91],[92,96],[95,98],
  [88,93],[91,95],[94,99],[90,94],[93,97],[96,100],[98,102],
  [94,99],[97,101],[100,105],[96,101],[99,104],[102,107],
  [98,103],[101,106],[104,110],[100,105],[103,108],[106,112],
  [102,107],[105,110],[108,114],[110,116],
]
const SVG_W = 400, SVG_H = 100, PAD = 8
function sy(v: number, min: number, max: number) { return PAD + (1 - (v - min) / (max - min)) * (SVG_H - PAD * 2) }
function buildPath(vals: number[], min: number, max: number, fill?: boolean) {
  const pts = vals.map((v, i) => `${PAD + (i / (vals.length - 1)) * (SVG_W - PAD * 2)},${sy(v, min, max)}`)
  const line = `M ${pts.join(" L ")}`
  return fill ? `${line} L ${PAD + SVG_W - PAD * 2},${SVG_H - PAD} L ${PAD},${SVG_H - PAD} Z` : line
}

function VisitTrendCard() {
  const completed = TREND_DATA.map(d => d[0])
  const scheduled = TREND_DATA.map(d => d[1])
  const all = [...completed, ...scheduled]
  const min = Math.min(...all) - 5, max = Math.max(...all) + 5
  const lastX = PAD + SVG_W - PAD * 2
  const lastY = sy(completed[completed.length - 1], min, max)
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111318]">Visit Trend — 30 Days</h2>
        <div className="flex items-center gap-3">
          {[["#00C48C","Completed"],["#A0A3B1","Scheduled"]].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor:c }} />
              <span className="text-[10px] text-[#A0A3B1]">{l}</span>
            </div>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" preserveAspectRatio="none" style={{ height:110 }}>
        <defs>
          <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#00C48C" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#00C48C" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#A0A3B1" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#A0A3B1" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={buildPath(scheduled, min, max, true)}  fill="url(#gs)" />
        <path d={buildPath(scheduled, min, max, false)} fill="none" stroke="#A0A3B1" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d={buildPath(completed, min, max, true)}  fill="url(#gc)" />
        <path d={buildPath(completed, min, max, false)} fill="none" stroke="#00C48C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={lastX} cy={lastY} r="4" fill="#00C48C" stroke="white" strokeWidth="1.5" />
      </svg>
      <div className="flex justify-between -mt-2">
        {["Apr 1","Apr 10","Apr 20","Apr 30"].map((l) => (
          <span key={l} className="text-[10px] text-[#A0A3B1]">{l}</span>
        ))}
      </div>
    </div>
  )
}

// ===========================================================================
// Meta & Stories
// ===========================================================================
const meta = {
  title: "Dashboard/Charts & Panels",
  parameters: { controls: { expanded: true } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const WeeklyActivity: Story = {
  name: "Weekly Activity",
  render: () => <div className="p-6 bg-[#F5F6FA] w-[320px]"><WeeklyActivityCard /></div>,
}

export const CQCBreakdown: Story = {
  name: "CQC Breakdown",
  render: () => <div className="p-6 bg-[#F5F6FA] w-[320px]"><CQCBreakdownCard /></div>,
}

export const CQCLowScores: Story = {
  name: "CQC Breakdown — Low Scores",
  render: () => (
    <div className="p-6 bg-[#F5F6FA] w-[320px]">
      <CQCBreakdownCard domains={CQC_DOMAINS.map(d => ({ ...d, score: Math.max(20, d.score - 40), color:"#EF4444" }))} />
    </div>
  ),
}

export const ComplianceDue: Story = {
  name: "Compliance Due",
  render: () => <div className="p-6 bg-[#F5F6FA] w-[320px]"><ComplianceDueCard /></div>,
}

export const RevenuePanel: Story = {
  name: "Revenue Panel",
  render: () => <div className="p-6 bg-[#F5F6FA] w-[480px]"><RevenuePanelCard /></div>,
}

export const VisitTrend: Story = {
  name: "Visit Trend (30 Days)",
  render: () => <div className="p-6 bg-[#F5F6FA] w-[480px]"><VisitTrendCard /></div>,
}
