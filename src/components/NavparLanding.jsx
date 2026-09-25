import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";
import { useState } from "react";

import { FiMenu, FiX } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";

import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/i18n/i18n/context";
import { logout as firebaseLogout } from "@/services/auth";

const NAV_ITEMS = [
    ["home", "nav.home", "Home"],
    ["services", "nav.services", "Services"],
    ["fleet", "nav.fleet", "Our Fleet"],
    ["gallery", "nav.gallery", "Gallery"],
    ["contact", "nav.contact", "Contact"],
];

export default function NavbarLanding({
    gallery = [],
    heroContent = {},
}) {
    const { locale = "en" } = useParams();
    const navigate = useNavigate();

    const {
        user,
        canAccessDashboard,
    } = useAuth();

    const { t } = useI18n();

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    const isArabic = locale === "ar";

    const navItems = NAV_ITEMS.filter(
        ([id]) =>
            id !== "gallery" ||
            gallery.length > 0
    );

    const closeMenu = () =>
        setMobileMenuOpen(false);

    const scrollToSection = (id) => {
        closeMenu();

        document
            .getElementById(id)
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    };

    const handleAction = (
        path = "/booking"
    ) => {
        closeMenu();

        if (/^https?:\/\//.test(path)) {
            window.open(
                path,
                "_blank",
                "noopener,noreferrer"
            );
            return;
        }

        const cleanPath = path.startsWith("/")
            ? path
            : `/${path}`;

        const target =
            `/${locale}${cleanPath}`;

        if (user) {
            navigate(target);
        } else {
            navigate(
                `/${locale}/login`,
                {
                    state: {
                        from: target,
                    },
                }
            );
        }
    };

    const handleLogout = async () => {
        try {
            await firebaseLogout();
        } catch (error) {
            console.error(
                "Logout error:",
                error
            );
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem(
                "talep_user"
            );

            navigate(
                `/${locale}/login`,
                { replace: true }
            );
        }
    };

    const bookButtonText =
        heroContent.buttonText ||
        t("nav.bookNow");

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/85 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Navbar */}

                <div className="flex h-20 items-center justify-between">

                    {/* Brand */}

                    <Link
                        to={`/${locale}`}
                        onClick={closeMenu}
                        className="flex shrink-0 items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-whatsapp shadow-lg shadow-whatsapp/20">
                            <FaCar className="text-xl text-background" />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-wide">
                                Abu Hady
                            </h1>

                            <p className="text-[9px] uppercase tracking-[0.2em] text-whatsapp sm:text-[10px]">
                                Luxury Car Rental
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}

                    <nav className="hidden items-center gap-7 lg:flex">
                        {navItems.map(
                            ([id, key, fallback]) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() =>
                                        scrollToSection(id)
                                    }
                                    className="text-sm text-gray-300 transition hover:text-whatsapp"
                                >
                                    {t(key) ||
                                        fallback}
                                </button>
                            )
                        )}
                    </nav>

                    {/* Desktop Actions */}

                    <div className="hidden items-center gap-3 md:flex">

                        <Link
                            to={`/${
                                isArabic
                                    ? "en"
                                    : "ar"
                            }`}
                            className="px-3 py-2 text-sm text-gray-300 transition hover:text-white"
                        >
                            {isArabic
                                ? "EN"
                                : "العربية"}
                        </Link>

                        {/* Login */}

                        {!user && (
                            <Link
                                to={`/${locale}/login`}
                                className="rounded-xl border border-white/10 bg-white/10 px-5 py-2.5 text-sm transition hover:bg-white/15"
                            >
                                {t("nav.login")}
                            </Link>
                        )}

                        {/* Dashboard */}

                        {user &&
                            canAccessDashboard && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/${locale}/dashboard`
                                        )
                                    }
                                    className="rounded-xl border border-white/10 bg-white/10 px-5 py-2.5 text-sm transition hover:bg-white/15"
                                >
                                    {t(
                                        "nav.dashboard"
                                    )}
                                </button>
                            )}

                        {/* Logout */}

                        {user && (
                            <button
                                type="button"
                                onClick={
                                    handleLogout
                                }
                                title={
                                    isArabic
                                        ? "تسجيل الخروج"
                                        : "Logout"
                                }
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-gray-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                            >
                                <RiLogoutBoxRLine className="h-5 w-5" />
                            </button>
                        )}

                        {/* Booking */}

                        <button
                            type="button"
                            onClick={() =>
                                handleAction(
                                    heroContent.buttonLink
                                )
                            }
                            className="rounded-xl bg-whatsapp px-5 py-2.5 font-semibold text-black shadow-lg shadow-whatsapp/20 transition hover:bg-whatsapp/80"
                        >
                            {bookButtonText}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}

                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenuOpen(
                                (open) => !open
                            )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <FiX size={22} />
                        ) : (
                            <FiMenu size={22} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}

                {mobileMenuOpen && (
                    <div className="border-t border-white/10 py-5 md:hidden">
                        <div className="flex flex-col gap-2">

                            {navItems.map(
                                ([id, key, fallback]) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() =>
                                            scrollToSection(
                                                id
                                            )
                                        }
                                        className="rounded-xl px-4 py-3 text-start text-gray-300 transition hover:bg-white/5 hover:text-white"
                                    >
                                        {t(key) ||
                                            fallback}
                                    </button>
                                )
                            )}

                            <Link
                                to={`/${
                                    isArabic
                                        ? "en"
                                        : "ar"
                                }`}
                                onClick={
                                    closeMenu
                                }
                                className="px-4 py-3 text-gray-300"
                            >
                                {isArabic
                                    ? "English"
                                    : "العربية"}
                            </Link>

                            <div className="grid grid-cols-2 gap-3 pt-3">

                                {/* Login */}

                                {!user && (
                                    <Link
                                        to={`/${locale}/login`}
                                        onClick={
                                            closeMenu
                                        }
                                        className="rounded-xl bg-white/10 py-3 text-center"
                                    >
                                        {t(
                                            "nav.login"
                                        )}
                                    </Link>
                                )}

                                {/* Dashboard */}

                                {user &&
                                    canAccessDashboard && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeMenu();
                                                navigate(
                                                    `/${locale}/dashboard`
                                                );
                                            }}
                                            className="rounded-xl bg-white/10 py-3 text-center"
                                        >
                                            {t(
                                                "nav.dashboard"
                                            )}
                                        </button>
                                    )}

                                {/* Booking */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAction(
                                            heroContent.buttonLink
                                        )
                                    }
                                    className="rounded-xl bg-whatsapp py-3 font-semibold text-black"
                                >
                                    {bookButtonText}
                                </button>
                            </div>

                            {/* Logout */}

                            {user && (
                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
                                    }
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-3 text-red-400 transition hover:bg-red-500/20"
                                >
                                    <RiLogoutBoxRLine className="h-5 w-5" />

                                    <span className="text-sm font-medium">
                                        {isArabic
                                            ? "تسجيل الخروج"
                                            : "Logout"}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

