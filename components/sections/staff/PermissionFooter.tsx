import { Button, DialogFooter } from "@/components/ui";
import { Loader2 } from "lucide-react";

function PermissionsFooter({
  isLoading,
  onCancel,
  onSubmit,
}: {
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <DialogFooter className="border-t border-cf-border px-8 py-6 flex-shrink-0 flex gap-3 bg-white">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="border-cf-border"
      >
        Cancel
      </Button>
      <Button
        onClick={onSubmit}
        disabled={isLoading}
        
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Permissions'
        )}
      </Button>
    </DialogFooter>
  );
}

export default PermissionsFooter