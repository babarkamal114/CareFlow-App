'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  Badge,
  BadgeProps,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  Label
} from '@/components/ui';

import {IncidentTabs} from "@/components/ui"
import {
  FileText,
  Download,
  XCircle,
  CheckCircle,
  FileUp,
  MoreVertical,
  Paperclip,
} from 'lucide-react';
import { useState } from 'react';
import { Incident, IncidentSeverity, IncidentStatus } from '@/types';
import { formatFileSize } from 'utils';

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
  const [selectedTab, setSelectedTab] = useState('info');
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  if (!incident) return null;

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

  const getSeverityColor = (severity: IncidentSeverity): BadgeProps['variant'] => {
    switch (severity) {
      case 'critical':
        return 'pastel-danger';
      case 'high':
        return 'pastel-orange';
      case 'medium':
        return 'pastel-warning';
      case 'low':
        return 'pastel-info';
      default:
        return 'pastel-neutral';
    }
  };

  const getStatusColor = (status: IncidentStatus): BadgeProps['variant'] => {
    switch (status) {
      case 'reported':
        return 'pastel-info';
      case 'investigating':
        return 'pastel-warning';
      case 'resolved':
        return 'pastel-success';
      case 'closed':
        return 'pastel-zinc';
      default:
        return 'pastel-neutral';
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
        <DrawerContent className="max-w-2xl">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DrawerTitle className="text-xl">{incident.title}</DrawerTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getSeverityColor(incident.severity)} badgeSize={'lg'} shape={'rounded'}>
                  {incident.severity.toUpperCase()}
                </Badge>
                <Badge variant={getStatusColor(incident.status)} badgeSize={'md'} shape={'pill'}>
                  {incident.status}
                </Badge>
              </div>
            </div>
          </DrawerHeader>

          <div className="px-6 mt-12">
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
                    <MoreVertical className="h-4 w-4" />
                    Actions
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-1.5" align="end">
                  <div className="space-y-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 text-xs h-8"
                      onClick={() => setEvidenceDialogOpen(true)}
                    >
                      <FileUp className="h-3.5 w-3.5" />
                      Add Evidence
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 text-xs h-8"
                      onClick={() => onDownloadLogs?.(incident.id)}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Logs
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setCloseDialogOpen(true)}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Close Case
                    </Button>
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
                accept="image/*,.pdf,.doc,.docx,.mp3,.mp4"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-1.5"
              >
                <FileUp className="h-8 w-8 text-cf-ink-40" />
                <p className="text-xs text-cf-ink-60">
                  Click to upload or drag and drop
                </p>
                <p className="text-[10px] text-cf-ink-40">
                  Images, PDFs, Word, Audio, Video
                </p>
              </Label>
            </div>
            {selectedFiles.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                <p className="text-xs font-medium text-cf-ink">
                  Selected files ({selectedFiles.length})
                </p>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-1.5 bg-cf-surface-muted rounded text-xs">
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
            <Button
              size="sm"
              onClick={handleConfirmEvidence}
              disabled={selectedFiles.length === 0}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
