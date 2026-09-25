import { motion, AnimatePresence } from "framer-motion";
import { LuCheck } from "react-icons/lu";

export default function PaymentSuccessModal({
  amount,
  newBalance,
  onClose,
}) {
  return (
    <AnimatePresence>
      <motion.div
        className="
          fixed
          inset-0
          z-[1000]
          flex
          items-center
          justify-center
          p-4
        "
      >

        {/* Backdrop */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            absolute
            inset-0
            bg-black/60
            backdrop-blur-[2px]
          "
        />


        {/* Modal */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.85,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.85,
            y: 20,
          }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            z-10
            w-full
            max-w-[330px]
            bg-white
            rounded-xl
            shadow-2xl
            px-5
            sm:px-7
            py-7
            sm:py-8
            text-center
          "
        >

          {/* Success Icon */}

          <motion.div
            initial={{
              scale: 0,
              rotate: -30,
            }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 15,
              delay: 0.1,
            }}
            className="
              mx-auto
              w-12
              h-12
              sm:w-14
              sm:h-14
              rounded-full
              bg-[#DCFCE7]
              flex
              items-center
              justify-center
            "
          >
            <LuCheck
              className="
                w-6
                h-6
                sm:w-7
                sm:h-7
                text-[#16A34A]
                stroke-[3]
              "
            />
          </motion.div>


          {/* Title */}

          <h2
            className="
              mt-4
              text-base
              sm:text-lg
              font-bold
              text-[#16356F]
            "
          >
            Wallet Recharged
            <br />
            Successfully!
          </h2>


          {/* Description */}

          <p
            className="
              mt-2
              text-[9px]
              sm:text-[10px]
              leading-5
              text-[#64748B]
            "
          >
            Added{" "}
            <span className="font-bold text-[#16356F]">
              ${Number(amount).toFixed(2)}
            </span>{" "}
            to your wallet.
            <br />
            Your new balance is{" "}
            <span className="font-bold text-[#16356F]">
              ${Number(newBalance).toFixed(2)}
            </span>
            .
          </p>


          {/* Back Button */}

          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={onClose}
            className="
              mt-5
              w-full
              h-9
              rounded-md
              bg-[#38BDF8]
              hover:bg-[#0EA5E9]
              text-white
              text-[9px]
              font-bold
              transition
              cursor-pointer
            "
          >
            Back to Dashboard
          </motion.button>


          {/* Download Receipt */}

          <motion.button
            whileHover={{
              backgroundColor: "#F8FAFC",
            }}
            className="
              mt-1
              w-full
              h-9
              rounded-md
              text-[#0EA5E9]
              text-[8px]
              sm:text-[9px]
              font-semibold
              transition
              cursor-pointer
            "
          >
            Download Receipt (PDF)
          </motion.button>

        </motion.div>

      </motion.div>
    </AnimatePresence>
  );
}