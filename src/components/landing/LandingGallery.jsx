import {
    FaCar,
    FaExternalLinkAlt,
} from "react-icons/fa";

export default function LandingGallery({
    gallery,
    isArabic,
}) {
    return (
        <section
            id="gallery"
            className="py-20 sm:py-24 lg:py-32 bg-[#111827] relative overflow-hidden"
        >
            <style>
                {`
                    @keyframes marqueeLTR {
                        from {
                            transform: translateX(0);
                        }

                        to {
                            transform: translateX(-50%);
                        }
                    }

                    @keyframes marqueeRTL {
                        from {
                            transform: translateX(-50%);
                        }

                        to {
                            transform: translateX(0);
                        }
                    }

                    .abu-marquee-ltr {
                        animation: marqueeLTR 32s linear infinite;
                    }

                    .abu-marquee-rtl {
                        animation: marqueeRTL 38s linear infinite;
                    }

                    .abu-marquee-ltr:hover,
                    .abu-marquee-rtl:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-[10%] w-72 h-72 bg-whatsapp/5 blur-3xl rounded-full abu-pulse" />

                <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-whatsapp/5 blur-3xl rounded-full abu-pulse" />

                <div className="absolute top-1/2 left-1/2 w-96 h-96 border border-whatsapp/5 rounded-full -translate-x-1/2 -translate-y-1/2 abu-rotate" />
            </div>

            <div className="relative z-10 mb-14 sm:mb-16 text-center px-4">
                <span className="text-whatsapp text-xs sm:text-sm font-semibold uppercase tracking-[.3em]">
                    {isArabic
                        ? "عالم أبو هادي"
                        : "Abu Hady World"}
                </span>

                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mt-4">
                    {isArabic
                        ? "الفخامة تتحرك أمامك"
                        : "Luxury In Motion"}
                </h2>

                <p className="max-w-2xl mx-auto text-gray-400 leading-7 mt-5">
                    {isArabic
                        ? "استكشف مجموعة من السيارات المصممة لمن يبحث عن تجربة مختلفة."
                        : "Explore a moving collection of vehicles designed for people who expect something different."}
                </p>
            </div>

            <div className="relative w-full overflow-hidden mb-5">
                <div className="flex w-max abu-marquee-ltr">
                    {[...gallery, ...gallery].map(
                        (item, index) => {
                            const imageUrl =
                                item?.imageUrl ||
                                item?.image?.imageUrl;

                            return (
                                <div
                                    key={`gallery-row-1-${index}`}
                                    className="relative shrink-0 w-[250px] sm:w-[320px] lg:w-[390px] h-[190px] sm:h-[230px] lg:h-[260px] mx-2 overflow-hidden rounded-2xl group"
                                >
                                    <img
                                        src={
                                            imageUrl
                                        }
                                        alt={
                                            item.title ||
                                            "Abu Hady Luxury"
                                        }
                                        className="abu-image w-full h-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                                    <div className="absolute inset-x-0 bottom-0 p-5">
                                        <p className="text-xs text-whatsapp uppercase tracking-widest">
                                            {
                                                item.category
                                            }
                                        </p>

                                        <h3 className="text-lg sm:text-xl font-bold mt-1">
                                            {
                                                item.title
                                            }
                                        </h3>
                                    </div>

                                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                        <FaExternalLinkAlt className="text-xs" />
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>

            <div className="relative z-20 flex justify-center -my-2 sm:-my-4">
                <div className="abu-float relative px-6 sm:px-8 py-3 rounded-full bg-[#0B0C10]/90 border border-whatsapp/20 backdrop-blur-xl shadow-2xl shadow-black/30">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-whatsapp animate-pulse" />

                        <span className="text-xs sm:text-sm text-gray-300">
                            {isArabic
                                ? "أسطول يتحرك مع ذوقك"
                                : "A fleet that moves with your style"}
                        </span>

                        <FaCar className="text-whatsapp" />
                    </div>
                </div>
            </div>

            <div className="relative w-full overflow-hidden mt-5">
                <div className="flex w-max abu-marquee-rtl">
                    {[
                        ...gallery
                            .slice()
                            .reverse(),
                        ...gallery
                            .slice()
                            .reverse(),
                    ].map((item, index) => {
                        const imageUrl =
                            item?.imageUrl ||
                            item?.image?.imageUrl;

                        return (
                            <div
                                key={`gallery-row-2-${index}`}
                                className="relative shrink-0 w-[220px] sm:w-[290px] lg:w-[350px] h-[170px] sm:h-[210px] lg:h-[235px] mx-2 overflow-hidden rounded-2xl group"
                            >
                                <img
                                    src={imageUrl}
                                    alt={
                                        item.title ||
                                        "Abu Hady Luxury"
                                    }
                                    className="abu-image w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />

                                <div className="absolute bottom-0 inset-x-0 p-4">
                                    <span className="text-xs text-gray-300">
                                        {
                                            item.category
                                        }
                                    </span>

                                    <h3 className="font-bold mt-1">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}