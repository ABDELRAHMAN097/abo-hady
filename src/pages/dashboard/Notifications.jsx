import { useMemo, useState } from "react";

import {
  HiOutlineDocumentText,
  HiOutlineUserAdd,
} from "react-icons/hi";
import { LuWallet } from "react-icons/lu";
import { LuSparkles } from "react-icons/lu";


import NotificationTabs from "@/components/Notifications/NotificationTabs";
import NotificationSection from "@/components/Notifications/NotificationSection";
import EmptyNotifications from "@/components/Notifications/EmptyNotifications";

import TopUpWalletModal from "../../components/Notifications/Top-Up-Modal/TopUpWalletModal";
import PaymentSuccessModal from "../../components/Notifications/Top-Up-Modal/PaymentSuccessModal";

const notifications = [
  {
    id: 1,
    category: "exams",
    section: "Today",
    type: "exam",
    icon: HiOutlineDocumentText,
    title: "Ahmed Ali completed 'Physics Mid-term Exam'",
    description: "",
    score: "18/20 (90%)",
    group: "Group A – 1st Secondary",
    time: "12 MINS AGO",
    action: {
      label: "View Result Sheet",
      arrow: true,
    },
  },

  {
  id: 2,
  category: "wallet",
  section: "Today",
  type: "wallet",
  icon: LuWallet,

  title: "Low Wallet Balance Warning",

  descriptionBefore: "Your wallet balance is",
  balance: "$4.50",
  descriptionAfter:
    "Top up now to prevent exam auto-submissions from pausing.",

  time: "2 HOURS AGO",

  action: {
    label: "Top up $50",
  },
},
  {
    id: 3,
    category: "students",
    section: "Today",
    type: "student",
    icon: HiOutlineUserAdd,
    title: "Sarah Mahmoud requested to join Group B",
    description: "Pending your approval • Grade 10 Student",
    time: "5 HOURS AGO",
    action: {
      label: "Approve Student",
      variant: "outline",
    },
  },

  {
    id: 4,
    category: "system",
    section: "Yesterday",
    type: "system",
    icon: LuSparkles,
    title: "Platform Update: Word (.docx) Bulk Uploads",
    description:
      "Question Bank now supports importing questions directly from Microsoft Word documents using our standard formatting template.",
    time: "YESTERDAY AT 3:15 PM",
    action: {
      label: "Learn More",
      variant: "link",
    },
  },
];
// const notifications = [];
export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [paymentData, setPaymentData] = useState({
    amount: 0,
    newBalance: 0,
  });
  
  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") {
      return notifications;
    }

    return notifications.filter(
      (notification) => notification.category === activeTab
    );
  }, [activeTab]);

  const todayNotifications = filteredNotifications.filter(
    (notification) => notification.section === "Today"
  );

  const yesterdayNotifications = filteredNotifications.filter(
    (notification) => notification.section === "Yesterday"
  );

  return (
    <div className="w-full min-w-0 max-w-full pb-10 overflow-hidden">
      
      {/* Tabs */}
      <NotificationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Sections */}
     <div className="mt-4 sm:mt-5">
  {filteredNotifications.length === 0 ? (
    <EmptyNotifications />
  ) : (
    <div className="space-y-5 sm:space-y-6">
      <NotificationSection
        title="TODAY"
        notifications={todayNotifications}
        onTopUp={() => setIsTopUpOpen(true)}
      />

      <NotificationSection
        title="YESTERDAY"
        notifications={yesterdayNotifications}
        onTopUp={() => setIsTopUpOpen(true)}
            />
          </div>
        )}
      </div>
      {isTopUpOpen && (
        <TopUpWalletModal
          onClose={() => setIsTopUpOpen(false)}
          onSuccess={(data) => {
            setPaymentData(data);
            setIsTopUpOpen(false);
            setIsSuccessOpen(true);
          }}
        />
      )}

      {isSuccessOpen && (
        <PaymentSuccessModal
          amount={paymentData.amount}
          newBalance={paymentData.newBalance}
          onClose={() => setIsSuccessOpen(false)}
        />
      )}

    </div>
  );
}