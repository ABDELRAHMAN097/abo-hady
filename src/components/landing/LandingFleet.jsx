import {
    FaCar,
    FaArrowLeft,
    FaArrowRight,
    FaExternalLinkAlt,
    FaGasPump,
    FaUsers,
    FaCog,
    FaTachometerAlt,
} from "react-icons/fa";

export default function LandingFleet({
    featuredCars,
    isArabic,
    onAction,
}) {
    return (
        <section
            id="fleet"
            className="py-20 sm:py-24 lg:py-28 bg-[#0B0C10] relative overflow-hidden"
        >
            <div className="absolute top-20 right-[5%] w-72 h-72 rounded-full bg-whatsapp/5 blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12 sm:mb-14">
                    <div>
                        <span className="text-whatsapp text-xs sm:text-sm font-semibold uppercase tracking-widest">
                            {isArabic
                                ? "أسطول السيارات"
                                : "Our Fleet"}
                        </span>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">
                            {isArabic
                                ? "اختر سيارتك القادمة"
                                : "Choose Your Next Ride"}
                        </h2>
                    </div>

                    <button
                        onClick={() =>
                            onAction("/booking")
                        }
                        className="text-whatsapp hover:text-emerald-300 font-semibold flex items-center gap-2 self-start sm:self-auto"
                    >
                        {isArabic
                            ? "احجز الآن"
                            : "Book Now"}

                        {isArabic ? (
                            <FaArrowLeft className="abu-arrow" />
                        ) : (
                            <FaArrowRight className="abu-arrow" />
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredCars.map(
                        (car, index) => {
                            const carImage =
                                car?.imageUrl ||
                                car?.image?.imageUrl ||
                                "";

                            const specs =
                                car?.specs || {};

                            return (
                                <div
                                    key={
                                        car.id ||
                                        `car-${index}`
                                    }
                                    className="abu-card group overflow-hidden rounded-2xl bg-[#1F2937] border border-white/5 hover:border-whatsapp/30"
                                >
                                    <div className="relative h-60 sm:h-64 overflow-hidden">
                                        {carImage ? (
                                            <img
                                                src={
                                                    carImage
                                                }
                                                alt={
                                                    car.name ||
                                                    "Luxury car"
                                                }
                                                className="abu-image w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#111827]">
                                                <FaCar className="text-5xl text-gray-700" />
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                                        {car.badge && (
                                            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-xs text-whatsapp">
                                                {
                                                    car.badge
                                                }
                                            </div>
                                        )}

                                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                                            <div>
                                                <p className="text-xs text-gray-300">
                                                    {
                                                        car.category
                                                    }
                                                </p>

                                                <h3 className="text-xl font-bold">
                                                    {
                                                        car.name
                                                    }
                                                </h3>
                                            </div>

                                            <div className="w-10 h-10 rounded-full bg-whatsapp text-black flex items-center justify-center">
                                                <FaExternalLinkAlt className="text-xs" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <FaUsers className="text-whatsapp" />

                                                <span>
                                                    {specs.passengers ||
                                                        "5"}{" "}
                                                    {isArabic
                                                        ? "مقاعد"
                                                        : "Seats"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FaCog className="text-whatsapp" />

                                                <span>
                                                    {specs.transmission ||
                                                        "Automatic"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FaGasPump className="text-whatsapp" />

                                                <span>
                                                    {specs.fuel ||
                                                        "Petrol"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FaTachometerAlt className="text-whatsapp" />

                                                <span>
                                                    {specs.power ||
                                                        "400 HP"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 mt-6 pt-5 border-t border-white/5">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                                                    {isArabic
                                                        ? "السعر"
                                                        : "Starting From"}
                                                </p>

                                                <span className="text-whatsapp font-bold">
                                                    {car.price ||
                                                        "Contact Us"}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    onAction(
                                                        "/booking"
                                                    )
                                                }
                                                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-whatsapp hover:text-black transition text-sm font-semibold"
                                            >
                                                {isArabic
                                                    ? "احجز"
                                                    : "Book"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>
        </section>
    );
}