"use client";

import { Button } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { MoreHorizontal, Eye, Edit2, Mail, MessageSquare, Trash2 } from "lucide-react";
import { StaffMember } from "types";

interface TableActionsProps {
  staff: StaffMember;
  onView?: (staff: StaffMember) => void;
  onEdit?: (staff: StaffMember) => void;
  onDelete?: (id: string) => void;
}

export function TableActions({ staff, onView, onEdit, onDelete }: TableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-cf-surface-muted">
          <MoreHorizontal className="h-4 w-4 text-cf-ink-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-cf-surface border-cf-border w-48">
        {onView && (
          <DropdownMenuItem onClick={() => onView(staff)} className="gap-2 cursor-pointer hover:bg-cf-surface-muted">
            <Eye className="h-4 w-4 text-cf-info" />
            <span>View</span>
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(staff)} className="gap-2 cursor-pointer hover:bg-cf-surface-muted">
            <Edit2 className="h-4 w-4 text-cf-brand-500" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          className="gap-2 cursor-pointer hover:bg-cf-surface-muted" 
          onClick={() => staff.email && (window.location.href = `mailto:${staff.email}`)}
        >
          <Mail className="h-4 w-4 text-cf-brand-500" />
          <span>Email</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer hover:bg-cf-surface-muted">
          <MessageSquare className="h-4 w-4 text-cf-brand-500" />
          <span>SMS</span>
        </DropdownMenuItem>
        {onDelete && (
          <>
            <DropdownMenuSeparator className="bg-cf-border-light" />
            <DropdownMenuItem onClick={() => onDelete(staff.id)} className="gap-2 cursor-pointer text-cf-error hover:bg-cf-error-muted">
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}