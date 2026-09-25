import { motion } from "framer-motion";
import NotificationCard from "./NotificationCard";

export default function NotificationSection({
  title,
  notifications,
  onTopUp
}) {
  if (!notifications.length) return null;

  return (
    <motion.section
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
        w-full
        min-w-0
        max-w-full
        space-y-2.5
      "
    >

      <div className="px-1">
        <h2
          className="
            text-[8px]
            sm:text-[9px]
            font-bold
            tracking-[0.18em]
            text-[#8A9AB3]
          "
        >
          {title}
        </h2>
      </div>

      <div className="w-full min-w-0 space-y-2">

        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full min-w-0"
          >
            <NotificationCard
              notification={notification}
              onTopUp={onTopUp}
            />
          </motion.div>
        ))}

      </div>

    </motion.section>
  );
}

























// import { motion } from "framer-motion";
// import NotificationCard from "./NotificationCard";

// export default function NotificationSection({
//   title,
//   notifications,
// }) {
//   if (!notifications.length) return null;

//   return (
//     <motion.section
//       initial={{
//         opacity: 0,
//       }}
//       animate={{
//         opacity: 1,
//       }}
//       transition={{
//         duration: 0.3,
//       }}
//       className="space-y-2.5"
//     >

//       {/* Section Title */}

//       <div className="px-1">

//         <h2
//           className="
//             text-[8px]
//             sm:text-[9px]
//             font-bold
//             tracking-[0.18em]
//             text-[#8A9AB3]
//           "
//         >
//           {title}
//         </h2>

//       </div>


//       {/* Notifications */}

//       <div className="space-y-2">

//         {notifications.map((notification, index) => (
//           <motion.div
//             key={notification.id}
//             initial={{
//               opacity: 0,
//               y: 15,
//             }}
//             animate={{
//               opacity: 1,
//               y: 0,
//             }}
//             transition={{
//               duration: 0.35,
//               delay: index * 0.08,
//               ease: [0.22, 1, 0.36, 1],
//             }}
//           >
//             <NotificationCard
//               notification={notification}
//             />
//           </motion.div>
//         ))}

//       </div>

//     </motion.section>
//   );
// }