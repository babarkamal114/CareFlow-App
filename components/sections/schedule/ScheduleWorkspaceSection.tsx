'use client';

import { motion } from 'framer-motion';
import { useScheduleWorkspace } from 'hooks';
import { ScheduleAddVisitModal } from './ScheduleAddVisitModal';
import { ScheduleCalendarSection } from './ScheduleCalendarSection';
import { ScheduleCalendarToolbar } from './ScheduleCalendarToolbar';
import { ScheduleCapacitySection } from './ScheduleCapacitySection';
import { ScheduleCarerVisitSwaps } from './ScheduleCarerVisitSwaps';
import { ScheduleEditVisitModal } from './ScheduleEditVisitModal';
import { ScheduleEventDetailsModal } from './ScheduleEventDetailModal';
import { ScheduleHeaderSection } from './ScheduleHeaderSection';
import { ScheduleOptimiseDialog } from './ScheduleOptimiseDialog';
import { ScheduleRecurringVisitModal } from './ScheduleRecurringVisitModal';
import { ScheduleStatCardsSection } from './ScheduleStatCardsSection';
import { ScheduleUnassignedVisits } from './ScheduleUnassignedVisits';
import { ScheduleVisitTemplatesModal } from './ScheduleVisitTemplatesModal';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export function ScheduleWorkspaceSection() {
  const ws = useScheduleWorkspace();

  return (
    <motion.div initial="hidden" animate="show" variants={container} className="space-y-4">
      <motion.div variants={item}>
        <ScheduleHeaderSection onAddVisit={ws.openAddVisit} />
      </motion.div>

      <motion.div variants={item}>
        <ScheduleStatCardsSection visits={ws.visits} todayIso={ws.todayIso} />
      </motion.div>

      <motion.div variants={item} className="flex w-full flex-col gap-4 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-y-4">
          <ScheduleCalendarToolbar
            filters={ws.filters}
            carers={ws.carers}
            patients={ws.patients}
            onFiltersChange={ws.setFilters}
            conflictCount={ws.conflictCount}
            isAiScheduling={ws.isAiScheduling}
            onAiSchedule={ws.runAiSchedule}
            onCreateRecurring={ws.openRecurring}
            onManageTemplates={ws.openTemplates}
            onWhatIf={ws.openWhatIf}
            onBulkCancelWeek={ws.bulkCancelWeek}
            onBulkReassignCarer={ws.bulkReassignCarer}
          />
          <ScheduleCalendarSection
            events={ws.events}
            view={ws.view}
            onViewChange={ws.setView}
            date={ws.date}
            onDateChange={ws.setDate}
            todayIso={ws.todayIso}
            issuesByVisitId={ws.issuesByVisitId}
            resources={ws.resources}
            onSelectEvent={ws.selectEvent}
            onSelectSlot={ws.selectSlot}
            onEventDrop={({ event, start, end, resourceId }) =>
              ws.moveVisit(event.id, start, end, resourceId)
            }
            onEventResize={({ event, start, end }) => ws.moveVisit(event.id, start, end)}
            draggedVisitId={ws.draggedVisitId}
            onDropFromOutside={ws.dropVisitFromOutside}
          />
          <ScheduleCapacitySection days={ws.capacity} className="grow" />
        </div>

        <div className="flex w-full flex-col gap-y-4 xl:max-w-sm">
          <ScheduleUnassignedVisits
            visits={ws.unassignedVisits}
            todayIso={ws.todayIso}
            isOptimising={ws.isAiScheduling}
            onAssignVisit={(visitId) => ws.openAssign([visitId])}
            onAiAssignAll={ws.runAiSchedule}
            onDragVisitStart={ws.setDraggedVisitId}
            onDragVisitEnd={() => ws.setDraggedVisitId(null)}
          />
          <ScheduleCarerVisitSwaps
            swaps={ws.swaps}
            nowIso={ws.nowIso}
            onApprove={ws.approveSwap}
            onReject={ws.rejectSwap}
            className="grow"
          />
        </div>
      </motion.div>

      <ScheduleEventDetailsModal
        open={ws.activeModal === 'detail'}
        onOpenChange={(open) => !open && ws.closeModal()}
        visit={ws.selectedVisit}
        issues={ws.selectedVisit ? ws.issuesByVisitId[ws.selectedVisit.id] : undefined}
        onEdit={ws.openEdit}
        onAssign={ws.assignFromDetail}
      />

      <ScheduleEditVisitModal
        open={ws.activeModal === 'edit'}
        onOpenChange={(open) => !open && ws.closeModal()}
        visit={ws.selectedVisit}
        onSave={ws.editVisit}
        context={ws.context}
        templates={ws.templates}
      />

      <ScheduleAddVisitModal
        open={ws.activeModal === 'add'}
        onOpenChange={(open) => !open && ws.closeModal()}
        onSave={ws.addVisit}
        context={ws.context}
        templates={ws.templates}
        defaultValues={ws.addDefaults}
      />

      <ScheduleRecurringVisitModal
        open={ws.activeModal === 'recurring'}
        onOpenChange={(open) => !open && ws.closeModal()}
        onSave={ws.createRecurring}
        context={ws.context}
        templates={ws.templates}
        defaultDate={ws.todayIso}
      />

      <ScheduleVisitTemplatesModal
        open={ws.activeModal === 'templates'}
        onOpenChange={(open) => !open && ws.closeModal()}
        templates={ws.templates}
        skillOptions={ws.skillOptions}
        onSave={ws.saveTemplate}
        onDelete={ws.deleteTemplate}
      />

      <ScheduleOptimiseDialog
        open={ws.activeModal === 'optimise'}
        onOpenChange={(open) => !open && ws.closeModal()}
        mode={ws.optimiseMode}
        context={ws.context}
        todayIso={ws.todayIso}
        onApply={ws.applyAssignments}
      />
    </motion.div>
  );
}