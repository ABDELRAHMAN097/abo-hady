import axios from "axios";

const FALLBACK_API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export const getBaseURL = () =>
    window.API_BASE_URL || FALLBACK_API_BASE_URL;

export const baseURL = getBaseURL();

export const axiosInstance = axios.create({
    baseURL: FALLBACK_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use((config) => {
    config.baseURL = getBaseURL();

    if (typeof window !== "undefined") {
        const pathLocale = window.location.pathname.split("/")[1];
        const supportedLocales = ["ar", "en"];
        const locale = supportedLocales.includes(pathLocale)
            ? pathLocale
            : localStorage.getItem("lng") || "ar";
        config.headers["Accept-Language"] = locale;
    }

    config.params = {
        ...config.params,
    };

    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                const pathname = window.location.pathname;
                const pathLocale = pathname.split("/")[1];
                const supportedLocales = ["ar", "en"];
                const locale = supportedLocales.includes(pathLocale) ? pathLocale : "ar";
                
                // Clear invalid token & user data to prevent future requests from sending stale credentials
                localStorage.removeItem("talep_user");
                localStorage.removeItem("token");

                // Check if current URL is an auth/guest path (login page or other auth sub-routes)
                const segments = pathname.split("/").filter(Boolean);
                const isAuthPath = 
                    segments.length === 0 || 
                    (segments.length === 1 && (segments[0] === "ar" || segments[0] === "en")) ||
                    pathname.includes("/register") || 
                    pathname.includes("/forgot-password") || 
                    pathname.includes("/reset-password") || 
                    pathname.includes("/verify-code") || 
                    pathname.includes("/select-role");

                if (!isAuthPath) {
                    window.location.href = `/${locale}`;
                }
            }
        }
        return Promise.reject(error);
    },
);