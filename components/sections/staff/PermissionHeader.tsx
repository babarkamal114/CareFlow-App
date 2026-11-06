import { DialogHeader, DialogTitle } from "@/components/ui";
import { StaffMember } from "types";
import { ALL_MODULES } from "utils";
import { Shield } from "lucide-react";

function PermissionsHeader({
  staff,
  permissions,
}: {
  staff: StaffMember;
  permissions: Record<string, string[]>;
}) {

  return (
    <DialogHeader className="border-b border-cf-border px-8 py-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-cf-primary/10 rounded-lg">
          <Shield className="w-6 h-6 text-cf-primary" />
        </div>
        <div className="flex-1">
          <DialogTitle className="text-2xl">Manage Permissions</DialogTitle>
          <p className="text-sm text-cf-ink-60 mt-1">Configure access for {staff.name}</p>
        </div>
      </div>
    </DialogHeader>
  );
}

export default PermissionsHeader