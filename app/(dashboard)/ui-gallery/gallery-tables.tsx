import type { ReactElement } from "react"

import {
  Avatar,
  AvatarFallback,
  Badge,
  Checkbox,
  IconButton,
  Progress,
  ProgressIndicator,
  ProgressTrack,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from @/components/ui
import { MoreHorizontal } from "lucide-react"

import { galleryMedicationRows, galleryVisitRows } from "./gallery-data"
import { visitStatusBadge } from "./visit-status-badge"

export function GalleryTables(): ReactElement {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="font-heading text-lg font-bold">Tables</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          <code className="text-xs">variant=&quot;data&quot;</code> matches HTML{" "}
          <code className="text-xs">.data-table</code> (rounded header, row hover
          on cells).{" "}
          <code className="text-xs">variant=&quot;minimal&quot;</code> is a compact
          border-row layout for dense lists.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Data · visits roster</h3>
        <Table variant="data">
          <TableCaption className="text-left">
            Sample dataset: morning visits (checkbox + avatars + badges + inline
            progress).
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox aria-label="Select all" />
              </TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Carer</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {galleryVisitRows.map((row) => {
              const pct =
                row.tasksTotal > 0
                  ? Math.round((row.tasksDone / row.tasksTotal) * 100)
                  : 0
              return (
                <TableRow key={row.id}>
                  <TableCell className="w-10">
                    <Checkbox
                      defaultChecked={row.defaultSelected}
                      aria-label={`Select ${row.patient}`}
                    />
                  </TableCell>
                  <TableCell className="max-w-[220px] whitespace-normal">
                    <div className="flex items-center gap-2.5">
                      <Avatar shape="round" size="sm">
                        <AvatarFallback className={row.patientTone}>
                          {row.patientInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground">
                          {row.patient}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {row.patientMeta}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <div className="flex items-center gap-1.5">
                      <Avatar shape="round" size="xs">
                        <AvatarFallback className={row.carerTone}>
                          {row.carerInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span>{row.carer}</span>
                    </div>
                  </TableCell>
                  <TableCell>{row.window}</TableCell>
                  <TableCell>{visitStatusBadge(row.status)}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>
                    {row.tasksTotal > 0 ? (
                      <div className="flex items-center gap-2">
                        <Progress
                          value={pct}
                          trackSize="sm"
                          className="w-[60px] gap-0"
                        >
                          <ProgressTrack>
                            <ProgressIndicator
                              className={row.progressClass}
                            />
                          </ProgressTrack>
                        </Progress>
                        <span className="text-[11px] text-muted-foreground">
                          {row.tasksDone}/{row.tasksTotal}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Not started
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="w-12 text-right">
                    <IconButton
                      aria-label="Row actions"
                      variant="ghost"
                      size="sm"
                    >
                      <MoreHorizontal />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground">
          Showing <strong>1–4</strong> of <strong>127</strong> visits (mock).
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Minimal · medication review</h3>
        <Table variant="minimal" className="max-w-xl">
          <TableCaption className="text-left">
            MAR excerpt — different column set.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Strength</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Next</TableHead>
              <TableHead>Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {galleryMedicationRows.map((m) => (
              <TableRow key={m.name}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell>{m.strength}</TableCell>
                <TableCell className="text-muted-foreground">
                  {m.frequency}
                </TableCell>
                <TableCell>{m.nextDue}</TableCell>
                <TableCell>
                  {m.stock === "Low" ? (
                    <Badge variant="softWarning">Low</Badge>
                  ) : (
                    <Badge variant="softSuccess">OK</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
