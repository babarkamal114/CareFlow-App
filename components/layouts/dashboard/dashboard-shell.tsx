'use client'

import type { ReactElement, ReactNode } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  DashboardShellActions,
  SidebarLogoSection,
  SidebarNavigationSection,
  SidebarProfileSection,
} from "sections";
import { PageBreadcrumb } from "shared";
import { usePageInfo } from "hooks";
import {
  filterNavItemsByRole,
  formatRoleName,
  isNavItemActive,
  navGroups,
} from "utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui";

export function DashboardShell({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  const session = useSession();

  const userInitials = session.data?.user.name.split(' ').map((n) => n[0]).join('') || '';
  const userFullName = session.data?.user.name || '';
  const userAvatarUrl = session.data?.user.image || '';

  const role = session?.data?.user.role;
  const isSessionLoading = session.status === "loading";
  const { currentPage, icon, previousPage, pathname } = usePageInfo();

  const filteredNavGroups = navGroups.map((group) => ({
    ...group,
    items: (isSessionLoading ? group.items : filterNavItemsByRole(group.items, role ?? ""))
      .map((item) => ({
        ...item,
        isActive: isNavItemActive(item.href, pathname),
      })),
  }));

  return (
  <SidebarProvider className="cf-dashboard-bg relative bg-transparent">
    <div
      aria-hidden
      className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "var(--cf-dashboard-bg-image)" }}
    />

    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarLogoSection />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigationSection groups={filteredNavGroups} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarProfileSection
          avatarUrl={userAvatarUrl}
          initials={userInitials}
          name={userFullName}
          role={formatRoleName(role!)}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>

    <SidebarInset className="min-w-0 overflow-hidden bg-transparent">
      <main className="flex h-svh flex-col bg-transparent overflow-y-auto">
        <header className="flex h-16 shrink-0 items-center gap-2 px-3 sm:gap-4 sm:px-4 md:px-6">
          <SidebarTrigger className="size-9 shrink-0 rounded-lg border border-cf-border/40 bg-transparent text-cf-ink-60 shadow-none hover:bg-cf-surface-muted/50 hover:text-cf-ink md:size-8" />
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-cf-ink-40" />
            <input
              type="search"
              placeholder="Search patients, staff, visits..."
              className="h-9 w-full truncate rounded-full border border-cf-border/60 bg-cf-surface/70 pl-9 pr-3 text-base text-cf-ink placeholder:text-cf-ink-40 outline-none transition-colors focus:border-brand-300 focus:bg-cf-surface sm:text-sm"
            />
          </div>
          <div className="ml-auto shrink-0">
            <DashboardShellActions />
          </div>
        </header>
        <div className="min-h-0 min-w-0 flex-1 bg-transparent p-3 sm:p-4 md:p-6">
          {children}
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
);
}