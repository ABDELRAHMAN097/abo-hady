import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
  {
    title: "Welcome To Taleb Dashboard",
    description:
      "Your All-In-One Platform To Automate Exams, Track Student Progress, And Manage Your Wallet Anytime, Anywhere.",
  },
  {
    title: "Flexible Exam Builder",
    description:
      "Create, configure, and distribute online exams with ease and get instant automated grading.",
  },
  {
    title: "Analyze Data and Reports",
    description:
      "Gain deep insights into student performance and track key educational metrics with advanced reporting tools.",
  },
  {
    title: "Secure Wallet & Payments",
    description:
      "Easily manage your educational expenses, wallet balances, and subscriptions securely in one place.",
  },
];

export default function SlidesLayout() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-end p-16 text-white select-none">
      <div className="w-full max-w-2xl space-y-6">

        <div className="relative min-h-[150px] overflow-hidden">

          <AnimatePresence mode="wait">

            <motion.div
              key={currentSlide}
              initial={{
                opacity: 0,
                y: 35,
                filter: "blur(6px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -25,
                filter: "blur(5px)",
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="space-y-3"
            >

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.08,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  text-4xl
                  font-bold
                  tracking-wide
                  leading-tight
                "
              >
                {slides[currentSlide].title}
              </motion.h1>


              <motion.p
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.18,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  text-lg
                  text-gray-200
                  leading-relaxed
                  font-light
                  max-w-xl
                "
              >
                {slides[currentSlide].description}
              </motion.p>

            </motion.div>

          </AnimatePresence>

        </div>


        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.5,
          }}
          className="
            flex
            items-center
            justify-between
            pt-6
          "
        >

          <div className="flex items-center gap-2">

            {slides.map((_, index) => {
              const isActive = index === currentSlide;

              return (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  animate={{
                    width: isActive ? 40 : 10,
                    opacity: isActive ? 1 : 0.8,
                  }}
                  whileHover={{
                    scale: 1.15,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`
                    h-2
                    rounded-full
                    cursor-pointer
                    ${
                      isActive
                        ? "bg-blue-800"
                        : "bg-white hover:bg-white/90"
                    }
                  `}
                />
              );
            })}

          </div>


          <motion.button
            onClick={handleNext}
            whileHover={{
              scale: 1.04,
              y: -2,
            }}
            whileTap={{
              scale: 0.96,
              y: 0,
            }}
            className="
              bg-white
              text-blue-900
              font-bold
              px-10
              py-3
              rounded-xl
              shadow-md
              text-base
              cursor-pointer
              flex
              items-center
              gap-2
            "
          >

            <span>
              Next
            </span>

            {/* Arrow */}
            <motion.span
              animate={{
                x: [0, 4, 0],
              }}
              transition={{
                duration: 1.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              →
            </motion.span>

          </motion.button>

        </motion.div>

      </div>
    </div>
  );
}