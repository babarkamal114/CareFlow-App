'use client';

import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose,
  Badge, Button, Avatar, AvatarFallback,
  Popover, PopoverContent, PopoverTrigger,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
  Input, Label,
} from '@/components/ui';
import { IncidentTabs } from '@/components/ui';
import { FileUp, Download, XCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Incident } from 'types';
import { formatFileSize } from 'utils';
import {
  getSeverityBadgeVariant,
  getSeverityLabel,
  getStatusBadgeVariant,
  getIncidentFlags,
  getInitials,
  INCIDENT_ACTIONS,
  INCIDENT_TABS,
  EVIDENCE_ACCEPT_TYPES,
  type IncidentAction,
} from 'utils';

interface IncidentDetailDrawerProps {
  incident: Incident | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseCase?: (incidentId: string) => void;
  onAddEvidence?: (incidentId: string, files: File[]) => void;
  onDownloadLogs?: (incidentId: string) => void;
}

export function IncidentDetailDrawer({
  incident,
  open,
  onOpenChange,
  onCloseCase,
  onAddEvidence,
  onDownloadLogs,
}: IncidentDetailDrawerProps) {
  const [selectedTab, setSelectedTab] = useState<string>(INCIDENT_TABS[0].value);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  if (!incident) return null;

  const flags = getIncidentFlags(incident);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleConfirmEvidence = () => {
    if (selectedFiles.length > 0) {
      onAddEvidence?.(incident.id, selectedFiles);
      setSelectedFiles([]);
      setEvidenceDialogOpen(false);
    }
  };

  const handleCloseCase = () => {
    onCloseCase?.(incident.id);
    setCloseDialogOpen(false);
  };

  const handleAction = (action: IncidentAction) => {
    switch (action.id) {
      case 'add-evidence':
        setEvidenceDialogOpen(true);
        break;
      case 'download-logs':
        onDownloadLogs?.(incident.id);
        break;
      case 'close-case':
        setCloseDialogOpen(true);
        break;
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
        <DrawerContent className="max-w-2xl h-full max-h-screen flex flex-col">
          <DrawerHeader className="border-b border-cf-border pb-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 border border-cf-border">
                <AvatarFallback className="bg-brand-50 text-brand-600 font-semibold">
                  {getInitials(incident.patientName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <DrawerTitle className="text-xl font-semibold text-cf-ink">
                  {incident.title}
                </DrawerTitle>
                <p className="mt-1 text-xs text-cf-ink-60">Patient: {incident.patientName}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge
                    variant={getSeverityBadgeVariant(incident.severity)}
                    className="text-xs"
                    shape="pill"
                  >
                    {getSeverityLabel(incident.severity)}
                  </Badge>
                  <Badge
                    variant={getStatusBadgeVariant(incident.status)}
                    className="text-xs capitalize"
                    shape="pill"
                  >
                    {incident.status}
                  </Badge>
                  {flags.map((flag) => (
                    <Badge key={flag.id} variant="softDanger" className="text-xs" shape="pill">
                      {flag.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto">
            <IncidentTabs
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              incident={incident}
            />
          </div>

          <DrawerFooter className="border-t border-cf-border pt-4 flex-row justify-between">
            <DrawerClose>
              <Button variant="outline">Close</Button>
            </DrawerClose>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4 hidden" /> {/* keep import used */}
                    Actions
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-1.5" align="end">
                  <div className="space-y-0.5">
                    {INCIDENT_ACTIONS.map((action) => (
                      <Button
                        key={action.id}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start gap-2 text-xs h-8 ${
                          action.danger
                            ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                            : ''
                        }`}
                        onClick={() => handleAction(action)}
                      >
                        <action.icon className="h-3.5 w-3.5" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Close Case</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to close this incident case? This action can be reversed if needed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setCloseDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleCloseCase}>
              <XCircle className="h-3.5 w-3.5 mr-1.5" />
              Close Case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={evidenceDialogOpen} onOpenChange={setEvidenceDialogOpen}>
        <DialogContent className="max-w-sm max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-base">Add Evidence</DialogTitle>
            <DialogDescription className="text-sm">
              Upload files related to this incident investigation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="border-2 border-dashed border-cf-border rounded-lg p-6 text-center">
              <Input
                type="file"
                multiple
                accept={EVIDENCE_ACCEPT_TYPES}
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                <FileUp className="h-8 w-8 text-cf-ink-40" />
                <p className="text-xs text-cf-ink-60">Click to upload or drag and drop</p>
                <p className="text-[10px] text-cf-ink-40">Images, PDFs, Word, Audio, Video</p>
              </Label>
            </div>
            {selectedFiles.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                <p className="text-xs font-medium text-cf-ink">
                  Selected files ({selectedFiles.length})
                </p>
                {selectedFiles.map((file) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex items-center justify-between p-1.5 bg-cf-surface-muted rounded text-xs"
                  >
                    <span className="text-cf-ink truncate max-w-[120px]">{file.name}</span>
                    <span className="text-cf-ink-60 text-[10px]">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setEvidenceDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmEvidence} disabled={selectedFiles.length === 0}>
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}