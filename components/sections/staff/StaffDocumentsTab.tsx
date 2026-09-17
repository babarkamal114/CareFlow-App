'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Upload,
  Calendar,
  User,
} from 'lucide-react';
import type { StaffMember } from 'types';

interface Document {
  id: string;
  name: string;
  type: 'certification' | 'license' | 'insurance' | 'training' | 'other';
  uploadedAt: Date;
  expiresAt?: Date;
  uploadedBy: string;
  url: string;
  size: string;
  status: 'verified' | 'pending' | 'expired';
}

interface StaffDocumentsTabProps {
  staff: StaffMember;
}

// Mock documents data
const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    name: 'DBS Check Certificate',
    type: 'certification',
    uploadedAt: new Date('2024-01-15'),
    expiresAt: new Date('2027-01-15'),
    uploadedBy: 'Admin User',
    url: '#',
    size: '2.4 MB',
    status: 'verified',
  },
  {
    id: '2',
    name: 'First Aid Training',
    type: 'training',
    uploadedAt: new Date('2024-02-20'),
    expiresAt: new Date('2025-02-20'),
    uploadedBy: 'Admin User',
    url: '#',
    size: '1.8 MB',
    status: 'verified',
  },
  {
    id: '3',
    name: 'Professional Indemnity Insurance',
    type: 'insurance',
    uploadedAt: new Date('2024-03-10'),
    expiresAt: new Date('2024-12-31'),
    uploadedBy: 'Finance Team',
    url: '#',
    size: '3.2 MB',
    status: 'pending',
  },
  {
    id: '4',
    name: 'Nursing License',
    type: 'license',
    uploadedAt: new Date('2023-06-05'),
    expiresAt: new Date('2026-06-05'),
    uploadedBy: 'HR Manager',
    url: '#',
    size: '1.5 MB',
    status: 'verified',
  },
  {
    id: '5',
    name: 'Manual Handling Training Certificate',
    type: 'training',
    uploadedAt: new Date('2024-01-25'),
    expiresAt: new Date('2025-01-25'),
    uploadedBy: 'Admin User',
    url: '#',
    size: '2.1 MB',
    status: 'verified',
  },
];

function getStatusColor(status: Document['status']) {
  switch (status) {
    case 'verified':
      return 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300';
    case 'pending':
      return 'bg-amber-950/30 border-amber-800/50 text-amber-400 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300';
    case 'expired':
      return 'bg-red-950/30 border-red-800/50 text-red-400 dark:bg-red-950/50 dark:border-red-800 dark:text-red-300';
    default:
      return 'bg-cf-surface-muted border-cf-border text-cf-ink-60';
  }
}

