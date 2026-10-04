import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component
 * Ensures that whenever the route pathname changes, the window scroll position
 * resets to the very top (0, 0) instantly without flickering.
 * Also handles anchor hashes (e.g. #services) and disables the browser's
 * automatic scroll restoration to avoid sticking to previous page scroll positions.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  // Prevent browser's native scroll restoration from keeping old scroll offsets
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    // If there is an anchor hash in the URL, scroll to that element
    if (hash) {
      const targetId = hash.replace("#", "");
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Reset scroll to top instantly
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Secondary frame check in case of layout shifts or async renders
    const frameId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    return () => cancelAnimationFrame(frameId);
  }, [pathname, hash]);

  return null;
}
