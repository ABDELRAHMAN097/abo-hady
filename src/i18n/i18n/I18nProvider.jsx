import { Helmet } from "react-helmet-async";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ar from "./locales/ar.json";
import en from "./locales/en.json";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./constant";
import { I18nContext } from "./context";
import { ToastContainer } from "react-toastify";

const dictionary = { ar, en };

const isLocale = (value) => {
  return Boolean(value && SUPPORTED_LOCALES.includes(value));
};

const readFromObject = (
  target,
  path
) => {
  const chunks = path.split(".");
  let current = target;

  for (const chunk of chunks) {
    if (!current || typeof current !== "object") return undefined;
    current = current[chunk];
  }

  return typeof current === "string" ? current : undefined;
};

const normalizePath = (path) => {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
};

const seoByPath = {
  "": "home",
  "/": "home",

};

const descByPath = {
  "": "home",
  "/": "home",

};

const I18nProvider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { locale: rawLocale } = useParams();

  const isValidLocale = isLocale(rawLocale);
  const locale = isValidLocale ? rawLocale : DEFAULT_LOCALE;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const t = (key) => {
    const translation = readFromObject(
      dictionary[locale],
      key
    );
    if (translation) return translation;

    const fallback = readFromObject(
      dictionary[DEFAULT_LOCALE],
      key
    );
    return fallback ?? key;
  };

  const toLocalePath = (path) => {
    const normalized = normalizePath(path);
    if (!normalized || normalized === "/") return `/${locale}`;
    return `/${locale}${normalized}`;
  };

  const switchLocale = (nextLocale) => {
    if (nextLocale === locale) return;
    const segments = location.pathname.split("/").filter(Boolean);
    segments[0] = nextLocale;
    navigate(`/${segments.join("/")}${location.search}${location.hash}`);
  };

  const withoutLocale = `/${location.pathname
    .split("/")
    .filter(Boolean)
    .slice(1)
    .join("/")}`;

  // Normalize dynamic segments like /products/123 → /products/:id
  const normalizeDynamic = (path) => {
    return path
      .replace(/\/[0-9a-f-]{8,}(?=\/|$)/gi, "/:id")
      .replace(/\/[^/]+(:id|edit).*/, (m) => m);
  };

  const normalizedPath = normalizeDynamic(withoutLocale);
  const seoKey = seoByPath[withoutLocale] ?? seoByPath[normalizedPath] ?? "";
  const descKey =
    descByPath[withoutLocale] ?? descByPath[normalizedPath] ?? "seo.home";

  const title = `${t(seoKey)} | Taleb`;
  const description = t(descKey);

  if (!isValidLocale) {
    const segments = location.pathname.split("/").filter(Boolean);
    const rest = segments.length > 1 ? `/${segments.slice(1).join("/")}` : "";
    return (
      <Navigate
        to={`/${DEFAULT_LOCALE}${rest}${location.search}${location.hash}`}
        replace
      />
    );
  }

  return (
    <I18nContext.Provider
      value={{ locale, dir, t, toLocalePath, switchLocale }}
    >
      <Helmet key={`${locale}:${withoutLocale}`}>
        <html lang={locale} dir={dir} />
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <Outlet />
      <ToastContainer
        position="top-left"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={dir === "rtl"}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

    </I18nContext.Provider>
  );
};

export default I18nProvider;
