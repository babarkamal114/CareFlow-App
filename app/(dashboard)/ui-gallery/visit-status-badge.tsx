import type { ReactElement } from "react"

import { Badge } from @/components/ui

import type { VisitStatus } from "./gallery-data"

export function visitStatusBadge(status: VisitStatus): ReactElement {
  switch (status) {
    case "completed":
      return (
        <Badge variant="softSuccess" dot>
          Completed
        </Badge>
      )
    case "in_progress":
      return (
        <Badge variant="softInfo" dot>
          In progress
        </Badge>
      )
    case "missed":
      return (
        <Badge variant="softDanger" dot>
          Missed
        </Badge>
      )
    case "scheduled":
      return (
        <Badge variant="softMuted" dot>
          Scheduled
        </Badge>
      )
  }
}
