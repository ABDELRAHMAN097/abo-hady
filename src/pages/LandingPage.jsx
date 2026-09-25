import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import NavbarLanding from "../components/NavparLanding";
import { FaCar } from "react-icons/fa";

import { useAuth } from "@/context/AuthContext";
import {
    subscribeToLandingPage,
    getCachedLandingData,
} from "@/services/landing";

import LandingHero from "../components/landing/LandingHero";
import LandingServices from "../components/landing/LandingServices";
import LandingFleet from "../components/landing/LandingFleet";
import LandingGallery from "../components/landing/LandingGallery";
import LandingWhyUs from "../components/landing/LandingWhyUs";
import LandingCTA from "../components/landing/LandingCTA";
import LandingFooter from "../components/landing/LandingFooter";

/* =========================================================
   STATIC DEMO DATA (FALLBACK)
========================================================= */

const demoFeaturedCars = [
    {
        id: "car-1",
        name: "Mercedes-Benz S-Class",
        category: "Luxury Sedan",
        price: "2,500 EGP / Day",
        imageUrl:
            "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=90",
        specs: {
            passengers: "5",
            transmission: "Automatic",
            fuel: "Petrol",
            power: "429 HP",
        },
        badge: "Executive",
    },
    {
        id: "car-2",
        name: "BMW M4 Competition",
        category: "Sport Coupe",
        price: "3,200 EGP / Day",
        imageUrl:
            "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1400&q=90",
        specs: {
            passengers: "4",
            transmission: "Automatic",
            fuel: "Petrol",
            power: "503 HP",
        },
        badge: "Performance",
    },
    {
        id: "car-3",
        name: "Range Rover Sport",
        category: "Luxury SUV",
        price: "3,500 EGP / Day",
        imageUrl:
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=90",
        specs: {
            passengers: "5",
            transmission: "Automatic",
            fuel: "Petrol",
            power: "355 HP",
        },
        badge: "Premium SUV",
    },
    {
        id: "car-4",
        name: "Porsche 911 Carrera",
        category: "Sports Car",
        price: "4,000 EGP / Day",
        imageUrl:
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=90",
        specs: {
            passengers: "2",
            transmission: "Automatic",
            fuel: "Petrol",
            power: "379 HP",
        },
        badge: "Iconic",
    },
    {
        id: "car-5",
        name: "Mercedes AMG GT",
        category: "Grand Tourer",
        price: "4,500 EGP / Day",
        imageUrl:
            "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=90",
        specs: {
            passengers: "2",
            transmission: "Automatic",
            fuel: "Petrol",
            power: "523 HP",
        },
        badge: "AMG",
    },
    {
        id: "car-6",
        name: "BMW X7",
        category: "Luxury SUV",
        price: "3,800 EGP / Day",
        imageUrl:
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=90",
        specs: {
            passengers: "7",
            transmission: "Automatic",
            fuel: "Petrol",
            power: "375 HP",
        },
        badge: "Family Luxury",
    },
];

const demoGallery = [
    {
        id: "gallery-1",
        title: "Mercedes S-Class",
        category: "Luxury",
        imageUrl:
            "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=90",
    },
    {
        id: "gallery-2",
        title: "BMW M4",
        category: "Performance",
        imageUrl:
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=90",
    },
    {
        id: "gallery-3",
        title: "Porsche 911",
        category: "Sports",
        imageUrl:
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=90",
    },
    {
        id: "gallery-4",
        title: "Range Rover",
        category: "SUV",
        imageUrl:
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=90",
    },
    {
        id: "gallery-5",
        title: "Mercedes AMG",
        category: "AMG",
        imageUrl:
            "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=90",
    },
    {
        id: "gallery-6",
        title: "BMW Luxury",
        category: "Executive",
        imageUrl:
            "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1400&q=90",
    },
    {
        id: "gallery-7",
        title: "Luxury Drive",
        category: "Premium",
        imageUrl:
            "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1400&q=90",
    },
    {
        id: "gallery-8",
        title: "Urban Luxury",
        category: "City",
        imageUrl:
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=90",
    },
];

