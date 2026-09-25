const exams = [
  {
    title: "Physics Ch.1 Quiz",
    group: "Group A - 1st Secondary",
    submissions: "45 / 60",
    submittedPercent: 75,
    score: "16/20",
  },
  {
    title: "Physics Ch.1 Quiz",
    group: "Group A - 1st Secondary",
    submissions: "22 / 80",
    submittedPercent: 27.5,
    score: "16/20",
  },
  {
    title: "Physics Ch.1 Quiz",
    group: "Group A - 1st Secondary",
    submissions: "60 / 60",
    submittedPercent: 100,
    score: "18/20",
  },
  {
    title: "Physics Ch.1 Quiz",
    group: "Group A - 1st Secondary",
    submissions: "35 / 60",
    submittedPercent: 58,
    score: "15/20",
  },
];

export default function LiveExamsStatus() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100/50 shadow-sm">
      
      <div className="pb-5 border-b border-gray-100">
        <h4 className="text-xl font-bold text-primary-color">
          Live Exams Status
        </h4>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[700px] border border-[#AEBBD5] rounded-xl overflow-hidden">

          <div className="grid grid-cols-[2fr_1.6fr_1.2fr_0.7fr] bg-[#F9FAFB] border-b border-[#AEBBD5]">

            <div className="px-5 py-4 text-sm font-semibold text-[#173675]">
              Exam Details
            </div>

            <div className="px-5 py-4 text-sm font-semibold text-[#173675] text-center">
              Submissions
            </div>

            <div className="px-5 py-4 text-sm font-semibold text-[#173675] text-center">
              Avg. Score
            </div>

            <div className="px-5 py-4 text-sm font-semibold text-[#173675] text-center">
              Action
            </div>

          </div>

          {exams.map((exam, index) => (
            <div
              key={index}
              className={`
                grid grid-cols-[2fr_1.6fr_1.2fr_0.7fr]
                min-h-[74px]
                items-center
                bg-white
                ${index !== exams.length - 1 ? "border-b border-[#AEBBD5]" : ""}
              `}
            >

              <div className="px-5 py-3">
                <p className="text-sm font-semibold text-[#173675] leading-5">
                  {exam.title}
                </p>

                <p className="text-[10px] text-[#A4B1C8] mt-1">
                  {exam.group}
                </p>
              </div>

              <div className="px-5 flex flex-col items-center justify-center">

                <span className="text-xs text-[#8A98B2] font-medium mb-2">
                  {exam.submissions}
                </span>

                <div className="w-full max-w-[145px] h-[7px] bg-[#F0F2F5] rounded-full overflow-hidden">

                  <div
                    className="h-full bg-[#2CB9E8] rounded-full transition-all duration-500"
                    style={{
                      width: `${exam.submittedPercent}%`,
                    }}
                  />

                </div>

              </div>

              <div className="px-5 text-center">
                <span className="text-xs text-[#8A98B2] font-medium">
                  {exam.score}
                </span>
              </div>

              <div className="px-5 flex items-center justify-center">

                <button
                  type="button"
                  className="
                    text-[#173675]
                    text-xl
                    font-bold
                    tracking-[2px]
                    leading-none
                    hover:text-[#2CB9E8]
                    transition-colors
                    cursor-pointer
                  "
                  aria-label="Exam actions"
                >
                  •••
                </button>

              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}