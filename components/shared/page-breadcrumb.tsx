import React from "react";
import { PageBreadcrumbProps } from "types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui";

function PageBreadcrumb({
  currentPage,
  previousPage,
  icon: Icon,
}: PageBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-1.5 text-[13px] text-cf-ink-60 sm:gap-2">
        <BreadcrumbItem>
          <span className="flex size-7 items-center justify-center rounded-md bg-cf-surface-muted text-cf-ink-80">
            <Icon className="size-3.5" />
          </span>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-cf-ink-40 [&>svg]:size-3" />
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className="capitalize text-cf-ink-60 hover:text-cf-ink"
          >
            {previousPage?.replace(/^\//, "") || "dashboard"}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-cf-ink-40 [&>svg]:size-3" />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium capitalize text-cf-ink">
            {currentPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default PageBreadcrumb;
