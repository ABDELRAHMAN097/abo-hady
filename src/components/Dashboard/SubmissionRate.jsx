import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useI18n } from "../../i18n/i18n/context";
import { getTeacherStudents } from "@/apis/auth";

const COLORS = {
  submitted: "#27418F",
  notSubmitted: "#E2E5EC",
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  payload,
}) => {
  if (!percent) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const isSubmitted = payload?.name === "Submitted";

  return (
    <text
      x={x}
      y={y}
      fill={isSubmitted ? "#FFFFFF" : "#64748B"}
      textAnchor="middle"
      dominantBaseline="central"
      className="font-semibold"
    >
      <tspan x={x} dy="-5" fontSize="10">
        {`${Math.round(percent * 100)}%`}
      </tspan>

      <tspan x={x} dy="12" fontSize="8">
        {isSubmitted ? t("Submitted") : t("Not submitted")}
      </tspan>
    </text>
  );
};

export default function SubmissionRate() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getTeacherStudents({
          page: 1,
          per_page: 50,
        });

        if (res.success) {
          setStudents(res.data.students ?? []);
        }
      } catch (error) {
        console.error("SUBMISSION RATE ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const totalAssignments = students.reduce(
    (total, item) => total + (item.exams_summary?.assignments_count ?? 0),
    0
  );

  const totalAttempts = students.reduce(
    (total, item) => total + (item.exams_summary?.attempts_count ?? 0),
    0
  );

  const submitted = totalAssignments
    ? Math.min(100, Math.round((totalAttempts / totalAssignments) * 100))
    : 0;

  const notSubmitted = 100 - submitted;

  const chartData = [
    {
      name: "Submitted",
      value: submitted,
      color: COLORS.submitted,
    },
    {
      name: "Not submitted",
      value: notSubmitted,
      color: COLORS.notSubmitted,
    },
  ];

  const hasSubmissionData = totalAssignments > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-2xl border border-gray-100/50 shadow-sm"
    >
      <div className="pb-4 border-b border-gray-100">
        <h4 className="text-xl font-bold text-primary-color mb-1">
          {t("Submission Rate")}
        </h4>

        <span className="text-xl font-bold text-gray-400">
          {loading ? t("Loading...") : `${students.length} ${t("Students")}`}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-5">
        <div className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] shrink-0">
          {hasSubmissionData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="0%"
                  outerRadius="90%"
                  dataKey="value"
                  startAngle={27}
                  endAngle={-333}
                  paddingAngle={0}
                  stroke="none"
                  labelLine={false}
                  label={renderCustomLabel}
                  isAnimationActive
                  animationDuration={800}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-sm text-gray-400">
                {loading ? "Loading..." : t("No submission data yet")}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 min-w-[115px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#27418F]" />
            <span className="text-xl text-gray-600">{t("Submitted")}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E2E5EC]" />
            <span className="text-xl text-gray-600">{t("Not submitted")}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}