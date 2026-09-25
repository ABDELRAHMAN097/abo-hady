import { motion } from "framer-motion";
import { LuBell } from "react-icons/lu";

export default function EmptyNotifications() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        w-full
        min-h-[230px]
        sm:min-h-[260px]
        bg-white
        border
        border-[#D9DEE7]
        rounded-xl
        flex
        flex-col
        items-center
        justify-center
        text-center
        px-4
        py-10
      "
    >
      {/* Bell Icon */}
      <div className="relative mb-4">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.1,
          }}
          className="
            w-12
            h-12
            sm:w-14
            sm:h-14
            rounded-full
            bg-[#F0F9FF]
            flex
            items-center
            justify-center
          "
        >
          <LuBell
            className="
              w-6
              h-6
              sm:w-7
              sm:h-7
              text-[#38BDF8]
            "
          />
        </motion.div>

        {/* Small dot */}
        <span
          className="
            absolute
            top-0
            right-0
            w-2
            h-2
            rounded-full
            bg-[#38BDF8]
            border-2
            border-white
          "
        />
      </div>

      {/* Title */}
      <h2
        className="
          text-sm
          sm:text-base
          font-bold
          text-[#16356F]
        "
      >
        No Notifications
      </h2>

      {/* Description */}
      <p
        className="
          mt-2
          max-w-[320px]
          text-[9px]
          sm:text-[10px]
          leading-5
          text-[#64748B]
        "
      >
        You're all caught up! Transactions, top-up
        <br className="hidden sm:block" />
        receipts, and balance alerts will appear here
        <br className="hidden sm:block" />
        when they occur.
      </p>

      {/* Button */}
      <motion.button
        whileHover={{
          scale: 1.03,
        }}
        whileTap={{
          scale: 0.97,
        }}
        className="
          mt-5
          px-5
          py-2
          rounded-md
          border
          border-[#38BDF8]
          text-[#0EA5E9]
          bg-white
          text-[9px]
          sm:text-[10px]
          font-semibold
          hover:bg-[#F0F9FF]
          transition
          cursor-pointer
        "
      >
        View Transaction History
      </motion.button>
    </motion.div>
  );
}