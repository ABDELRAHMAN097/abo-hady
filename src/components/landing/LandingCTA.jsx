import {
    FaCalendarAlt,
    FaArrowLeft,
    FaArrowRight,
} from "react-icons/fa";

export default function LandingCTA({
    isArabic,
    heroContent,
    onAction,
}) {
    return (
        <section
            id="contact"
            className="py-16 sm:py-20 lg:py-24"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-whatsapp p-7 sm:p-10 lg:p-16 text-black">
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/20 rounded-full blur-3xl abu-pulse" />

                    <div className="absolute -bottom-32 -left-20 w-64 h-64 border border-black/10 rounded-full abu-rotate" />

                    <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4">
                                <FaCalendarAlt />

                                <span>
                                    {isArabic
                                        ? "جاهز للانطلاق؟"
                                        : "Ready To Drive?"}
                                </span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                                {isArabic
                                    ? "جاهز لتجربة قيادة مختلفة؟"
                                    : "Ready For A Different Driving Experience?"}
                            </h2>

                            <p className="mt-4 text-black/70 leading-7">
                                {isArabic
                                    ? "احجز سيارتك الآن واستمتع بتجربة أبو هادي."
                                    : "Book your car today and experience Abu Hady Luxury."}
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                onAction(
                                    heroContent.buttonLink ||
                                        "/booking"
                                )
                            }
                            className="shrink-0 px-7 py-4 rounded-xl bg-black text-white hover:bg-[#111827] transition font-bold flex items-center justify-center gap-3"
                        >
                            {heroContent.buttonText ||
                                (isArabic
                                    ? "ابدأ الحجز"
                                    : "Start Booking")}

                            {isArabic ? (
                                <FaArrowLeft />
                            ) : (
                                <FaArrowRight />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}