'use client'

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Bell, Moon, Sun } from "lucide-react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 rounded-lg border border-cf-border text-cf-ink-60 hover:bg-cf-surface-muted hover:text-cf-ink"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      disabled={!mounted}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

function DashboardShellActions() {
  return (
    <div className="flex items-center gap-1.5">
      <ThemeToggle />
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="relative size-8 rounded-lg border border-cf-border text-cf-ink-60 hover:bg-cf-surface-muted hover:text-cf-ink"
            >
              <Bell className="size-4" />
              <span className="sr-only">Notifications</span>
            </Button>
          }
        />
        <PopoverContent
          className="w-80 border-cf-border bg-cf-surface p-0"
          align="end"
        >
          <div className="border-b border-cf-border px-4 py-3">
            <h4 className="text-sm font-semibold text-cf-ink">Notifications</h4>
            <p className="mt-0.5 text-xs text-cf-ink-60">
              You have no new notifications.
            </p>
          </div>
          <div className="px-4 py-6 text-center text-xs text-cf-ink-40">
            You&apos;re all caught up
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DashboardShellActions;