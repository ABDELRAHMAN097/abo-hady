import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const data = [
  {
    exam: "Exam1",
    active: 55,
    average: 35,
  },
  {
    exam: "Exam2",
    active: 43,
    average: 52,
  },
  {
    exam: "Exam3",
    active: 38,
    average: 28,
  },
  {
    exam: "Exam4",
    active: 75,
    average: 35,
  },
  {
    exam: "Exam5",
    active: 60,
    average: 45,
  },
  {
    exam: "Exam6",
    active: 38,
    average: 28,
  },
];

const CustomDot = ({ cx, cy, index }) => {
  if (index !== 3) {
    return null;
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill="#11255C"
      stroke="#FFFFFF"
      strokeWidth={2}
    />
  );
};

export default function StudentPerformance() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100/50 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        {/* Title */}
        <div className="flex flex-col items-stretch">
          <h4 className="text-xl font-bold text-primary-color mb-1">
            Student Performance Trend
          </h4>

          <span className="text-sm text-gray-400">
            Average Grades for The Last 6 Exams
          </span>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            FILTER:
          </span>

          <select
            className="
              h-9
              px-3
              pr-8
              text-xs
              font-medium
              text-gray-600
              bg-white
              border
              border-gray-200
              rounded-lg
              outline-none
              cursor-pointer
            "
          >
            <option>All Groups</option>
            <option>Group A</option>
            <option>Group B</option>
            <option>Group C</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[250px] mt-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            {/* Grid */}
            <CartesianGrid
              vertical={false}
              stroke="#E8EDF5"
              strokeWidth={1}
            />

            {/* X Axis */}
            <XAxis
              dataKey="exam"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 11,
              }}
              dy={10}
            />

            {/* Y Axis */}
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
              tick={{
                fill: "#64748B",
                fontSize: 11,
              }}
              width={40}
            />

            {/* Vertical dashed line at Exam4 */}
            <ReferenceLine
              x="Exam4"
              stroke="#CBD5E1"
              strokeDasharray="5 5"
              strokeWidth={1}
            />

            {/* Gray Line */}
            <Line
              type="monotone"
              dataKey="average"
              stroke="#929292"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={false}
              activeDot={false}
              isAnimationActive={true}
              animationDuration={800}
            />

            {/* Blue Line */}
            <Line
              type="monotone"
              dataKey="active"
              stroke="#11255C"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={<CustomDot />}
              activeDot={false}
              isAnimationActive={true}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}