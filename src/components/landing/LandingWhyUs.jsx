import {
    FaCheckCircle,
    FaStar,
} from "react-icons/fa";

export default function LandingWhyUs({
    isArabic,
    heroImage,
}) {
    const features = [
        isArabic
            ? "سيارات فاخرة"
            : "Premium Vehicles",

        isArabic
            ? "خدمة احترافية"
            : "Professional Service",

        isArabic
            ? "دعم على مدار الساعة"
            : "24/7 Support",

        isArabic
            ? "حجز سهل وسريع"
            : "Easy & Fast Booking",
    ];

    return (
        <section className="py-20 sm:py-24 lg:py-28 bg-[#0B0C10] relative overflow-hidden">
            <div className="absolute -right-40 top-1/2 w-96 h-96 rounded-full bg-whatsapp/5 blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
                    <div>
                        <span className="text-whatsapp text-xs sm:text-sm font-semibold uppercase tracking-widest">
                            {isArabic
                                ? "لماذا أبو هادي؟"
                                : "Why Abu Hady"}
                        </span>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 leading-tight">
                            {isArabic
                                ? "الفخامة تبدأ من أول لحظة"
                                : "Luxury Starts From The First Moment"}
                        </h2>

                        <p className="text-gray-400 mt-6 leading-8">
                            {isArabic
                                ? "نحرص على تقديم تجربة متكاملة تجمع بين السيارات المميزة والخدمة الاحترافية والمرونة."
                                : "We combine premium vehicles, professional service and flexibility to deliver a complete luxury rental experience."}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-5 mt-8">
                            {features.map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3"
                                    >
                                        <FaCheckCircle className="text-whatsapp shrink-0" />

                                        <span className="text-gray-300">
                                            {item}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-5 bg-whatsapp/10 blur-3xl rounded-full abu-pulse" />

                        <div className="relative rounded-3xl overflow-hidden border border-white/10 group">
                            <img
                                src={heroImage}
                                alt="Abu Hady Luxury"
                                className="abu-image w-full h-[300px] sm:h-[380px] lg:h-[420px] object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs text-whatsapp uppercase tracking-widest">
                                            Abu Hady
                                        </p>

                                        <h3 className="text-2xl font-bold">
                                            {isArabic
                                                ? "تجربة لا تُنسى"
                                                : "An Unforgettable Experience"}
                                        </h3>
                                    </div>

                                    <div className="w-12 h-12 rounded-full bg-whatsapp text-black flex items-center justify-center">
                                        <FaStar />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}