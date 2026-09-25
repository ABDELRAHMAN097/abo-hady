import {
    FaStar,
    FaArrowLeft,
    FaArrowRight,
    FaChevronDown,
} from "react-icons/fa";

export default function LandingHero({
    hero,
    heroContent,
    heroImage,
    isArabic,
    onAction,
    onScroll,
}) {
    return (
        <>
            <style>
                {`
                    @keyframes floatSlow {
                        0%, 100% {
                            transform: translate3d(0, 0, 0);
                        }

                        50% {
                            transform: translate3d(0, -18px, 0);
                        }
                    }

                    @keyframes floatReverse {
                        0%, 100% {
                            transform: translate3d(0, 0, 0);
                        }

                        50% {
                            transform: translate3d(0, 16px, 0);
                        }
                    }

                    @keyframes pulseGlow {
                        0%, 100% {
                            opacity: .25;
                            transform: scale(.95);
                        }

                        50% {
                            opacity: .55;
                            transform: scale(1.08);
                        }
                    }

                    @keyframes bounceArrow {
                        0%, 100% {
                            transform: translateX(0);
                        }

                        50% {
                            transform: translateX(6px);
                        }
                    }

                    .abu-float {
                        animation: floatSlow 5s ease-in-out infinite;
                    }

                    .abu-float-reverse {
                        animation: floatReverse 6s ease-in-out infinite;
                    }

                    .abu-pulse {
                        animation: pulseGlow 4s ease-in-out infinite;
                    }

                    .abu-arrow {
                        animation: bounceArrow 1.4s ease-in-out infinite;
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .abu-float,
                        .abu-float-reverse,
                        .abu-pulse,
                        .abu-arrow {
                            animation: none !important;
                        }
                    }
                `}
            </style>

            <section
                id="home"
                className="relative min-h-[720px] lg:min-h-screen flex items-center pt-20 overflow-hidden"
            >
                <div className="absolute inset-0">
                    <img
                        src={heroImage}
                        alt={
                            hero?.image?.alt ||
                            "Abu Hady Luxury Car"
                        }
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/65" />

                    <div
                        className={`absolute inset-0 ${
                            isArabic
                                ? "bg-gradient-to-l"
                                : "bg-gradient-to-r"
                        } from-[#0B0C10] via-[#0B0C10]/80 to-transparent`}
                    />
                </div>

                <div className="absolute top-32 right-[8%] w-24 h-24 rounded-full border border-whatsapp/20 abu-float opacity-50" />

                <div className="absolute bottom-32 right-[18%] w-10 h-10 rounded-full bg-whatsapp/10 blur-sm abu-float-reverse" />

                <div className="absolute top-[35%] left-[7%] w-20 h-20 rounded-full bg-whatsapp/10 blur-2xl abu-pulse" />

                <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-whatsapp/10 border border-whatsapp/20 text-whatsapp text-xs sm:text-sm mb-6 backdrop-blur-md">
                            <FaStar className="text-xs" />

                            <span>
                                {isArabic
                                    ? "تجربة قيادة استثنائية"
                                    : "Premium Driving Experience"}
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                            {heroContent.title ||
                                (isArabic
                                    ? "الفخامة تبدأ هنا."
                                    : "Drive Luxury.")}

                            <span className="block text-whatsapp mt-3">
                                {heroContent.subtitle ||
                                    (isArabic
                                        ? "استمتع بتجربة استثنائية."
                                        : "Experience Excellence.")}
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base sm:text-lg text-gray-300 leading-8">
                            {heroContent.description ||
                                (isArabic
                                    ? "اكتشف مجموعة مميزة من السيارات الفاخرة واستمتع بتجربة قيادة لا تُنسى."
                                    : "Discover our premium collection of luxury cars and enjoy an exceptional driving experience.")}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-9">
                            <button
                                onClick={() =>
                                    onAction(
                                        heroContent.buttonLink
                                    )
                                }
                                className="group px-7 py-4 rounded-xl bg-whatsapp hover:bg-emerald-600 text-black font-bold transition flex items-center justify-center gap-3 shadow-xl shadow-whatsapp/20"
                            >
                                {heroContent.buttonText ||
                                    (isArabic
                                        ? "احجز سيارتك الآن"
                                        : "Book Your Car")}

                                {isArabic ? (
                                    <FaArrowLeft className="group-hover:-translate-x-1 transition" />
                                ) : (
                                    <FaArrowRight className="group-hover:translate-x-1 transition" />
                                )}
                            </button>

                            <button
                                onClick={() =>
                                    onScroll("fleet")
                                }
                                className="px-7 py-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition font-semibold backdrop-blur-md"
                            >
                                {isArabic
                                    ? "استكشف السيارات"
                                    : "Explore Fleet"}
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-12 max-w-xl">
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold">
                                    10+
                                </p>

                                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                    {isArabic
                                        ? "سيارات فاخرة"
                                        : "Luxury Cars"}
                                </p>
                            </div>

                            <div>
                                <p className="text-2xl sm:text-3xl font-bold">
                                    500+
                                </p>

                                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                    {isArabic
                                        ? "عميل سعيد"
                                        : "Happy Clients"}
                                </p>
                            </div>

                            <div>
                                <p className="text-2xl sm:text-3xl font-bold">
                                    24/7
                                </p>

                                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                    {isArabic
                                        ? "دعم متواصل"
                                        : "Support"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() =>
                        onScroll("services")
                    }
                    className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 hover:text-whatsapp transition"
                >
                    <span className="text-[10px] uppercase tracking-[.3em]">
                        {isArabic
                            ? "اكتشف"
                            : "Discover"}
                    </span>

                    <FaChevronDown className="abu-float" />
                </button>
            </section>
        </>
    );
}