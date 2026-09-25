import { motion } from "framer-motion";

export default function NotificationCard({
  notification,
  onTopUp
}) {
  const {
      icon: Icon,
      title,
      description,
      descriptionBefore,
      descriptionAfter,
      balance,
      time,
      type = "default",
      action,
      score,
      group,
  } = notification;

  const styles = {
    exam: {
      container: "bg-[#F0F9FF] border-[#4DB8FF]",
      icon: "bg-[#DDEEFF] text-[#2563EB]",
      accent: "bg-[#38BDF8]",
      title: "text-[#16356F]",
    },

    wallet: {
      container: "bg-[#FFFBEF] border-[#F3D77A]",
      icon: "bg-[#FFF1C7] text-[#F59E0B]",
      accent: "bg-[#F59E0B]",
      title: "text-[#26385D]",
    },

    student: {
      container: "bg-white border-[#D9DEE7]",
      icon: "bg-[#F1E5FF] text-[#9333EA]",
      accent: "bg-[#A855F7]",
      title: "text-[#16356F]",
    },

    system: {
      container: "bg-white border-[#D9DEE7]",
      icon: "bg-[#DCFCE7] text-[#16A34A]",
      accent: "bg-[#22C55E]",
      title: "text-[#16356F]",
    },

    default: {
      container: "bg-white border-[#D9DEE7]",
      icon: "bg-gray-100 text-gray-600",
      accent: "bg-gray-400",
      title: "text-[#16356F]",
    },
  };

  const currentStyle = styles[type] || styles.default;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        relative
        overflow-hidden
        w-full
        min-w-0
        border
        rounded-xl
        ${currentStyle.container}
      `}
    >

      <motion.div
        initial={{
          scaleY: 0,
        }}
        animate={{
          scaleY: 1,
        }}
        transition={{
          duration: 0.45,
          delay: 0.1,
        }}
        style={{
          originY: 0,
        }}
        className={`
          absolute
          left-0
          top-0
          bottom-0
          w-[3px]
          ${currentStyle.accent}
        `}
      />

      <div className="p-3 sm:p-4 md:p-5">

        <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">

          <motion.div
            whileHover={{
              scale: 1.08,
              rotate: 3,
            }}
            className={`
              shrink-0
              w-8
              h-8
              sm:w-9
              sm:h-9
              md:w-10
              md:h-10
              rounded-lg
              flex
              items-center
              justify-center
              ${currentStyle.icon}
            `}
          >
            <Icon
              className="
                w-3.5
                h-3.5
                sm:w-4
                sm:h-4
                md:w-5
                md:h-5
              "
            />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div
              className="
                flex
                flex-col
                gap-0.5
                sm:flex-row
                sm:items-start
                sm:justify-between
                sm:gap-3
              "
            >

              <h3
                className={`
                  min-w-0
                  text-[10px]
                  sm:text-xs
                  md:text-sm
                  font-bold
                  leading-4
                  sm:leading-5
                  break-words
                  ${currentStyle.title}
                `}
              >
                {title}
              </h3>

              <span
                className="
                  shrink-0
                  text-[6px]
                  sm:text-[7px]
                  md:text-[8px]
                  uppercase
                  font-semibold
                  text-[#7C8CA5]
                  whitespace-nowrap
                "
              >
                {time}
              </span>

            </div>

            <p
            className="
              mt-1
              text-[9px]
              sm:text-[10px]
              md:text-[11px]
              leading-4
              sm:leading-5
              text-[#64748B]
              break-words
            "
          >
            {descriptionBefore}{" "}

            {balance && (
              <span className="font-bold text-red-500">
                {balance}
              </span>
            )}{" "}

            {descriptionAfter}
          </p>

            {score && (
              <p
                className="
                  mt-1
                  text-[9px]
                  sm:text-[10px]
                  md:text-[11px]
                  leading-4
                  text-[#64748B]
                  break-words
                "
              >
                Score:{" "}

                <span className="font-bold text-[#10B981]">
                  {score}
                </span>

                {group && (
                  <>
                    {" "}
                    <span>•</span>{" "}
                    {group}
                  </>
                )}
              </p>
            )}


            {/* Action */}

            {action && (
              <motion.button
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={() => {
                if (notification.type === "wallet") {
                  onTopUp?.();
                }
              }}
                className={`
                  mt-2.5
                  sm:mt-3
                  inline-flex
                  items-center
                  gap-1.5
                  cursor-pointer
                  max-w-full
                  ${
                    action.variant === "link"
                      ? "text-[#0EA5E9] text-[8px] sm:text-[9px] font-semibold hover:underline"
                      : action.variant === "outline"
                      ? "px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md bg-white border border-[#CBD5E1] text-[#334155] hover:bg-gray-50 text-[8px] sm:text-[9px] md:text-[10px] font-semibold"
                      : "px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md bg-[#38BDF8] text-white hover:bg-[#0EA5E9] text-[8px] sm:text-[9px] md:text-[10px] font-semibold"
                  }
                `}
              >
                {action.label}

                {action.arrow && (
                  <span className="text-[10px] sm:text-xs">
                    →
                  </span>
                )}
              </motion.button>
            )}

          </div>

        </div>

      </div>

    </motion.div>
  );
}