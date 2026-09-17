"use client";

import { useState } from "react";
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
import { SortDirection, SortField, StaffTableProps } from "types";
import { formatUKPhone, getEmployeeStatusLabel, getEmployeeStatusVariant, getRoleBadgeColor, getStatusBadgeColor } from "utils";
import { TableBulkActions, StaffViewDrawer } from "@/components/ui";
import { Badge, type BadgeProps } from"@/components/ui"
import { formatRoleName } from "utils";
import { buildComplianceForStaff, overallComplianceStatus } from "lib";
import { ComplianceIndicator } from "./ComplianceIndicator";

export function StaffTable({ data, onEdit, onDelete, onView }: StaffTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewingStaff, setViewingStaff] = useState(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(sortedData.map((s) => s.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleView = (staff: any) => {
    setViewingStaff(staff);
    setDrawerOpen(true);
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
    <button onClick={() => handleSort(field)} className="flex items-center gap-2 font-medium text-cf-ink-60 hover:text-cf-ink transition-colors">
      {label}
      <ArrowUpDown className={`h-4 w-4 ${sortField === field ? "text-cf-brand-500" : "opacity-40"}`} />
    </button>
  );

  const allSelected = selectedRows.size === sortedData.length && sortedData.length > 0;
  const someSelected = selectedRows.size > 0 && selectedRows.size < sortedData.length;

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
                <TableHead className="text-cf-ink-60"><SortableHeader field="name" label="Employee" /></TableHead>
                <TableHead className="text-cf-ink-60">Contact Info</TableHead>
                <TableHead className="text-cf-ink-60"><SortableHeader field="role" label="Role" /></TableHead>
                <TableHead className="text-cf-ink-60">Employment</TableHead>
                <TableHead className="text-cf-ink-60">Compliance</TableHead>
                <TableHead className="text-cf-ink-60"><SortableHeader field="status" label="Status" /></TableHead>
                <TableHead className="text-cf-ink-60"><SortableHeader field="joinDate" label="Join Date" /></TableHead>
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
          onClear={() => setSelectedRows(new Set())} 
          onDelete={() => { selectedRows.forEach((id) => onDelete?.(id)); setSelectedRows(new Set()); }} 
        />
      </div>

      <StaffViewDrawer staff={viewingStaff} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}