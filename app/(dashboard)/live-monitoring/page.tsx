import { LiveMonitoringWorkspaceSection } from "sections";

export default function LiveMonitoringPage() {
  return (
    <div className="w-full bg-transparent p-6">
      <div className="space-y-4 rounded-2xl bg-cf-surface p-6 shadow-cf-md">
        <LiveMonitoringWorkspaceSection />
      </div>
    </div>
  );
}
