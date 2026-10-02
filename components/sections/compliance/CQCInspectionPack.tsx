'use client';

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import {
  Download,
  Eye,
  Shield,
  Clock,
} from 'lucide-react';

interface CQCInspectionPackProps {
  onGenerate?: () => void;
  onPreview?: () => void;
  lastGenerated?: string;
  pageCount?: number;
  isGenerating?: boolean;
}

export function CQCInspectionPack({
  onGenerate,
  onPreview,
  lastGenerated = '15 Mar 2026',
  pageCount = 247,
  isGenerating = false,
}: CQCInspectionPackProps) {
  return (
    <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cf-brand-50">
              <Shield className="h-5 w-5 text-cf-brand-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-cf-ink">
                CQC Inspection Pack
              </CardTitle>
              <p className="text-xs text-cf-ink-60">One-click evidence bundle</p>
            </div>
          </div>
          <Badge variant="pastel-success" shape="pill" badgeSize="sm">
            Ready
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-cf-ink-60 leading-relaxed">
          Auto-compiles staff files, patient records, compliance scores, incident reports, and policy docs into a single PDF.
        </p>

        <div className="flex items-center gap-2">
          <Button
            className="flex-1 gap-2"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Generate Pack
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={onPreview}
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>

        <div className="flex items-center gap-1 text-xs text-cf-ink-40">
          <Clock className="h-3 w-3" />
          <span>Last generated: {lastGenerated} · {pageCount} pages</span>
        </div>
      </CardContent>
    </Card>
  );
}