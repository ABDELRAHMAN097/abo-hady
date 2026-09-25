import { Link, useNavigate, useParams } from "react-router-dom";
import { CgMail } from "react-icons/cg";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";

import {
    loginWithEmail,
    signInWithGoogle,
    getUserProfile,
} from "@/services/auth";

import { loginSchema } from "@/validations/authSchemas";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { locale = "en" } = useParams();
    const DASHBOARD_ROLES = [
        "admin",
        "super_admin",
        "driver",
    ];
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },

        validationSchema: loginSchema,

        onSubmit: async (values, { setSubmitting }) => {
            try {
                const userCredential = await loginWithEmail(
                    values.email.trim(),
                    values.password
                );

                const firebaseUser = userCredential.user;
                const role = profile?.role || "customer";

                const canAccessDashboard =
                    DASHBOARD_ROLES.includes(role);
                toast.success("تم تسجيل الدخول بنجاح!");

                if (canAccessDashboard) {
                    navigate(`/${locale}/dashboard`, {
                        replace: true,
                    });
                } else {
                    navigate(`/${locale}`, {
                        replace: true,
                    });
                }
            } catch (error) {
                console.error(
                    "❌ Error signing in:",
                    error
                );
                switch (error?.code) {
                    case "auth/invalid-credential":
                    case "auth/user-not-found":
                    case "auth/wrong-password":
                        toast.error(
                            "البريد الإلكتروني أو كلمة المرور غير صحيحة."
                        );
                        break;

                    case "auth/invalid-email":
                        toast.error(
                            "صيغة البريد الإلكتروني غير صحيحة."
                        );
                        break;

                    case "auth/user-disabled":
                        toast.error(
                            "تم تعطيل هذا الحساب. يرجى التواصل مع الدعم."
                        );
                        break;

                    case "auth/network-request-failed":
                        toast.error(
                            "تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت."
                        );
                        break;

                    case "auth/too-many-requests":
                        toast.error(
                            "تم إجراء محاولات كثيرة خاطئة. حاول مرة أخرى لاحقًا."
                        );
                        break;
                    case "permission-denied":
                    case "firestore/permission-denied":
                        toast.error(
                            "تم تسجيل الدخول، ولكن تعذر تحميل بيانات الحساب."
                        );
                        break;

                    default:
                        toast.error(
                            "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى."
                        );
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithGoogle();
            const firebaseUser = result.user;
            const profile = await getUserProfile(
                firebaseUser.uid
            );
            const role = profile?.role || "customer";

            const canAccessDashboard =
                DASHBOARD_ROLES.includes(role);
            toast.success(
                "تم تسجيل الدخول بنجاح باستخدام Google!"
            );

            if (canAccessDashboard) {
                navigate(`/${locale}/dashboard`, {
                    replace: true,
                });
            } else {
                navigate(`/${locale}`, {
                    replace: true,
                });
            }
        } catch (error) {
            console.error(
                "❌ Error signing in with Google:",
                error
            );

            switch (error?.code) {
                case "auth/popup-closed-by-user":
                    toast.error(
                        "تم إغلاق نافذة Google."
                    );
                    break;

                case "auth/popup-blocked":
                    toast.error(
                        "المتصفح منع نافذة Google. اسمح بالنوافذ المنبثقة."
                    );
                    break;

                case "auth/cancelled-popup-request":
                    toast.error(
                        "تم إلغاء عملية تسجيل الدخول."
                    );
                    break;

                case "auth/account-exists-with-different-credential":
                    toast.error(
                        "هذا البريد مرتبط بطريقة تسجيل دخول أخرى."
                    );
                    break;

                case "auth/network-request-failed":
                    toast.error(
                        "تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت."
                    );
                    break;

                default:
                    toast.error(
                        "حدث خطأ أثناء التسجيل باستخدام Google."
                    );
            }
        }
    };
    return (
        <div className="w-full flex flex-col items-center justify-center gap-2 p-0 m-0">

            <div className="w-full flex flex-col gap-2 items-start justify-start">

                <h1 className="text-xl md:text-4xl font-bold text-white">
                    مرحباً بعودتك 👋
                </h1>

                <p className="text-text-secondary">
                    سجل دخولك للوصول إلى أسطول سياراتك المفضل وتفاصيل حجزك
                </p>

            </div>
            <form
                className="flex flex-col items-start justify-start gap-2 w-full mt-2"
                onSubmit={formik.handleSubmit}
            >

                <div className="flex flex-col gap-0.5 w-full">

                    <label className="text-text-secondary text-sm">
                        البريد الإلكتروني
                    </label>

                    <div
                        className={`w-full flex items-center gap-2 border ${
                            formik.touched.email &&
                            formik.errors.email
                                ? "border-red-500"
                                : "border-border hover:border-whatsapp focus-within:border-accent"
                        } shadow hover:shadow-whatsapp rounded-md bg-card px-3 py-2 transition-all`}
                    >

                        <CgMail className="text-text-secondary text-lg shrink-0" />

                        <input
                            className="w-full bg-transparent outline-none border-none text-text-primary placeholder:text-text-muted text-sm"
                            type="email"
                            name="email"
                            placeholder="example@gmail.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />

                    </div>

                    {formik.touched.email &&
                        formik.errors.email && (
                            <span className="text-red-500 text-xs">
                                {formik.errors.email}
                            </span>
                        )}

                </div>

                <div className="flex flex-col gap-0.5 w-full">

                    <div className="flex items-center justify-between w-full">

                        <label className="text-text-secondary text-sm">
                            كلمة المرور
                        </label>

                        <Link
                            to={`/${locale}/forgot-password`}
                            className="text-xs text-text-muted hover:text-accent transition-colors"
                        >
                            نسيت كلمة المرور؟
                        </Link>

                    </div>

                    <div
                        className={`w-full flex items-center gap-2 border ${
                            formik.touched.password &&
                            formik.errors.password
                                ? "border-red-500"
                                : "border-border hover:border-whatsapp focus-within:border-accent"
                        } shadow hover:shadow-whatsapp rounded-md bg-card px-3 py-2 transition-all`}
                    >

                        <RiLockPasswordFill className="text-text-secondary text-lg shrink-0" />

                        <input
                            className="w-full bg-transparent outline-none border-none text-text-primary placeholder:text-text-muted text-sm"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            name="password"
                            placeholder="******"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    (prev) => !prev
                                )
                            }
                            className="text-text-secondary hover:text-accent transition-colors cursor-pointer"
                            aria-label={
                                showPassword
                                    ? "إخفاء كلمة المرور"
                                    : "إظهار كلمة المرور"
                            }
                        >
                            {showPassword ? (
                                <FaEyeSlash />
                            ) : (
                                <FaEye />
                            )}
                        </button>

                    </div>

                    {formik.touched.password &&
                        formik.errors.password && (
                            <span className="text-red-500 text-xs">
                                {formik.errors.password}
                            </span>
                        )}

                </div>
                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full mt-2 bg-whatsapp text-white px-3 py-2.5 rounded-md hover:bg-whatsapp/80 transition-colors shadow hover:shadow-whatsapp flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >

                    {formik.isSubmitting
                        ? "جاري تسجيل الدخول..."
                        : "تسجيل الدخول"}

                    {!formik.isSubmitting && (
                        <span>
                            <IoIosArrowDropleftCircle className="text-lg" />
                        </span>
                    )}

                </button>
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full mt-1 bg-red-500 text-white px-3 py-2.5 rounded-md hover:bg-red-600 transition-colors shadow hover:shadow-red-500 flex items-center justify-center gap-2 font-medium cursor-pointer"
                >

                    <span className="font-bold text-lg">
                        <FaGoogle />
                    </span>

                    تسجيل الدخول باستخدام Google

                </button>

            </form>

            <div className="flex items-center justify-center gap-1 mt-3 text-sm">

                <span className="text-text-muted">
                    ليس لديك حساب؟
                </span>

                <Link
                    to={`/${locale}/register`}
                    className="text-whatsapp font-semibold hover:underline transition-all"
                >
                    إنشاء حساب جديد
                </Link>

            </div>

        </div>
    );
}
