import { DashboardWorkspaceSection } from "sections";

export default function DashboardHomePage() {
   return (
    <div className="w-full min-w-0 bg-transparent p-0 md:p-6">
      <div className="min-w-0 space-y-3 rounded-2xl bg-cf-surface p-3 shadow-cf-md sm:space-y-4 sm:p-4 md:p-6">
         <DashboardWorkspaceSection />
      </div>
    </div>
   )
}