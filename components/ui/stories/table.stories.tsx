import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  FilterIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Checkbox,
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from 'ui-components'
import { cn } from 'lib'
import * as React from "react"

const meta = {
  title: "UI/Table",
  component: Table,
  parameters: { controls: { expanded: true } },
  args: { variant: "data" },
  argTypes: {
    variant: { control: "select", options: ["data", "minimal"] },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_STYLES: Record<string, string> = {
  Completed: "bg-primary/10 text-primary",
  "In progress": "bg-blue-100 text-blue-700",
  Missed: "bg-red-100 text-red-600",
  Scheduled: "bg-slate-100 text-slate-600",
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", STATUS_STYLES[label] ?? "bg-muted text-muted-foreground")}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  )
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span className={cn("inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white", color)}>
      {initials}
    </span>
  )
}

function TaskProgress({ done, total, color = "bg-primary" }: { done: number; total: number; color?: string }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{done}/{total}</span>
    </div>
  )
}

function PaginationBar({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  const pages = [1, 2, 3, null, total] as (number | null)[]
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1} className="flex size-7 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted disabled:opacity-40">
        <ChevronLeftIcon className="size-3.5" />
      </button>
      {pages.map((p, i) =>
        p === null ? (
          <span key={`ellipsis-${i}`} className="px-1 text-xs text-muted-foreground">...</span>
        ) : (
          <button key={p} onClick={() => onChange(p)} className={cn("flex size-7 items-center justify-center rounded-md border text-xs font-medium transition-colors", current === p ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted text-foreground")}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total} className="flex size-7 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted disabled:opacity-40">
        <ChevronRightIcon className="size-3.5" />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dataset
// ---------------------------------------------------------------------------
const VISITS = [
  { id: "1", patient: "Margaret Johnson", type: "Personal care", age: 76, carerInitials: "SW", carerColor: "bg-teal-500", carerName: "Sarah Williams", time: "08:00 – 08:30", status: "Completed", duration: "32m", tasksDone: 8, tasksTotal: 8, taskColor: "bg-primary", patientInitials: "MJ", patientColor: "bg-primary" },
  { id: "2", patient: "Robert Ahmed", type: "Medication + meal", age: 82, carerInitials: "PP", carerColor: "bg-violet-500", carerName: "Priya Patel", time: "09:00 – 10:00", status: "In progress", duration: "42m", tasksDone: 5, tasksTotal: 7, taskColor: "bg-blue-500", patientInitials: "RA", patientColor: "bg-orange-400" },
  { id: "3", patient: "Dorothy Chen", type: "Personal care", age: 9, carerInitials: "JO", carerColor: "bg-emerald-500", carerName: "James Okafor", time: "08:30 – 09:00", status: "Missed", duration: "—", tasksDone: 0, tasksTotal: 0, taskColor: "bg-muted", patientInitials: "DC", patientColor: "bg-rose-400" },
  { id: "4", patient: "Barbara Williams", type: "Dementia support", age: 75, carerInitials: "FK", carerColor: "bg-amber-500", carerName: "Fatima Khan", time: "10:00 – 11:00", status: "Scheduled", duration: "60m", tasksDone: 0, tasksTotal: 0, taskColor: "bg-muted", patientInitials: "BW", patientColor: "bg-indigo-400" },
]

// ---------------------------------------------------------------------------
// Full-featured table story
// ---------------------------------------------------------------------------
function FullFeaturedTable() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [search, setSearch] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)

  const allIds = VISITS.map((v) => v.id)
  const allSelected = selected.size === allIds.length
  const someSelected = selected.size > 0 && !allSelected

  function toggleAll() { setSelected(allSelected ? new Set() : new Set(allIds)) }
  function toggleRow(id: string) {
    setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  const filtered = VISITS.filter((v) => v.patient.toLowerCase().includes(search.toLowerCase()) || v.carerName.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col gap-0 rounded-xl border bg-background overflow-hidden">
      <div className="border-b bg-muted/30 px-4 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Full-featured table</span>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input size="sm" placeholder="Search visits..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-7 w-44" />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <FilterIcon className="size-3.5" />
            Filters
            <span className="inline-flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">3</span>
          </Button>
          <Button variant="outline" size="sm">Status: All ▾</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><DownloadIcon className="size-3.5" />Export</Button>
          <Button size="sm"><PlusIcon className="size-3.5" />New visit</Button>
        </div>
      </div>
      <Table variant="data" className="rounded-none ring-0">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 pl-4 pr-2">
              <Checkbox checked={allSelected} indeterminate={someSelected} onCheckedChange={toggleAll} aria-label="Select all" />
            </TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Carer</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((row) => (
            <TableRow key={row.id} data-state={selected.has(row.id) ? "selected" : undefined}>
              <TableCell className="pl-4 pr-2">
                <Checkbox checked={selected.has(row.id)} onCheckedChange={() => toggleRow(row.id)} aria-label={`Select ${row.patient}`} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar initials={row.patientInitials} color={row.patientColor} />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-foreground">{row.patient}</span>
                    <span className="text-[11px] text-muted-foreground">{row.type} · {row.age}y</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Avatar initials={row.carerInitials} color={row.carerColor} />
                  <span className="text-[13px]">{row.carerName}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-[12px] tabular-nums">{row.time}</TableCell>
              <TableCell><StatusBadge label={row.status} /></TableCell>
              <TableCell className="text-[13px]">{row.duration}</TableCell>
              <TableCell>
                {row.tasksTotal > 0 ? (
                  <TaskProgress done={row.tasksDone} total={row.tasksTotal} color={row.taskColor} />
                ) : (
                  <span className="text-xs text-muted-foreground">Not started</span>
                )}
              </TableCell>
              <TableCell className="pr-4">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Row actions" />}>
                    <MoreHorizontalIcon className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t px-4 py-3">
        <span className="text-xs text-muted-foreground">Showing 1–4 of 127 visits</span>
        <PaginationBar current={currentPage} total={32} onChange={setCurrentPage} />
      </div>
    </div>
  )
}

export const FullFeatured: Story = {
  name: "Full-Featured Table",
  render: () => <FullFeaturedTable />,
}
