// app/(dashboard)/_components/DashboardHeader.tsx
// Top header bar: page title, date/agency, search, notifications, CTA button

import { Bell, Search, Plus } from "lucide-react";

export default function DashboardHeader() {
  // Static date matching the Figma; in production replace with dynamic Date()
  const dateStr = "Wednesday, 2 April 2026";
  const agency  = "Sunrise Care Agency";

  return (
    <div className="flex items-center justify-between gap-4">

      {/* ── Left: Page title + subtitle ── */}
      <div>
        <h1 className="text-[22px] font-bold text-[#111318] leading-tight">
          Dashboard
        </h1>
        <p className="text-xs text-[#8B8FA8] mt-0.5">
          {dateStr}{"\u00a0"}•{"\u00a0"}{agency}
        </p>
      </div>

      {/* ── Right: search + bell + new visit ── */}
      <div className="flex items-center gap-3">

        {/* Search input */}
        <div className="relative hidden sm:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A3B1]"
          />
          <input
            type="text"
            placeholder="Search patients, carers…"
            className="
              pl-9 pr-4 py-2 text-sm rounded-lg border border-[#E4E5EA]
              bg-white text-[#111318] placeholder:text-[#A0A3B1]
              focus:outline-none focus:ring-2 focus:ring-[#00C48C]/30
              w-56
            "
          />
        </div>

        {/* Notification bell */}
        <button className="
          relative w-9 h-9 flex items-center justify-center
          rounded-lg border border-[#E4E5EA] bg-white
          hover:bg-[#F5F6FA] transition-colors
        ">
          <Bell size={16} className="text-[#5C5F6A]" />
          {/* unread dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F97316]" />
        </button>

        {/* + New Visit CTA */}
        <button className="
          flex items-center gap-1.5 px-4 py-2 rounded-lg
          bg-[#00C48C] hover:bg-[#00B07E] text-white text-sm font-semibold
          transition-colors shadow-sm
        ">
          <Plus size={15} strokeWidth={2.5} />
          New Visit
        </button>

      </div>
    </div>
  );
}
