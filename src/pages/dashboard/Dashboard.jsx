import { useState } from "react";
import TapsDashboard from "../../components/TapsDashboard";
import { myProfile } from "../../apis/auth";
import { useEffect } from "react";
import StudentPerformance from "@/components/Dashboard/StudentPerformance";
import SubmissionRate from "@/components/Dashboard/SubmissionRate";
import LiveExamsStatus from "@/components/Dashboard/LiveExamsStatus";
import RecentActivities from "@/components/Dashboard/RecentActivities";

export default function Dashboard() {
  const [examPeriod, setExamPeriod] = useState("Daily");
  
  const getmyprofile = async () => {
    const res = await myProfile();
    
    if (res.status === true) {
      
    }
  }
  useEffect(() => {
    getmyprofile()
  }, []);
  
  return (
    <div className="space-y-4">
      {/* 4 Top Cards Grid */}
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