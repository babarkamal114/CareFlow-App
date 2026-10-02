import type { ReactElement } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";

export function SidebarLogoSection(): ReactElement {
  return (
    <div className="flex items-center gap-3 px-1 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
      <Avatar
        size="lg"
        className="size-12 rounded-lg after:rounded-lg group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-md group-data-[collapsible=icon]:after:rounded-md"
      >
        <AvatarImage src="/logo.png" alt="CareFlow logo" className="object-cover" />
        <AvatarFallback className="bg-brand-300 text-cf-ink-80">CF</AvatarFallback>
      </Avatar>
      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
        <div className="font-heading text-[17px] font-extrabold tracking-[-0.02em] text-sidebar-foreground">
          CareFlow
        </div>
        <div className="text-[10.5px] font-medium tracking-[0.02em] text-muted-foreground">
          HOME CARE PLATFORM
        </div>
      </div>
    </div>
  );
}