

import { Outlet, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { pageTitles } from "../components/sidebarData";
import { useI18n } from "@/i18n/i18n/context";

export default function DashboardLayout({ children }) {
    const location = useLocation();
    const { locale } = useParams();
    const { t } = useI18n();

    const currentPage = location.pathname.split("/").pop();

    const currentTitle =
        t(`pages.${currentPage}`) ||
        t(currentPage) ||
        pageTitles[`/${currentPage}`]?.[locale] ||
        pageTitles["/dashboard"]?.[locale] ||
        "Dashboard";

    const [isSidebarOpen, setIsSidebarOpen] = useState(
        window.innerWidth >= 1024
    );

    useEffect(() => {
        const handleResize = () => {
            setIsSidebarOpen(window.innerWidth >= 1024);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="min-h-screen w-full flex">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <div
                className={`flex-1 min-w-0 min-h-screen flex flex-col transition-all duration-300 ${
                    isSidebarOpen ? "lg:ms-[270px]" : "lg:ms-[20px]"
                }`}
            >
                <TopNavbar
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                <section className="flex items-center mx-2 my-4 p-3 sm:p-2 bg-background border border-border rounded-t-lg shadow-sm">
                    <h2 className="text-base sm:text-lg md:text-2xl font-bold text-primary-color truncate">
                        {currentTitle}
                    </h2>
                </section>

                <main className="flex-1 px-2">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
}

