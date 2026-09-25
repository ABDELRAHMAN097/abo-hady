import { Navigate } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import RoleGuard from "@/components/common/RoleGuard";

import ForgotPassword from "@/pages/auth/ForgotPassword";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyCode from "@/pages/auth/VerifyCode";
import SelectRole from "@/pages/auth/SelectRole";

import Dashboard from "@/pages/dashboard/Dashboard";
import Users from "@/pages/dashboard/Users";
import TeacherProfile from "@/pages/dashboard/TeacherProfile";
import Exams from "@/pages/dashboard/Exams";
import Setting from "@/pages/dashboard/Setting";
import Notification from "@/pages/dashboard/Notifications";
import LandingPage from "@/pages/LandingPage";

import { DEFAULT_LOCALE } from "./i18n/i18n/constant";
import I18nProvider from "./i18n/i18n/I18nProvider";

export const routes = [
    {
        path: "/",
        element: <Navigate to={`/${DEFAULT_LOCALE}`} replace />,
    },

    {
        path: "/:locale",
        element: <I18nProvider />,
        children: [
            {
                index: true,
                element: <LandingPage />,
            },
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: "register",
                        element: <Register />,
                    },
                    {
                        path: "login",
                        element: <Login />,
                    },
                    {
                        path: "forgot-password",
                        element: <ForgotPassword />,
                    },
                    {
                        path: "reset-password",
                        element: <ResetPassword />,
                    },
                    {
                        path: "verify-code",
                        element: <VerifyCode />,
                    },
                    {
                        path: "select-role",
                        element: <SelectRole />,
                    },
                ],
            },

            {
                element: <RoleGuard />,
                children: [
                    {
                        element: <DashboardLayout />,
                        children: [
                            {
                                path: "dashboard",
                                element: <Dashboard />,
                            },
                            {
                                path: "users",
                                element: (
                                    <RoleGuard
                                        allowedRoles={[
                                            "admin",
                                            "super_admin",
                                        ]}
                                    />
                                ),
                                children: [
                                    {
                                        index: true,
                                        element: <Users />,
                                    },
                                ],
                            },
                            {
                                path: "setting",
                                element: <Setting />,
                            },

                            {
                                path: "exams",
                                element: <Exams />,
                            },

                            {
                                path: "notifications",
                                element: <Notification />,
                            },

                            {
                                path: "profile",
                                element: <TeacherProfile />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
];