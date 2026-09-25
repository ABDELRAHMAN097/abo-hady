import { motion } from "framer-motion";

const tabs = [
  {
    id: "all",
    label: "All",
    count: 3,
  },
  {
    id: "exams",
    label: "Exams & Assessments",
    count: 2,
  },
  {
    id: "students",
    label: "Students",
    count: 1,
  },
  {
    id: "wallet",
    label: "Wallet & Billing",
    count: 0,
  },
  {
    id: "system",
    label: "System",
    count: 0,
  },
];

export default function NotificationTabs({
  activeTab,
  setActiveTab,
}) {
  return (
    <div
      className="
        w-full
        max-w-full
        bg-white
        border
        border-gray-100
        overflow-x-auto
        overflow-y-hidden
        scrollbar-hide
      "
    >
      <div className="flex items-center w-max min-w-full">

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="
                relative
                shrink-0
                flex
                items-center
                gap-1
                sm:gap-1.5
                px-3
                sm:px-4
                md:px-5
                py-2.5
                sm:py-3
                text-[9px]
                sm:text-xs
                md:text-sm
                font-semibold
                text-[#334155]
                cursor-pointer
                whitespace-nowrap
              "
            >

              {isActive && (
                <motion.div
                  layoutId="activeNotificationTab"
                  className="
                    absolute
                    left-0
                    right-0
                    bottom-0
                    h-[2px]
                    bg-[#38BDF8]
                  "
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <span>
                {tab.label}
              </span>

              <span
                className={`
                  flex
                  items-center
                  justify-center
                  shrink-0
                  min-w-[14px]
                  h-[14px]
                  px-1
                  rounded-full
                  text-[7px]
                  ${
                    isActive
                      ? "bg-[#E0F2FE] text-[#0284C7]"
                      : "bg-[#F1F5F9] text-[#64748B]"
                  }
                `}
              >
                {tab.count}
              </span>

            </button>
          );
        })}

      </div>
    </div>
  );
}

// import { motion } from "framer-motion";

// const tabs = [
//   {
//     id: "all",
//     label: "All",
//     count: 3,
//   },
//   {
//     id: "exams",
//     label: "Exams & Assessments",
//     count: 2,
//   },
//   {
//     id: "students",
//     label: "Students",
//     count: 1,
//   },
//   {
//     id: "wallet",
//     label: "Wallet & Billing",
//     count: 0,
//   },
//   {
//     id: "system",
//     label: "System",
//     count: 0,
//   },
// ];

// export default function NotificationTabs({
//   activeTab,
//   setActiveTab,
// }) {
//   return (
//     <div
//       className="
//         w-full
//         bg-white
//         border
//         border-gray-100
//         rounded-none
//         sm:rounded-sm
//         overflow-x-auto
//         scrollbar-hide
//       "
//     >
//       <div className="flex items-center min-w-max">

//         {tabs.map((tab) => {
//           const isActive = activeTab === tab.id;

//           return (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className="
//                 relative
//                 flex
//                 items-center
//                 gap-1.5
//                 px-3
//                 sm:px-5
//                 py-3
//                 text-lg
//                 sm:text-xl
//                 font-semibold
//                 text-[#334155]
//                 cursor-pointer
//                 whitespace-nowrap
//               "
//             >

//               {isActive && (
//                 <motion.div
//                   layoutId="activeNotificationTab"
//                   className="
//                     absolute
//                     left-0
//                     right-0
//                     bottom-0
//                     h-[2px]
//                     bg-[#38BDF8]
//                   "
//                   transition={{
//                     type: "spring",
//                     stiffness: 400,
//                     damping: 30,
//                   }}
//                 />
//               )}

//               <span>
//                 {tab.label}
//               </span>

//               <span
//                 className={`
//                   flex
//                   items-center
//                   justify-center
//                   min-w-[15px]
//                   h-[15px]
//                   px-1
//                   rounded-full
//                   text-[7px]
//                   ${
//                     isActive
//                       ? "bg-[#E0F2FE] text-[#0284C7]"
//                       : "bg-[#F1F5F9] text-[#64748B]"
//                   }
//                 `}
//               >
//                 {tab.count}
//               </span>

//             </button>
//           );
//         })}

//       </div>
//     </div>
//   );
// }