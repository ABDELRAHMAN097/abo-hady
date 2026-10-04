import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { useI18n } from "../../i18n/i18n/context";

import {
  LuBell,
  LuUserRoundCheck,
  LuUserRoundPlus,
  LuUserRoundX,
} from "react-icons/lu";



export default function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const { t } = useI18n();

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const removeActivity = (requestId) => {
    setActivities((current) =>
      current.filter((activity) => activity.id !== requestId)
    );
  };

  const handleAccept = async (requestId) => {
    setProcessingId(requestId);
    removeActivity(requestId);
    toast.success("Student request accepted.");
    setProcessingId(null);
  };

  const handleReject = async (requestId) => {
    setProcessingId(requestId);
    removeActivity(requestId);
    toast.success("Student request rejected.");
    setProcessingId(null);
  };

  return (
    <div className="bg-surface rounded-2xl border border-gray-100/50 shadow-sm overflow-hidden p-6">
      <div className="px-5 py-4 border-b border-gray-100">
        <h4 className="text-lg font-bold text-[#173675]">
          {t('Recent')}
        </h4>
      </div>

      <div>
        {loading && (
          <div className="px-5 py-4 text-sm text-[#94A3B8]">
            {t('Loading activities...')}
          </div>
        )}

        {!loading && activities.length === 0 && (
        <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#94A3B8]">
            <LuBell size={24} strokeWidth={1.8} />
          </div>

          <p className="text-sm font-medium leading-6 text-[#94A3B8]">
            {t('No recent notifications')}
            <br />
            {t('You\'re all caught up!')}
          </p>
        </div>
        )}

        <AnimatePresence initial={false}>
          {activities.map((activity, index) => {
            const isProcessing = processingId === activity.id;
            const studentName = activity.student?.name || "Student";

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 px-5 py-3.5 ${
                  index !== activities.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center bg-[#EEF2FA] text-[#173675]">
                  <LuUserRoundPlus size={16} strokeWidth={1.8} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h5 className="text-sm font-medium text-[#173675] leading-5">
                      {t('New Join Request')}
                    </h5>

                    <span className="text-[10px] text-[#94A3B8] surfacespace-nowrap pt-0.5">
                      {formatTime(activity.requested_at)}
                    </span>
                  </div>

                  <p className="text-xs text-[#94A3B8] mt-0.5 leading-5">
                    {studentName}  {t('New Join Request')}.
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      disabled={isProcessing}
                      onClick={() => handleReject(activity.id)}
                      title="Reject"
                      className="w-8 h-8 rounded-lg border border-gray-100 bg-surface flex items-center justify-center text-[#EF4444] hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LuUserRoundX size={15} strokeWidth={1.8} />
                    </motion.button>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      disabled={isProcessing}
                      onClick={() => handleAccept(activity.id)}
                      title="Accept"
                      className="w-8 h-8 rounded-lg border border-gray-100 bg-surface flex items-center justify-center text-[#22C55E] hover:bg-green-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LuUserRoundCheck size={15} strokeWidth={1.8} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}