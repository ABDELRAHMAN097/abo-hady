import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
    onSnapshot,
} from "firebase/firestore";

import { db } from "../config/firebase";

const landingRef = doc(db, "landingPage", "settings");

/* =========================================================
   CACHE SETTINGS (Preserving Firebase reads & quota)
========================================================= */

const CACHE_KEY = "abuhady_landing_cache_v2";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache TTL

let memoryCache = null;
let memoryCacheTimestamp = 0;

/* =========================================================
   DEFAULT LANDING DATA
========================================================= */

export const defaultLandingData = {
    hero: {
        ar: {
            title: "الفخامة تبدأ من هنا.",
            subtitle: "استمتع بتجربة قيادة استثنائية.",
            description:
                "اكتشف مجموعتنا المميزة من السيارات الفاخرة واستمتع بتجربة تأجير تناسب احتياجاتك.",
            buttonText: "احجز سيارتك",
            buttonLink: "/booking",
        },

        en: {
            title: "Drive Luxury.",
            subtitle: "Experience Excellence.",
            description:
                "Discover our premium collection of luxury cars and enjoy an exceptional driving experience.",
            buttonText: "Book a Car",
            buttonLink: "/booking",
        },

        image: {
            imageUrl: "",
            publicId: "",
            alt: "",
        },
    },

    services: {
        ar: {
            eyebrow: "خدماتنا",
            title: "خدمات مصممة لتجربة استثنائية",
            description:
                "نقدم لك مجموعة متكاملة من الخدمات التي تجعل كل رحلة أكثر راحة وفخامة.",
        },

        en: {
            eyebrow: "Our Services",
            title: "Services designed for an exceptional experience",
            description:
                "A complete range of services designed to make every journey more comfortable and luxurious.",
        },

        cards: {
            "service-1": {
                id: "service-1",
                icon: "car",
                ar: {
                    title: "تأجير سيارات فاخرة",
                    description:
                        "مجموعة مميزة من السيارات الفاخرة لتناسب جميع احتياجاتك.",
                },
                en: {
                    title: "Luxury Car Rental",
                    description:
                        "A premium fleet of luxury cars designed for every occasion.",
                },
            },

            "service-2": {
                id: "service-2",
                icon: "driver",
                ar: {
                    title: "سائق خاص",
                    description:
                        "خدمة سائق احترافية تمنحك الراحة والخصوصية طوال رحلتك.",
                },
                en: {
                    title: "Private Chauffeur",
                    description:
                        "Professional chauffeur service built around comfort and privacy.",
                },
            },

            "service-3": {
                id: "service-3",
                icon: "airport",
                ar: {
                    title: "استقبال من المطار",
                    description:
                        "انتقال فاخر ومريح من وإلى المطار في الوقت المناسب.",
                },
                en: {
                    title: "Airport Transfer",
                    description:
                        "Premium airport transfers with punctual and comfortable service.",
                },
            },
        },
    },

    featuredCars: [],
    gallery: [],
};

/* =========================================================
   NORMALIZE LANDING DATA
========================================================= */

export const normalizeLandingData = (data = {}) => {
    return {
        ...defaultLandingData,
        ...data,

        hero: {
            ...defaultLandingData.hero,
            ...(data.hero || {}),

            ar: {
                ...defaultLandingData.hero.ar,
                ...(data.hero?.ar || {}),
            },

            en: {
                ...defaultLandingData.hero.en,
                ...(data.hero?.en || {}),
            },

            image: {
                ...defaultLandingData.hero.image,
                ...(data.hero?.image || {}),
            },
        },

        services: {
            ...defaultLandingData.services,
            ...(data.services || {}),

            ar: {
                ...defaultLandingData.services.ar,
                ...(data.services?.ar || {}),
            },

            en: {
                ...defaultLandingData.services.en,
                ...(data.services?.en || {}),
            },

            cards: {
                ...defaultLandingData.services.cards,
                ...(data.services?.cards || {}),
            },
        },

        featuredCars: Array.isArray(data.featuredCars)
            ? data.featuredCars
            : [],

        gallery: Array.isArray(data.gallery)
            ? data.gallery
            : [],
    };
};

/* =========================================================
   LOCAL / STORAGE CACHE HELPERS
========================================================= */

const getStorageCache = () => {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            return parsed.data;
        }
    } catch {
        // ignore parse/storage errors
    }
    return null;
};

const setStorageCache = (data) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
                timestamp: Date.now(),
                data,
            })
        );
    } catch {
        // storage quota full or disabled
    }
};

export const getCachedLandingData = () => {
    if (memoryCache && Date.now() - memoryCacheTimestamp < CACHE_TTL_MS) {
        return memoryCache;
    }
    const stored = getStorageCache();
    if (stored) {
        memoryCache = stored;
        memoryCacheTimestamp = Date.now();
        return stored;
    }
    return null;
};

export const invalidateLandingCache = () => {
    memoryCache = null;
    memoryCacheTimestamp = 0;
    if (typeof window !== "undefined") {
        try {
            localStorage.removeItem(CACHE_KEY);
        } catch {
            // ignore
        }
    }
};

/* =========================================================
   GET LANDING PAGE (CACHED - MINIMIZES FIRESTORE READS)
========================================================= */

export const getLandingPage = async ({ forceRefresh = false } = {}) => {
    // 1. Check Cache first to avoid consuming Firestore read quota
    if (!forceRefresh) {
        const cached = getCachedLandingData();
        if (cached) {
            return cached;
        }
    }

    try {
        const snapshot = await getDoc(landingRef);

        const normalized = snapshot.exists()
            ? normalizeLandingData(snapshot.data())
            : defaultLandingData;

        // 2. Store in Memory and Storage Cache
        memoryCache = normalized;
        memoryCacheTimestamp = Date.now();
        setStorageCache(normalized);

        return normalized;
    } catch (error) {
        console.error("Error fetching landing page:", error);
        // Fallback to cache even if slightly stale, to keep site working offline
        const stale = memoryCache || getStorageCache();
        if (stale) return stale;
        return defaultLandingData;
    }
};

/* =========================================================
   SAVE LANDING PAGE
========================================================= */

export const saveLandingPage = async (data) => {
    try {
        const normalizedData = normalizeLandingData(data);

        await setDoc(
            landingRef,
            {
                ...normalizedData,
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );

        // Update local caches immediately
        memoryCache = normalizedData;
        memoryCacheTimestamp = Date.now();
        setStorageCache(normalizedData);

        // Notify active windows/components
        if (typeof window !== "undefined") {
            window.dispatchEvent(
                new CustomEvent("landingPageUpdated", {
                    detail: normalizedData,
                })
            );
        }

        return true;
    } catch (error) {
        console.error("Error saving landing page:", error);
        throw error;
    }
};

/* =========================================================
   REAL-TIME LANDING PAGE (WITH INITIAL CACHE EMIT)
========================================================= */

export const subscribeToLandingPage = (callback, onError) => {
    // Immediately emit cached data to avoid visual loading lag
    const cached = getCachedLandingData();
    if (cached) {
        callback(cached);
    }

    return onSnapshot(
        landingRef,
        (snapshot) => {
            const data = snapshot.exists()
                ? normalizeLandingData(snapshot.data())
                : defaultLandingData;

            memoryCache = data;
            memoryCacheTimestamp = Date.now();
            setStorageCache(data);

            callback(data);
        },
        (error) => {
            console.error("Landing realtime error:", error);
            if (onError) onError(error);
        }
    );
};