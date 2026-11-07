"use client";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Checkbox } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import type { SortableHeaderProps, StaffTableProps } from "types";
import { formatUKPhone, getEmployeeStatusLabel, getEmployeeStatusVariant, getRoleBadgeColor } from "utils";
import { TableBulkActions, StaffViewDrawer } from "@/components/ui";
import { Badge, type BadgeProps } from"@/components/ui"
import { formatRoleName } from "utils";
import { buildComplianceForStaff, overallComplianceStatus } from "lib";
import { ComplianceIndicator } from "./ComplianceIndicator";
import { useStaffTable } from "hooks";
import { getInitials } from "utils";

function SortableHeader({ field, label, active, onSort }: SortableHeaderProps) {
  return (
    <button onClick={() => onSort(field)} className="flex items-center gap-2 font-medium text-cf-ink-60 hover:text-cf-ink transition-colors">
      {label}
      <ArrowUpDown className={`h-4 w-4 ${active ? "text-cf-brand-500" : "opacity-40"}`} />
    </button>
  );
}

export function StaffTable({ data, onDelete }: StaffTableProps) {
  const {
    sortField,
    sortedData,
    selectedRows,
    allSelected,
    someSelected,
    drawerOpen,
    setDrawerOpen,
    viewingStaff,
    handleSort,
    handleSelectRow,
    handleSelectAll,
    handleView,
    clearSelection,
    handleDeleteSelected,
  } = useStaffTable(data, onDelete);

  return (
    <>
      <div className="w-full h-full rounded-lg border border-cf-border bg-cf-surface">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-cf-border-light hover:bg-transparent">
                <TableHead className="w-12 px-4">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={(checked) => handleSelectAll(checked === true)}
                    className="border-cf-border"
                  />
                </TableHead>
                <TableHead className="text-cf-ink-60"><SortableHeader field="name" label="Employee" active={sortField === "name"} onSort={handleSort} /></TableHead>
                <TableHead className="text-cf-ink-60">Contact Info</TableHead>
                <TableHead className="text-cf-ink-60"><SortableHeader field="role" label="Role" active={sortField === "role"} onSort={handleSort} /></TableHead>
                <TableHead className="text-cf-ink-60">Employment</TableHead>
                <TableHead className="text-cf-ink-60">Compliance</TableHead>
                <TableHead className="text-cf-ink-60"><SortableHeader field="status" label="Status" active={sortField === "status"} onSort={handleSort} /></TableHead>
                <TableHead className="text-cf-ink-60"><SortableHeader field="joinDate" label="Join Date" active={sortField === "joinDate"} onSort={handleSort} /></TableHead>
                <TableHead className="w-12 text-cf-ink-60">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length > 0 ? (
                sortedData.map((staff, index) => {
                  const compliance = buildComplianceForStaff(staff.id, index);
                  const complianceStatus = overallComplianceStatus(compliance);
                  return (
                    <TableRow key={staff.id} className={`border-b border-cf-border-light hover:bg-cf-surface-muted/50 transition-colors ${selectedRows.has(staff.id) ? "bg-cf-surface-muted/50" : ""}`}>
                      <TableCell className="px-4">
                        <Checkbox
                          checked={selectedRows.has(staff.id)}
                          onCheckedChange={(checked) => handleSelectRow(staff.id, checked === true)}
                          className="border-cf-border"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-cf-border-light">
                            {staff.profilePicture && <AvatarImage src={staff.profilePicture} alt={staff.name} />}
                            <AvatarFallback className="bg-cf-surface-muted text-cf-ink-60 text-xs font-medium">{getInitials(staff.name)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-cf-ink whitespace-nowrap">{staff.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm text-cf-ink whitespace-nowrap">{staff.email}</span>
                          {staff.phone && <span className="text-xs text-cf-ink-60 mt-0.5">{formatUKPhone(staff.phone)}</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                        variant={getRoleBadgeColor(staff.role) as BadgeProps['variant']}
                        shape={'pill'} badgeSize={'md'}
                        >
                          {formatRoleName(staff.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {compliance.employmentType === "employed" ? (
                          <span className="text-xs text-cf-ink-60 capitalize">Employed</span>
                        ) : (
                          <Badge variant="pastel-indigo" shape={'pill'} badgeSize={'md'} >
                            {compliance.employmentType}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <ComplianceIndicator status={complianceStatus} />
                      </TableCell>
                      <TableCell>
                        <Badge
                        variant={getEmployeeStatusVariant(staff.status)}
                        shape={'pill'} badgeSize={'md'}
                        >
                        {getEmployeeStatusLabel(staff.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-cf-ink-60 whitespace-nowrap">{new Date(staff.joinDate).toLocaleDateString("en-GB")}</TableCell>
                      <TableCell>
                        <Button 
                        variant="ghost"
                        onClick={() => handleView(staff)}
                        >
                          <ChevronRight />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <p className="text-cf-ink-60">No staff members found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TableBulkActions 
          selectedCount={selectedRows.size} 
          onClear={clearSelection} 
          onDelete={handleDeleteSelected} 
        />
      </div>

      <StaffViewDrawer staff={viewingStaff} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}