/* =========================================================
   PAGE
========================================================= */

export default function LandingPage() {
    const { locale = "en" } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const isArabic = locale === "ar";

    // Immediate hydration from cache to prevent layout shift & save reads
    const [landing, setLanding] = useState(() => getCachedLandingData());
    const [loading, setLoading] = useState(() => !getCachedLandingData());

    /* =========================================================
       FIREBASE REALTIME SUBSCRIPTION
    ========================================================= */

    useEffect(() => {
        const unsubscribe = subscribeToLandingPage(
            (data) => {
                setLanding(data);
                setLoading(false);
            },
            (error) => {
                console.error("Landing page realtime error:", error);
                setLoading(false);
            }
        );

        return () => {
            unsubscribe?.();
        };
    }, []);

    /* =========================================================
       DATA EXTRACTION
    ========================================================= */

    const hero = landing?.hero || {};

    const heroContent =
        hero?.[locale] ||
        hero?.en ||
        hero?.ar ||
        {};

    const services =
        landing?.services &&
        typeof landing.services === "object" &&
        !Array.isArray(landing.services)
            ? landing.services
            : {
                  ar: { eyebrow: "", title: "", description: "" },
                  en: { eyebrow: "", title: "", description: "" },
                  cards: {},
              };

    const featuredCars =
        Array.isArray(landing?.featuredCars) && landing.featuredCars.length > 0
            ? landing.featuredCars
            : demoFeaturedCars;

    const gallery =
        Array.isArray(landing?.gallery) && landing.gallery.length > 0
            ? landing.gallery
            : demoGallery;

    const heroImage =
        hero?.image?.imageUrl ||
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=90";

    /* =========================================================
       ACTIONS
    ========================================================= */

    const handleAction = (path = "/booking") => {
        const targetPath = path || "/booking";

        if (
            targetPath.startsWith("http://") ||
            targetPath.startsWith("https://")
        ) {
            window.open(targetPath, "_blank", "noopener,noreferrer");
            return;
        }

        const cleanPath = targetPath.startsWith("/")
            ? targetPath
            : `/${targetPath}`;

        if (user) {
            navigate(`/${locale}${cleanPath}`);
        } else {
            navigate(`/${locale}/login`, {
                state: { from: `/${locale}${cleanPath}` },
            });
        }
    };

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    /* =========================================================
       LOADING STATE
    ========================================================= */

    if (loading && !landing) {
        return (
            <div
                dir={isArabic ? "rtl" : "ltr"}
                className="flex min-h-screen items-center justify-center bg-background text-white"
            >
                <div className="flex flex-col items-center gap-4 px-6 text-center">
                    <div className="relative">
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-whatsapp/10 border-t-whatsapp" />
                        <FaCar className="absolute inset-0 m-auto text-lg text-whatsapp" />
                    </div>

                    <p className="text-gray-400">
                        {isArabic
                            ? "جاري تحميل تجربة أبو هادي..."
                            : "Loading Abu Hady Experience..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            dir={isArabic ? "rtl" : "ltr"}
            className="min-h-screen overflow-x-hidden bg-background text-white"
        >
            <NavbarLanding
                gallery={gallery}
                heroContent={heroContent}
            />

            <main>
                <LandingHero
                    hero={hero}
                    heroContent={heroContent}
                    heroImage={heroImage}
                    isArabic={isArabic}
                    onAction={handleAction}
                    onScroll={scrollToSection}
                />

                <LandingServices
                    services={services}
                    locale={locale}
                    isArabic={isArabic}
                />

                <LandingFleet
                    featuredCars={featuredCars}
                    isArabic={isArabic}
                    onAction={handleAction}
                />

                <LandingGallery
                    gallery={gallery}
                    isArabic={isArabic}
                />

                <LandingWhyUs
                    isArabic={isArabic}
                    heroImage={heroImage}
                />

                <LandingCTA
                    isArabic={isArabic}
                    heroContent={heroContent}
                    onAction={handleAction}
                />
            </main>

            <LandingFooter
                isArabic={isArabic}
                onScroll={scrollToSection}
            />
        </div>
    );
}