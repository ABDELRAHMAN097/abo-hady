import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoNotificationsOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
const notifications = [
  {
    id: 1,
    title: "New exam submission",
    message: "Ahmed submitted the Maths exam.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "New student registered",
    message: "A new student has joined your class.",
    time: "15 min ago",
    unread: true,
  },
  {
    id: 3,
    title: "Exam completed",
    message: "English exam has been completed.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 4,
    title: "Payment received",
    message: "You received a new payment.",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 5,
    title: "Exam reminder",
    message: "Your Biology exam starts tomorrow.",
    time: "5 hours ago",
    unread: false,
  },
  {
    id: 6,
    title: "New subscription",
    message: "Your subscription has been updated.",
    time: "Yesterday",
    unread: false,
  },
];

export default function DropdownNotificat() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { locale } = useParams();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const latestNotifications = notifications.slice(0, 5);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{
          scale: 1.04,
        }}
        whileTap={{
          scale: 0.92,
        }}
        animate={{
          rotate: isOpen ? [0, -8, 8, -4, 4, 0] : 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="
          relative
          bg-[#F8F8F8]
          p-2.5
          border
          border-gray-200
          rounded-xl
          cursor-pointer
          hover:bg-gray-100
          transition-colors
          focus:outline-none
        "
      >
        <IoNotificationsOutline
          className="
            text-[#94A3B8]
            w-3.5
            h-3.5
            md:w-5
            md:h-5
          "
        />

        {/* Notification Dot */}

        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
            }}
            className="
              absolute
              top-2
              right-2
              w-2
              h-2
              rounded-full
              bg-red-500
              border
              border-[#F8F8F8]
            "
          />
        )}
      </motion.button>


      {/* ================= DROPDOWN ================= */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 0.96,
            }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              transformOrigin: "top right",
            }}
            className="
              absolute
              right-0
              top-full
              mt-3
              w-[360px]
              max-w-[calc(100vw-2rem)]
              bg-white
              rounded-2xl
              border
              border-gray-100
              shadow-xl
              overflow-hidden
              z-50
            "
          >

            {/* ================= HEADER ================= */}

            <div
              className="
                flex
                items-center
                justify-between
                px-5
                py-4
                border-b
                border-gray-100
              "
            >
              <div>
                <h3 className="text-base font-bold text-[#11255C]">
                  Notifications
                </h3>

                <p className="text-xs text-gray-400 mt-0.5">
                  Your latest notifications
                </p>
              </div>

              <motion.span
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 0.1,
                }}
                className="
                  text-xs
                  font-semibold
                  text-[#11255C]
                  bg-[#EEF2FF]
                  px-2.5
                  py-1
                  rounded-full
                "
              >
                {unreadCount} New
              </motion.span>
            </div>


            {/* ================= NOTIFICATIONS ================= */}

            <div className="max-h-[360px] overflow-y-auto">

              {latestNotifications.map((notification, index) => (
                <motion.button
                  key={notification.id}
                  initial={{
                    opacity: 0,
                    x: 15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.05 + index * 0.06,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    backgroundColor: "#F8FAFC",
                  }}
                  className="
                    w-full
                    flex
                    items-start
                    gap-3
                    px-5
                    py-4
                    text-left
                    border-b
                    border-gray-50
                    cursor-pointer
                  "
                >

                  {/* Notification Icon */}

                  <motion.div
                    whileHover={{
                      scale: 1.08,
                    }}
                    className="
                      w-9
                      h-9
                      shrink-0
                      rounded-full
                      bg-[#EEF2FF]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <IoNotificationsOutline
                      className="w-4 h-4 text-[#11255C]"
                    />
                  </motion.div>


                  {/* Notification Content */}

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-2">

                      <h4
                        className="
                          text-sm
                          font-semibold
                          text-gray-800
                          truncate
                        "
                      >
                        {notification.title}
                      </h4>

                      {/* Unread Dot */}

                      {notification.unread && (
                        <motion.span
                          initial={{
                            scale: 0,
                          }}
                          animate={{
                            scale: 1,
                          }}
                          className="
                            w-1.5
                            h-1.5
                            shrink-0
                            rounded-full
                            bg-red-500
                          "
                        />
                      )}

                    </div>

                    <p
                      className="
                        text-xs
                        text-gray-500
                        mt-1
                        line-clamp-1
                      "
                    >
                      {notification.message}
                    </p>

                    <span
                      className="
                        block
                        text-[11px]
                        text-gray-400
                        mt-1.5
                      "
                    >
                      {notification.time}
                    </span>

                  </div>

                </motion.button>
              ))}

            </div>


            {/* ================= VIEW ALL ================= */}

            <motion.button
            onClick={() => {
              setIsOpen(false);
              navigate(`/${locale}/notifications`);
            }}
              whileHover={{
                backgroundColor: "#F8FAFC",
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="
                w-full
                py-4
                text-sm
                font-semibold
                text-[#11255C]
                border-t
                border-gray-100
                cursor-pointer
              "
            >
              View All Notifications
            </motion.button>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}