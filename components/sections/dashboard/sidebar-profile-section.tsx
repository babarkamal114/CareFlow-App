"use client";

import type { ReactElement } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
} from "@/components/ui";
import { useAuthTokens } from "hooks";
import { useLogoutMutation } from "lib";
import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export interface SidebarProfileSectionProps {
  name: string;
  role: string;
  initials: string;
  avatarUrl: string;
}

export function SidebarProfileSection({
  name,
  role,
  initials,
  avatarUrl,
}: SidebarProfileSectionProps): ReactElement {
  const router = useRouter();
  const { refreshToken, accessToken } = useAuthTokens();
  const { mutateAsync } = useLogoutMutation();

  const handleLogout = async () => {
    try {
      if (!refreshToken || !accessToken) return;
      const data = await mutateAsync({ refreshToken, accessToken });
      if (data.success) {
        toast.success("Logged out successfully");
        signOut({ redirectTo: "/login" });
      }
    } catch {
      signOut({ redirectTo: "/login" });
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <div className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 transition-colors hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Avatar size="sm" className="shrink-0">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-medium text-sidebar-foreground">
              {name}
            </div>
            <div className="truncate text-xs text-muted-foreground">{role}</div>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 border-sidebar-border bg-sidebar p-1"
        side="top"
        align="start"
      >
        <div className="mb-1 border-b border-sidebar-border px-2 py-2">
          <p className="truncate text-sm font-medium leading-none">{name}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{role}</p>
        </div>
        <Button
          variant="ghost"
          className="h-8 w-full justify-start gap-2 px-2 text-sm font-normal"
          onClick={() => router.push("/profile")}
        >
          <User className="h-4 w-4" />
          Profile
        </Button>
        <Button
          variant="ghost"
          className="h-8 w-full justify-start gap-2 px-2 text-sm font-normal"
          onClick={() => router.push("/settings")}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="h-8 w-full justify-start gap-2 px-2 text-sm font-normal text-red-600 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </PopoverContent>
    </Popover>
  );
}
