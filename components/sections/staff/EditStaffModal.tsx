'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label,
  Badge,
  BadgeProps,
} from "@/components/ui";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { StaffMember } from "types";
import { Loader2, AlertCircle, CheckCircle2, User, Mail, Phone } from 'lucide-react';
import { getRoleBadgeColor, getRoleDisplayName, getStatusBadgeColor } from 'utils';

interface EditStaffModalProps {
  staff: StaffMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: Partial<StaffMember>) => Promise<void>;
}

export function EditStaffModal({
  staff,
  open,
  onOpenChange,
  onSave,
}: EditStaffModalProps) {
  const [formData, setFormData] = useState({
    name: staff.name,
    email: staff.email,
    phone: staff.phone || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.name.trim()) throw new Error('Name is required');
      if (!formData.email.trim()) throw new Error('Email is required');

      if (onSave) {
        await onSave({
          id: staff.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
        });
      } else {
        const response = await fetch(`/api/staff/${staff.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
          }),
        });
        if (!response.ok) throw new Error('Failed to update staff member');
      }

      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const initials = formData.name
    ? formData.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-bold text-cf-ink">
            Edit staff member
          </DialogTitle>
        </DialogHeader>

        {/* Identity strip — live preview of what's being edited */}
        <div className="flex items-center gap-3 px-6 pt-4">
          <div className="w-11 h-11 rounded-full bg-cf-primary/10 flex items-center justify-center text-sm font-semibold text-cf-primary flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-cf-ink truncate">
              {formData.name || 'Unnamed'}
            </p>
            <p className="text-xs text-cf-ink-60 truncate">{formData.email || '—'}</p>
          </div>
        </div>

        <div className="px-6 pt-2">
          {error && (
            <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2.5 p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">Changes saved</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 space-y-5">
            {/* Personal */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-cf-ink-40 uppercase tracking-wide">
                Personal
              </p>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-cf-ink-60 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Full name
                </Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  disabled={isLoading}
                  className="border-cf-border"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-cf-ink-40 uppercase tracking-wide">
                Contact
              </p>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-cf-ink-60 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email
                </Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  disabled={isLoading}
                  className="border-cf-border"
                />
                <p className="text-xs text-cf-ink-40">
                  {staff.emailVerified ? '✓ Verified' : '⚠ Not verified yet'}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-cf-ink-60 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone
                </Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number (optional)"
                  disabled={isLoading}
                  className="border-cf-border"
                />
              </div>
            </div>

            {/* Role & status — read-only chips instead of grey text */}
            <div className="flex items-center gap-2 p-3 bg-cf-surface-muted rounded-lg">
              <Badge variant={getRoleBadgeColor(staff.role)} >
                {getRoleDisplayName(staff.role)}
              </Badge>
              <Badge variant={getStatusBadgeColor(staff.status) as BadgeProps['variant']} >
                {staff.status}
              </Badge>
              <span className="text-xs text-cf-ink-40 ml-auto">
                Change role from the permissions tab
              </span>
            </div>
          </div>

          <DialogFooter className="flex gap-3 px-6 py-5 mt-2 border-t border-cf-border-light">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 border-cf-border hover:bg-cf-surface-muted"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}