function getStatusBadgeVariant(status: Document['status']) {
  switch (status) {
    case 'verified':
      return 'success';
    case 'pending':
      return 'warning';
    case 'expired':
      return 'error';
    default:
      return 'default';
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function isExpiringSoon(expiryDate?: Date): boolean {
  if (!expiryDate) return false;
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  return new Date(expiryDate) <= thirtyDaysFromNow && new Date(expiryDate) > today;
}

function capitalizeStatus(status: Document['status']): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function StaffDocumentsTab({ staff }: StaffDocumentsTabProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = (doc: Document) => {
    setSelectedDocument(doc);
    setIsPreviewOpen(true);
  };

  const handleDownload = (doc: Document) => {
    
    console.log(`Downloading ${doc.name}`);
  };

  const handleDelete = (doc: Document) => {
    
    console.log(`Deleting ${doc.name}`);
  };

  const verifiedDocs = MOCK_DOCUMENTS.filter((d) => d.status === 'verified').length;
  const expiredDocs = MOCK_DOCUMENTS.filter((d) => d.status === 'expired').length;

  return (
    <div className="space-y-6">
     
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-lg border border-cf-border bg-cf-surface-muted p-3"
        >
          <p className="text-xs text-cf-ink-60 mb-1">Total Documents</p>
          <p className="text-2xl font-bold text-cf-ink">{MOCK_DOCUMENTS.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-cf-border bg-cf-surface-muted p-3"
        >
          <p className="text-xs text-cf-ink-60 mb-1">Verified</p>
          <p className="text-2xl font-bold text-emerald-400 dark:text-emerald-300">{verifiedDocs}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-lg border border-cf-border bg-cf-surface-muted p-3"
        >
          <p className="text-xs text-cf-ink-60 mb-1">Expiring Soon</p>
          <p className="text-2xl font-bold text-amber-400 dark:text-amber-300">
            {MOCK_DOCUMENTS.filter((d) => isExpiringSoon(d.expiresAt)).length}
          </p>
        </motion.div>
      </div>

      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-lg border-2 border-dashed border-cf-border bg-cf-surface-muted/50 dark:bg-cf-surface-muted/30 p-8 text-center hover:border-cf-ink-40 dark:hover:border-cf-ink-60 hover:bg-cf-surface-muted/80 dark:hover:bg-cf-surface-muted/50 transition-all duration-200 cursor-pointer"
      >
        <Upload className="mx-auto h-8 w-8 text-cf-ink-40 dark:text-cf-ink-60 mb-3" />
        <p className="font-medium text-cf-ink mb-1">Upload Document</p>
        <p className="text-sm text-cf-ink-60">
          Drag and drop or click to select a file
        </p>
      </motion.div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-cf-ink">Documents ({MOCK_DOCUMENTS.length})</h3>
        
        {MOCK_DOCUMENTS.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-sm ${getStatusColor(
              doc.status,
            )}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
           
                <div className="flex-shrink-0 mt-1">
                  <div className="rounded-lg bg-cf-surface p-2.5 dark:bg-cf-surface-muted">
                    <FileText className="h-5 w-5 text-cf-ink-60 dark:text-cf-ink-40" />
                  </div>
                </div>

              
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <p className="font-medium text-cf-ink dark:text-cf-surface truncate">{doc.name}</p>
                    <Badge
                      variant={getStatusBadgeVariant(doc.status) as any}
                      badgeSize="sm"
                      shape="pill"
                    >
                      {capitalizeStatus(doc.status)}
                    </Badge>
                    {isExpiringSoon(doc.expiresAt) && doc.status !== 'expired' && (
                      <Badge variant="pastel-warning" badgeSize="sm" shape="pill">
                        Expiring soon
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-cf-ink-60 dark:text-cf-ink-50 flex-wrap">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(doc.uploadedAt)}
                    </div>
                    {doc.expiresAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Expires: {formatDate(doc.expiresAt)}
                      </div>
                    )}
                    <div className="flex items-center gap-1 ml-auto">
                      {doc.size}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-2 text-xs">
                    <User className="h-3 w-3 text-cf-ink-40 dark:text-cf-ink-60" />
                    <span className="text-cf-ink-60 dark:text-cf-ink-50">Uploaded by {doc.uploadedBy}</span>
                  </div>
                </div>
              </div>

              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-cf-ink-60 dark:text-cf-ink-40 hover:bg-cf-surface-muted dark:hover:bg-cf-surface-muted/50"
                  onClick={() => handlePreview(doc)}
                  title="Preview"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-cf-ink-60 dark:text-cf-ink-40 hover:bg-cf-surface-muted dark:hover:bg-cf-surface-muted/50"
                  onClick={() => handleDownload(doc)}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                  onClick={() => handleDelete(doc)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
          </DialogHeader>
          <div className="bg-cf-surface-muted dark:bg-cf-surface rounded-lg p-8 text-center border border-cf-border">
            <FileText className="mx-auto h-16 w-16 text-cf-ink-40 dark:text-cf-ink-60 mb-4" />
            <p className="text-sm text-cf-ink-60 dark:text-cf-ink-50 mb-4">
              Document preview would appear here
            </p>
            <div className="space-y-2 text-left text-sm">
              <p>
                <span className="font-medium text-cf-ink dark:text-cf-surface">File:</span>{' '}
                <span className="text-cf-ink-60 dark:text-cf-ink-50">{selectedDocument?.name}</span>
              </p>
              <p>
                <span className="font-medium text-cf-ink dark:text-cf-surface">Size:</span>{' '}
                <span className="text-cf-ink-60 dark:text-cf-ink-50">{selectedDocument?.size}</span>
              </p>
              <p>
                <span className="font-medium text-cf-ink dark:text-cf-surface">Uploaded:</span>{' '}
                <span className="text-cf-ink-60 dark:text-cf-ink-50">
                  {selectedDocument && formatDate(selectedDocument.uploadedAt)}
                </span>
              </p>
              <p>
                <span className="font-medium text-cf-ink dark:text-cf-surface">Status:</span>{' '}
                <span className="text-cf-ink-60 dark:text-cf-ink-50">
                  {selectedDocument && capitalizeStatus(selectedDocument.status)}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => selectedDocument && handleDownload(selectedDocument)}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}