'use client'

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Bell, Moon, Sun } from "lucide-react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";

import { useNotifications } from "hooks";
import { formatRelativeTime } from "utils";

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

function NotificationsBell() {
  const { data, isLoading, error, refetch } = useNotifications();

  const unreadCount = data?.unreadCount ?? 0;
  const items = data?.items ?? [];

  let subtitle = "You have no new notifications.";
  if (isLoading) subtitle = "Loading...";
  else if (error) subtitle = "Couldn't load notifications.";
  else if (unreadCount > 0)
    subtitle = `You have ${unreadCount} new notification${unreadCount === 1 ? "" : "s"}.`;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative size-8 rounded-lg border border-cf-border text-cf-ink-60 hover:bg-cf-surface-muted hover:text-cf-ink"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500" />
            )}
            <span className="sr-only">
              Notifications{unreadCount > 0 ? ` (${unreadCount} unread)` : ""}
            </span>
          </Button>
        }
      />
      <PopoverContent
        className="w-80 border-cf-border bg-cf-surface p-0"
        align="end"
      >
        <div className="border-b border-cf-border px-4 py-3">
          <h4 className="text-sm font-semibold text-cf-ink">Notifications</h4>
          <p className="mt-0.5 text-xs text-cf-ink-60">{subtitle}</p>
        </div>

        {error && (
          <div className="px-4 py-6 text-center text-xs text-cf-ink-60">
            <button onClick={refetch} className="font-semibold text-cf-ink underline">
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="px-4 py-6 text-center text-xs text-cf-ink-40">
            You&apos;re all caught up
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <ul className="divide-y divide-cf-border max-h-80 overflow-y-auto">
            {items.map((n) => (
              <li key={n.id} className="flex items-start gap-2.5 px-4 py-2.5">
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${
                    n.read ? "bg-transparent" : "bg-red-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-cf-ink">{n.title}</p>
                  {n.body && <p className="text-xs text-cf-ink-60">{n.body}</p>}
                </div>
                <p className="shrink-0 text-xs text-cf-ink-40">
                  {formatRelativeTime(n.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}

function DashboardShellActions() {
  return (
    <div className="flex items-center gap-1.5">
      <ThemeToggle />
      <NotificationsBell />
    </div>
  );
}

export default DashboardShellActions;