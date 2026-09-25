import {
    FaCar,
    FaUserTie,
    FaPlane,
    FaShieldAlt,
} from "react-icons/fa";

export default function LandingServices({
    services,
    locale,
    isArabic,
}) {
    /* =========================================================
       SERVICE ICONS
    ========================================================= */

    const getServiceIcon = (icon) => {
        const icons = {
            car: <FaCar />,
            driver: <FaUserTie />,
            airport: <FaPlane />,
            security: <FaShieldAlt />,
        };

        return icons[icon] || <FaCar />;
    };

    /* =========================================================
       SERVICES SECTION CONTENT
    ========================================================= */

    const content =
        services?.[locale] ||
        services?.en ||
        services?.ar ||
        {};

    /* =========================================================
       SERVICES CARDS
       Firestore stores cards as MAP
       Convert MAP -> ARRAY for rendering
    ========================================================= */

    const cards = services?.cards
        ? Object.values(services.cards)
        : [];

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <section
            id="services"
            className="relative overflow-hidden bg-[#111827] py-20 sm:py-24 lg:py-28"
        >
            {/* =====================================================
                BACKGROUND DECORATION
            ===================================================== */}

            <div
                className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-whatsapp/5 blur-3xl"
                aria-hidden="true"
            />

            <div
                className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-whatsapp/5 blur-3xl"
                aria-hidden="true"
            />

            {/* =====================================================
                CONTENT CONTAINER
            ===================================================== */}

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* =================================================
                    SECTION HEADER
                ================================================= */}

                <div
                    className={`mb-12 max-w-2xl sm:mb-14 ${
                        isArabic
                            ? "text-right"
                            : "text-left"
                    }`}
                >
                    {/* EYEBROW */}

                    {content.eyebrow && (
                        <span className="text-whatsapp text-xs font-semibold uppercase tracking-widest sm:text-sm">
                            {content.eyebrow}
                        </span>
                    )}

                    {/* TITLE */}

                    {content.title && (
                        <h2 className="mt-3 text-3xl font-bold leading-tight text-text-primary sm:text-4xl lg:text-5xl">
                            {content.title}
                        </h2>
                    )}

                    {/* DESCRIPTION */}

                    {content.description && (
                        <p className="mt-5 leading-7 text-gray-400">
                            {content.description}
                        </p>
                    )}
                </div>

                {/* =================================================
                    SERVICES CARDS
                ================================================= */}

                {cards.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">

                        {cards.map(
                            (
                                service,
                                index
                            ) => {

                                /* =================================
                                   CARD LANGUAGE CONTENT
                                ================================= */

                                const serviceContent =
                                    service?.[
                                        locale
                                    ] ||
                                    service?.en ||
                                    service?.ar ||
                                    {};

                                return (
                                    <article
                                        key={
                                            service?.id ||
                                            `service-${index}`
                                        }
                                        dir={
                                            isArabic
                                                ? "rtl"
                                                : "ltr"
                                        }
                                        className="abu-card group relative overflow-hidden rounded-2xl border border-white/5 bg-[#1F2937] p-6 sm:p-7 hover:border-whatsapp/30"
                                    >

                                        {/* =================================
                                           CARD GLOW
                                        ================================= */}

                                        <div
                                            className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-whatsapp/5 blur-3xl transition-all duration-500 group-hover:bg-whatsapp/10"
                                            aria-hidden="true"
                                        />

                                        {/* =================================
                                           TOP
                                        ================================= */}

                                        <div className="relative z-10 flex items-start justify-between">

                                            {/* ICON */}

                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-whatsapp/10 text-xl text-whatsapp transition-all duration-300 group-hover:bg-whatsapp group-hover:text-black group-hover:scale-105">
                                                {getServiceIcon(
                                                    service?.icon
                                                )}
                                            </div>

                                            {/* NUMBER */}

                                            <span className="text-4xl font-bold leading-none text-gray-600/70 transition-colors duration-300 group-hover:text-whatsapp/20">
                                                {String(
                                                    index +
                                                        1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>
                                        </div>

                                        {/* =================================
                                           TITLE
                                        ================================= */}

                                        <h3 className="relative z-10 mt-6 text-xl font-bold text-text-primary">
                                            {
                                                serviceContent.title
                                            }
                                        </h3>

                                        {/* =================================
                                           DESCRIPTION
                                        ================================= */}

                                        <p className="relative z-10 mt-3 leading-7 h-18 text-gray-400">
                                            {
                                                serviceContent.description
                                            }
                                        </p>

                                        {/* =================================
                                           ANIMATED LINE
                                        ================================= */}

                                        <div className="relative z-10 mt-6 h-px w-full overflow-hidden bg-white/5">

                                            <div className="absolute inset-y-0 left-0 w-1/3 bg-whatsapp/60 abu-shimmer" />

                                        </div>

                                    </article>
                                );
                            }
                        )}

                    </div>
                ) : (
                    /* =============================================
                       EMPTY STATE
                    ============================================= */

                    <div className="rounded-2xl border border-dashed border-white/10 bg-[#1F2937]/50 px-6 py-12 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-whatsapp/10 text-xl text-whatsapp">
                            <FaCar />
                        </div>

                        <p className="mt-4 text-sm text-gray-400">
                            {isArabic
                                ? "لا توجد خدمات متاحة حالياً."
                                : "No services available at the moment."}
                        </p>

                    </div>
                )}

            </div>
        </section>
    );
}