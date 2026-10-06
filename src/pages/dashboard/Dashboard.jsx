import TapsDashboard from "../../components/TapsDashboard";
import StudentPerformance from "@/components/Dashboard/StudentPerformance";
import SubmissionRate from "@/components/Dashboard/SubmissionRate";
import LiveExamsStatus from "@/components/Dashboard/LiveExamsStatus";
import RecentActivities from "@/components/Dashboard/RecentActivities";

export default function Dashboard() {
  
  return (
    <div className="space-y-4">
      
      <TapsDashboard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 pb-6">
       <StudentPerformance />
       <SubmissionRate />
       <LiveExamsStatus />
       <RecentActivities />
      </div>

      
    </div>
  );
}