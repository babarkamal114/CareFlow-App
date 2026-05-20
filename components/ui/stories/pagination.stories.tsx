import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { HomeIcon } from "lucide-react"
import * as React from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "ui-components"

const meta = {
  title: "UI/Pagination",
  component: Pagination,
  parameters: { controls: { expanded: true } },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <Pagination className="justify-start">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

export const BreadcrumbsAndPagination: Story = {
  name: "Breadcrumbs & Pagination",
  render: () => {
    const [page, setPage] = React.useState(2)
    const total = 32
    const pages = [1, 2, 3, null, total] as (number | null)[]

    return (
      <div className="grid grid-cols-2 gap-4">
        {/* Breadcrumbs */}
        <div className="rounded-xl border bg-background p-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Breadcrumbs
          </p>
          <div className="flex flex-col gap-3">
            {/* Text breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Patients</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Margaret Johnson</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Icon breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="flex items-center gap-1">
                    <HomeIcon className="size-3.5" />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Scheduling</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Week 14</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Wednesday</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Pagination */}
        <div className="rounded-xl border bg-background p-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Pagination
          </p>
          <div className="flex flex-col gap-4">
            {/* Number pagination */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex size-7 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted disabled:opacity-40 text-xs"
              >
                ‹
              </button>
              {pages.map((p, i) =>
                p === null ? (
                  <span key={`e-${i}`} className="px-1 text-xs text-muted-foreground">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex size-7 items-center justify-center rounded-md border text-xs font-medium transition-colors ${
                      page === p
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setPage((p) => Math.min(total, p + 1))}
                disabled={page === total}
                className="flex size-7 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted disabled:opacity-40 text-xs"
              >
                ›
              </button>
            </div>

            {/* Prev / Page X of Y / Next */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 rounded-md border px-2.5 py-1 hover:bg-muted"
              >
                ‹ Previous
              </button>
              <span className="flex-1 text-center">
                Page <strong>{page}</strong> of <strong>{total}</strong>
              </span>
              <button
                onClick={() => setPage((p) => Math.min(total, p + 1))}
                className="flex items-center gap-1 rounded-md border px-2.5 py-1 hover:bg-muted"
              >
                Next ›
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  },
}
