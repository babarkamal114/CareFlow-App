"use client"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  ArrowRightIcon,
  CalendarPlusIcon,
  DownloadIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react"
import * as React from "react"
import { Avatar, AvatarFallback } from 'ui-components'

// ---------------------------------------------------------------------------
// Self-contained command palette UI (no cmdk dependency needed for stories)
// ---------------------------------------------------------------------------
const PATIENTS = [
  { initials: "MJ", bg: "bg-primary/15", t: "text-primary", name: "Margaret Johnson", sub: "Active · 78 years · ID #4821" },
  { initials: "MR", bg: "bg-orange-100", t: "text-orange-700", name: "Maria Rodriguez", sub: "Carer · On shift" },
]

const ACTIONS = [
  { icon: CalendarPlusIcon, label: "Create new visit", shortcut: "C" },
  { icon: DownloadIcon, label: "Export this week's report" },
  { icon: SettingsIcon, label: "Open settings" },
]

function CommandPaletteDemo() {
  const [query, setQuery] = React.useState("mar")
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const filteredPatients = PATIENTS.filter(
    (p) =>
      query === "" ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sub.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="rounded-xl border bg-background overflow-hidden">
      <div className="border-b bg-muted/30 px-4 py-2 flex justify-between items-center">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Global Search &amp; Actions
        </span>
        <span className="text-[10px] text-muted-foreground">
          Triggered with ⌘K from anywhere
        </span>
      </div>

      {/* Dark backdrop */}
      <div className="relative flex items-start justify-center bg-black/85 py-16 px-4">
        {/* Palette panel */}
        <div className="w-full max-w-sm rounded-xl border bg-background shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-2 border-b px-3 py-2.5">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
            <input
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search patients, actions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <kbd className="rounded border border-border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
              ESC
            </kbd>
          </div>

          <div className="max-h-72 overflow-y-auto py-2">
            {/* Patients section */}
            {filteredPatients.length > 0 && (
              <div>
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Patients
                </p>
                {filteredPatients.map((p, i) => (
                  <button
                    key={p.name}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                      selectedIndex === i ? "bg-accent" : "hover:bg-accent/50"
                    }`}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <Avatar size="xs" shape="round">
                      <AvatarFallback className={`${p.bg} ${p.t} text-[9px] font-bold`}>
                        {p.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{p.sub}</p>
                    </div>
                    {selectedIndex === i && (
                      <ArrowRightIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Actions section */}
            <div className="mt-2">
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Actions
              </p>
              {ACTIONS.map((a, i) => {
                const idx = filteredPatients.length + i
                return (
                  <button
                    key={a.label}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                      selectedIndex === idx ? "bg-accent" : "hover:bg-accent/50"
                    }`}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <span className="flex size-5 items-center justify-center rounded-md border bg-muted">
                      <a.icon className="size-3 text-muted-foreground" />
                    </span>
                    <span className="flex-1">{a.label}</span>
                    {a.shortcut && (
                      <kbd className="rounded border border-border bg-muted px-1 text-[10px] font-mono text-muted-foreground">
                        {a.shortcut}
                      </kbd>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer hints */}
          <div className="flex items-center justify-between border-t bg-muted/30 px-3 py-1.5">
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>ESC Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const meta = {
  title: "UI/Command Palette",
  parameters: { controls: { expanded: true } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const GlobalSearch: Story = {
  name: "Global Search & Actions",
  render: () => <CommandPaletteDemo />,
}
