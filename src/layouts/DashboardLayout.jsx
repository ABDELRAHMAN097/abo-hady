import {
    Outlet,
    useLocation,
    Link,
    useParams,
} from "react-router-dom";
import { LuCircleCheckBig } from "react-icons/lu";
import { AiOutlineSetting } from "react-icons/ai";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { pageTitles } from "../components/sidebarData";

export default function DashboardLayout() {
    const location = useLocation();

    // Get current language
    const { locale } = useParams();

    // Get current page from URL
    const currentPage = location.pathname.split("/").pop();

    const currentTitle =
        pageTitles[`/${currentPage}`] || "Dashboard";

    const isNotificationsPage =
        currentPage === "notifications";

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
        <div className="min-h-screen w-full max-w-full flex">

            
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />


            <div
                className={`flex-1 min-w-0 max-w-full flex flex-col min-h-screen transition-all duration-300
  ${isSidebarOpen ? "lg:ms-[270px]" : "lg:ms-[20px]"} ms-0`}
            >

                <TopNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

                <section
                    className="
          flex
          flex-col
          sm:flex-row
          sm:justify-between
          sm:items-center
          gap-1
          mx-2
          my-4
          p-3
          sm:p-2
          bg-background
          border
          border-border
          rounded-t-lg
          shadow-sm
        "
                >

                    

                    <div className="min-w-0">
                        <h2
                            className="
              text-base
              sm:text-lg
              md:text-2xl
              font-bold
              text-primary-color
              truncate
            "
                        >
                            {currentTitle}
                        </h2>
                    </div>

                    {isNotificationsPage ? (

                        <div className="flex items-center gap-2">

                            <button
                                className="
                flex
                items-center
                justify-center
                gap-2
                p-2
                px-3
                md:px-4
                text-gray-400
                hover:text-primary-color
                rounded-xl
                transition
                text-sm
                font-semibold
                cursor-pointer
              "
                            >
                                <LuCircleCheckBig className="text-xl font-semibold" />
                                <span>Mark All as Read</span>
                            </button>

                            <Link
                                to={`/${locale}/setting`}
                                className="
                 flex
                  items-center
                  justify-center
                  gap-2
                  p-2
                  px-3
                  md:px-4
                  border
                  border-gray-400
                  text-gray-400
                  hover:text-primary-color
                  hover:border-primary-color
                  rounded-xl
                  transition
                  text-xs
                  md:text-sm
                  font-semibold
                "
                            >
                                <AiOutlineSetting className="text-xl font-semibold" />

                                <span>Notification Settings</span>
                            </Link>

                        </div>

                    ) : (


                        <div>
                            <Link
                                to={`/${locale}/exams`}
                                className="
                  p-2
                  text-hover-color
                  border
                  border-hover-color
                  hover:bg-hover-color
                  hover:text-white
                  rounded-xl
                  inline-block
                  transition
                  text-sm
                  font-semibold
                "
                            >
                                + Create New Exam
                            </Link>
                        </div>

                    )}

                </section>


                <main className="flex-1 px-2">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}




