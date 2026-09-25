import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX } from "react-icons/lu";
import { FaApple } from "react-icons/fa";

export default function TopUpWalletModal({
  onClose,
  onSuccess,
}) {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("card");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const amount = customAmount
    ? Number(customAmount)
    : selectedAmount;

  const total = amount + 7.5;

  const handleAmountSelect = (value) => {
    setSelectedAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value;

    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handlePayment = (e) => {
    e.preventDefault();

    // Fake payment
    onSuccess({
      amount,
      newBalance: 62.5,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="
          fixed
          inset-0
          z-[999]
          flex
          items-center
          justify-center
          p-3
          sm:p-5
          md:p-8
        "
      >

        {/* Backdrop */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
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
            scale: 0.94,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.94,
            y: 20,
          }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            z-10
            w-full
            max-w-[430px]
            sm:max-w-[500px]
            max-h-[92vh]
            overflow-y-auto
            bg-white
            rounded-xl
            shadow-2xl
          "
        >

          {/* Header */}

          <div
            className="
              flex
              items-center
              justify-between
              px-5
              sm:px-6
              py-4
              border-b
              border-[#E5EAF1]
            "
          >
            <div>
              <h2
                className="
                  text-base
                  sm:text-lg
                  font-bold
                  text-[#16356F]
                "
              >
                Top Up Your Wallet
              </h2>

              <p
                className="
                  mt-0.5
                  text-[8px]
                  sm:text-[9px]
                  text-[#7C8CA5]
                "
              >
                Add funds to keep your exams running
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                flex
                items-center
                justify-center
                w-8
                h-8
                rounded-lg
                text-[#64748B]
                hover:bg-gray-100
                hover:text-[#16356F]
                transition
                cursor-pointer
              "
            >
              <LuX className="w-4 h-4" />
            </button>
          </div>


          {/* Content */}

          <form
            onSubmit={handlePayment}
            className="
              p-4
              sm:p-5
              md:p-6
              space-y-4
            "
          >

            {/* Current Balance */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                bg-[#F0F9FF]
                border
                border-[#D5EFFF]
                rounded-lg
                px-4
                py-3
              "
            >
              <div>
                <p
                  className="
                    text-[7px]
                    uppercase
                    font-semibold
                    tracking-wide
                    text-[#7C8CA5]
                  "
                >
                  Current Balance
                </p>

                <p
                  className="
                    mt-0.5
                    text-sm
                    font-bold
                    text-[#16356F]
                  "
                >
                  12.50 EGP
                </p>
              </div>

              <span
                className="
                  shrink-0
                  px-2
                  py-1
                  rounded-full
                  bg-[#F59E0B]
                  text-white
                  text-[6px]
                  sm:text-[7px]
                  font-bold
                "
              >
                LOW BALANCE
              </span>
            </div>


            {/* Recharge Amount */}

            <div>

              <label
                className="
                  block
                  mb-2
                  text-[8px]
                  sm:text-[9px]
                  font-bold
                  uppercase
                  text-[#16356F]
                "
              >
                Select Recharge Amount
              </label>


              <div className="grid grid-cols-3 gap-2">

                {[20, 50, 100].map((value) => {

                  const isSelected =
                    selectedAmount === value &&
                    !customAmount;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        handleAmountSelect(value)
                      }
                      className={`
                        relative
                        min-h-[58px]
                        sm:min-h-[64px]
                        px-3
                        py-2
                        text-left
                        rounded-lg
                        border
                        transition-all
                        cursor-pointer
                        ${
                          isSelected
                            ? "border-[#38BDF8] bg-[#F0F9FF]"
                            : "border-[#D9E1EB] bg-white hover:border-[#94A3B8]"
                        }
                      `}
                    >

                      {value === 50 && (
                        <span
                          className="
                            absolute
                            -top-2
                            right-2
                            px-1.5
                            py-0.5
                            rounded-full
                            bg-[#38BDF8]
                            text-white
                            text-[5px]
                            font-bold
                          "
                        >
                          RECOMMENDED
                        </span>
                      )}

                      <p
                        className={`
                          text-[9px]
                          sm:text-[10px]
                          font-bold
                          ${
                            isSelected
                              ? "text-[#0284C7]"
                              : "text-[#16356F]"
                          }
                        `}
                      >
                        {value} EGP
                      </p>

                      <p
                        className="
                          mt-1
                          text-[6px]
                          sm:text-[7px]
                          text-[#94A3B8]
                        "
                      >
                        +100 Submissions
                      </p>

                    </button>
                  );
                })}

              </div>


              {/* Custom Amount */}

              <div className="relative mt-2">

                <span
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-[8px]
                    font-semibold
                    text-[#64748B]
                  "
                >
                  EGP
                </span>

                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={handleCustomAmount}
                  placeholder="Enter custom amount"
                  className="
                    w-full
                    h-9
                    sm:h-10
                    pl-10
                    pr-3
                    rounded-lg
                    border
                    border-[#D9E1EB]
                    outline-none
                    text-[9px]
                    text-[#16356F]
                    placeholder:text-[#94A3B8]
                    focus:border-[#38BDF8]
                    focus:ring-2
                    focus:ring-[#38BDF8]/10
                    transition
                  "
                />

              </div>

            </div>


            {/* Payment Method */}

            <div>

              <label
                className="
                  block
                  mb-2
                  text-[8px]
                  sm:text-[9px]
                  font-bold
                  uppercase
                  text-[#16356F]
                "
              >
                Payment Method
              </label>


              <div className="grid grid-cols-3 gap-2">

                {/* Apple Pay */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("apple")
                  }
                  className={`
                    h-9
                    sm:h-10
                    rounded-lg
                    border
                    flex
                    items-center
                    justify-center
                    gap-1
                    cursor-pointer
                    transition
                    ${
                      paymentMethod === "apple"
                        ? "border-[#38BDF8] bg-[#F0F9FF]"
                        : "border-[#D9E1EB]"
                    }
                  `}
                >
                  <FaApple className="w-3 h-3" />

                  <span className="text-[8px] font-semibold">
                    Pay
                  </span>
                </button>


                {/* Card */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                  className={`
                    h-9
                    sm:h-10
                    rounded-lg
                    border
                    flex
                    items-center
                    justify-center
                    gap-1
                    cursor-pointer
                    transition
                    ${
                      paymentMethod === "card"
                        ? "border-[#38BDF8] bg-[#F0F9FF]"
                        : "border-[#D9E1EB]"
                    }
                  `}
                >
                  <span
                    className="
                      text-[9px]
                      sm:text-[10px]
                      font-black
                      italic
                      text-[#1D4ED8]
                    "
                  >
                    VISA
                  </span>

                  <span
                    className="
                      text-[7px]
                      font-bold
                      text-[#EF4444]
                    "
                  >
                    ●
                  </span>
                </button>


                {/* Fawry */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("fawry")
                  }
                  className={`
                    h-9
                    sm:h-10
                    rounded-lg
                    border
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                    transition
                    ${
                      paymentMethod === "fawry"
                        ? "border-[#38BDF8] bg-[#F0F9FF]"
                        : "border-[#D9E1EB]"
                    }
                  `}
                >
                  <span
                    className="
                      text-[6px]
                      font-bold
                      text-[#64748B]
                    "
                  >
                    FAWRY
                  </span>
                </button>

              </div>

            </div>


            {/* Card Details */}

            {paymentMethod === "card" && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  overflow-hidden
                  bg-[#F8FAFC]
                  border
                  border-[#E2E8F0]
                  rounded-lg
                  p-3
                  sm:p-4
                  space-y-2
                "
              >

                <div>

                  <label
                    className="
                      block
                      mb-1
                      text-[6px]
                      sm:text-[7px]
                      font-bold
                      uppercase
                      text-[#64748B]
                    "
                  >
                    Card Number
                  </label>

                  <input
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(e.target.value)
                    }
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                    className="
                      w-full
                      h-8
                      sm:h-9
                      px-2.5
                      rounded-md
                      border
                      border-[#CBD5E1]
                      bg-white
                      outline-none
                      text-[8px]
                      sm:text-[9px]
                      text-[#334155]
                      focus:border-[#38BDF8]
                    "
                  />

                </div>


                <div className="grid grid-cols-2 gap-2">

                  <div>

                    <label
                      className="
                        block
                        mb-1
                        text-[6px]
                        sm:text-[7px]
                        font-bold
                        uppercase
                        text-[#64748B]
                      "
                    >
                      Expiry (MM/YY)
                    </label>

                    <input
                      value={expiry}
                      onChange={(e) =>
                        setExpiry(e.target.value)
                      }
                      placeholder="09/26"
                      className="
                        w-full
                        h-8
                        sm:h-9
                        px-2.5
                        rounded-md
                        border
                        border-[#CBD5E1]
                        bg-white
                        outline-none
                        text-[8px]
                        sm:text-[9px]
                        text-[#334155]
                        focus:border-[#38BDF8]
                      "
                    />

                  </div>


                  <div>

                    <label
                      className="
                        block
                        mb-1
                        text-[6px]
                        sm:text-[7px]
                        font-bold
                        uppercase
                        text-[#64748B]
                      "
                    >
                      CVV
                    </label>

                    <input
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value)
                      }
                      placeholder="•••"
                      type="password"
                      className="
                        w-full
                        h-8
                        sm:h-9
                        px-2.5
                        rounded-md
                        border
                        border-[#CBD5E1]
                        bg-white
                        outline-none
                        text-[8px]
                        sm:text-[9px]
                        text-[#334155]
                        focus:border-[#38BDF8]
                      "
                    />

                  </div>

                </div>

              </motion.div>
            )}


            {/* Summary */}

            <div
              className="
                rounded-lg
                border
                border-[#D9E1EB]
                bg-[#F8FAFC]
                p-3
                sm:p-4
              "
            >

              <div className="flex justify-between items-center">

                <span
                  className="
                    text-[7px]
                    sm:text-[8px]
                    text-[#64748B]
                  "
                >
                  Top-Up Amount
                </span>

                <span
                  className="
                    text-[8px]
                    sm:text-[9px]
                    font-semibold
                    text-[#334155]
                  "
                >
                  ${amount || 0}.00
                </span>

              </div>


              <div
                className="
                  flex
                  justify-between
                  items-center
                  mt-2
                "
              >

                <span
                  className="
                    text-[8px]
                    sm:text-[9px]
                    font-bold
                    text-[#16356F]
                  "
                >
                  Total Payable:
                </span>

                <span
                  className="
                    text-[10px]
                    sm:text-[11px]
                    font-bold
                    text-[#16356F]
                  "
                >
                  ${total.toFixed(2)}
                </span>

              </div>

            </div>


            {/* Pay Button */}

            <motion.button
              whileHover={{
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.98,
              }}
              type="submit"
              className="
                w-full
                h-10
                sm:h-11
                rounded-lg
                bg-[#38BDF8]
                hover:bg-[#0EA5E9]
                text-white
                text-[9px]
                sm:text-[10px]
                font-bold
                transition
                cursor-pointer
                shadow-sm
              "
            >
              Pay ${total.toFixed(2)} & Recharge Wallet
            </motion.button>

          </form>

        </motion.div>

      </motion.div>
    </AnimatePresence>
  );
}