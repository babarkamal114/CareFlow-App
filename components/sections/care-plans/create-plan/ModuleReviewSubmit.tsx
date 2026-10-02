'use client';

import { Button } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { ModuleCreationData } from "types";
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ModuleReviewSubmitProps {
  data: Partial<ModuleCreationData>;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ModuleReviewSubmit({
  data,
  onBack,
  onSubmit,
  isSubmitting,
}: ModuleReviewSubmitProps) {
  const renderContent = () => {
    if (!data.content) return null;

    const content = data.content;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(content).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              return (
                <Card key={key} className="col-span-2">
                  <CardHeader>
                    <CardTitle className="text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    {Object.entries(value).map(([subKey, subValue]) => (
                      <div key={subKey}>
                        <span className="font-medium text-cf-ink-60">
                          {subKey.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="ml-2">
                          {typeof subValue === 'string' ? subValue : JSON.stringify(subValue)}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            }
            return (
              <div key={key} className="text-sm">
                <span className="font-medium text-cf-ink-60">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="ml-2">
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-cf-ink">Review Module Details</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium">Module Type: {data.type?.replace('-', ' ')}</p>
            <p>Name: {data.name}</p>
            <p>Status: {data.status || 'draft'}</p>
          </div>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {renderContent()}
      </div>

      <div className="flex justify-between pt-4 border-t border-cf-border">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⏳</span>
              Creating...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Create Module
            </>
          )}
        </Button>
      </div>
    </div>
  );
}