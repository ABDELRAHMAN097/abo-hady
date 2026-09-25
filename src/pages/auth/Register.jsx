import { useFormik } from "formik";
import { FaUser } from "react-icons/fa";
import { BsTelephoneOutbound } from "react-icons/bs";
import { FaGoogle } from "react-icons/fa";
import { CgMail } from "react-icons/cg";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { registerWithEmail, signInWithGoogle } from "../../services/auth";
import { registerSchema } from "../../validations/authSchemas";

export default function Register() {
    const navigate = useNavigate();
    const { locale } = useParams();
    const formik = useFormik({
        initialValues: {
            name: "",
            phone: "",
            email: "",
            password: "",
            confirmPassword: "",
        },

        validationSchema: registerSchema,


        onSubmit: async (values, { setSubmitting, resetForm }) => {
            console.log("🔥 onSubmit اشتغل", values);

            try {
                await registerWithEmail({
                    name: values.name.trim(),
                    email: values.email.trim(),
                    password: values.password,
                    phone: values.phone.trim(),
                });

                console.log("✅ Firebase registration success");
                console.log("🌍 locale:", locale);

                toast.success(
                    "تم إنشاء الحساب بنجاح. سيتم تحويلك لتسجيل الدخول."
                );

                resetForm();

                // الانتقال لصفحة تسجيل الدخول
                navigate(`/${locale}/login`);
            } catch (error) {
                console.error(error);

                switch (error.code) {
                    case "auth/email-already-in-use":
                        toast.error("البريد الإلكتروني مستخدم بالفعل.");
                        break;

                    case "auth/invalid-email":
                        toast.error("البريد الإلكتروني غير صحيح.");
                        break;

                    case "auth/weak-password":
                        toast.error(
                            "كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل."
                        );
                        break;

                    case "auth/network-request-failed":
                        toast.error(
                            "تعذر الاتصال بالخادم. تحقق من الإنترنت."
                        );
                        break;

                    case "auth/too-many-requests":
                        toast.error(
                            "تم إجراء محاولات كثيرة. حاول مرة أخرى لاحقًا."
                        );
                        break;

                    default:
                        toast.error(
                            "حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى."
                        );
                }
            } finally {
                setSubmitting(false);
            }
        },


    });

    //حالة الباسورد
    const [showPassword, setShowPassword] = useState(false);

    const getPasswordStrength = (password) => {
        if (!password) {
            return {
                label: "",
                width: "0%",
                color: "bg-transparent",
            };
        }

        if (password.length < 6) {
            return {
                label: "ضعيفة",
                width: "33%",
                color: "bg-red-500",
            };
        }

        if (password.length < 10) {
            return {
                label: "متوسطة",
                width: "66%",
                color: "bg-yellow-500",
            };
        }

        return {
            label: "قوية",
            width: "100%",
            color: "bg-green-500",
        };
    };
    const passwordStrength = getPasswordStrength(formik.values.password);
    //التسجيل بجوجل
    const handleGoogleSignUp = async () => {
        try {
            await signInWithGoogle();

            toast.success("تم إنشاء الحساب بنجاح باستخدام Google");
        } catch (error) {
            console.error(error);

            switch (error.code) {
                case "auth/popup-closed-by-user":
                    toast.error("تم إغلاق نافذة Google.");
                    break;

                case "auth/popup-blocked":
                    toast.error("المتصفح منع نافذة Google. اسمح بالنوافذ المنبثقة.");
                    break;

                case "auth/cancelled-popup-request":
                    toast.error("تم إلغاء عملية تسجيل الدخول.");
                    break;

                case "auth/account-exists-with-different-credential":
                    toast.error("هذا البريد مرتبط بطريقة تسجيل دخول أخرى.");
                    break;

                default:
                    toast.error("حدث خطأ أثناء التسجيل باستخدام Google.");
            }
        }
    };


    return (
        <div className="w-full flex flex-col items-center justify-center gap-2 p-0 m-0">

            <div className="w-full flex flex-col gap-2 items-start justify-start">
                <h1 className="text-xl md:text-4xl font-bold text-white">
                    انضم إلى <span className="text-accent">عالم ابو هادي</span>
                </h1>

                <p className="text-text-secondary">
                    أنشئ حسابك واستمتع بخصومات وأولوية حجز السيارات الفارهة
                </p>
            </div>

            <form
                className="flex flex-col items-start justify-start gap-1 w-full"
                onSubmit={formik.handleSubmit}
            >

                {/* Name */}
                <div className="flex flex-col gap-0.5 w-full">
                    <label className="text-text-secondary">
                        الاسم الكامل
                    </label>

                    <div
                        className={`w-full flex items-center gap-2 border ${formik.touched.name && formik.errors.name
                            ? "border-red-500"
                            : "border-border hover:border-whatsapp focus-within:border-accent"
                            } shadow hover:shadow-whatsapp rounded-md bg-card px-3 py-2`}
                    >
                        <FaUser className="text-text-secondary" />

                        <input
                            className="w-full bg-transparent outline-none border-none text-text-primary placeholder:text-text-muted"
                            type="text"
                            name="name"
                            placeholder="حسين هادي"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    {formik.touched.name && formik.errors.name && (
                        <span className="text-red-500 text-xs">
                            {formik.errors.name}
                        </span>
                    )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-0.5 w-full">
                    <label className="text-text-secondary">
                        رقم الهاتف
                    </label>

                    <div
                        className={`w-full flex items-center gap-2 border ${formik.touched.phone && formik.errors.phone
                            ? "border-red-500"
                            : "border-border hover:border-whatsapp focus-within:border-accent"
                            } shadow hover:shadow-whatsapp rounded-md bg-card px-3 py-2`}
                    >
                        <BsTelephoneOutbound className="text-text-secondary" />

                        <input
                            className="w-full bg-transparent outline-none border-none text-text-primary placeholder:text-text-muted"
                            type="tel"
                            name="phone"
                            placeholder="01000000000"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    {formik.touched.phone && formik.errors.phone && (
                        <span className="text-red-500 text-xs">
                            {formik.errors.phone}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-0.5 w-full">
                    <label className="text-text-secondary">
                        البريد الإلكتروني
                    </label>

                    <div
                        className={`w-full flex items-center gap-2 border ${formik.touched.email && formik.errors.email
                            ? "border-red-500"
                            : "border-border hover:border-whatsapp focus-within:border-accent"
                            } shadow hover:shadow-whatsapp rounded-md bg-card px-3 py-2`}
                    >
                        <CgMail className="text-text-secondary" />

                        <input
                            className="w-full bg-transparent outline-none border-none text-text-primary placeholder:text-text-muted"
                            type="email"
                            name="email"
                            placeholder="example@gmail.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    {formik.touched.email && formik.errors.email && (
                        <span className="text-red-500 text-xs">
                            {formik.errors.email}
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-0.5 w-full">
                    <label className="text-text-secondary">
                        كلمة المرور
                    </label>

                    <div
                        className={`w-full flex items-center gap-2 border ${formik.touched.password && formik.errors.password
                            ? "border-red-500"
                            : "border-border hover:border-whatsapp focus-within:border-accent"
                            } shadow hover:shadow-whatsapp rounded-md bg-card px-3 py-2`}
                    >
                        <RiLockPasswordFill className="text-text-secondary" />

                        <input
                            className="w-full bg-transparent outline-none border-none text-text-primary placeholder:text-text-muted"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="******"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="text-text-secondary hover:text-accent transition-colors cursor-pointer"
                            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* حالة الباسورد */}
                    {formik.values.password && (
                        <div className="flex items-center gap-2 w-full mt-1">
                            {/* Bar */}
                            <div className="flex-1 h-1.5 bg-gray-700/40 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                    style={{
                                        width: passwordStrength.width,
                                    }}
                                />
                            </div>

                            {/* Label */}
                            <span
                                className={`text-xs font-semibold ${passwordStrength.label === "ضعيفة"
                                    ? "text-red-500"
                                    : passwordStrength.label === "متوسطة"
                                        ? "text-yellow-500"
                                        : "text-green-500"
                                    }`}
                            >
                                {passwordStrength.label}
                            </span>
                        </div>
                    )}

                    {formik.touched.password && formik.errors.password && (
                        <span className="text-red-500 text-xs">
                            {formik.errors.password}
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-0.5 w-full">
                    <label className="text-text-secondary">
                        تأكيد كلمة المرور
                    </label>

                    <div
                        className={`w-full flex items-center gap-2 border ${formik.touched.confirmPassword && formik.errors.confirmPassword
                            ? "border-red-500"
                            : "border-border hover:border-whatsapp focus-within:border-accent"
                            } shadow hover:shadow-whatsapp rounded-md bg-card px-3 py-2`}
                    >
                        <RiLockPasswordFill className="text-text-secondary" />

                        <input
                            className="w-full bg-transparent outline-none border-none text-text-primary placeholder:text-text-muted"
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="******"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="text-text-secondary hover:text-accent transition-colors cursor-pointer"
                            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <span className="text-red-500 text-xs">
                            {formik.errors.confirmPassword}
                        </span>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full mt-2 bg-whatsapp text-white px-3 py-2 rounded-md hover:bg-whatsapp/80 transition-colors shadow hover:shadow-whatsapp flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {formik.isSubmitting
                        ? "جاري إنشاء الحساب..."
                        : "انشاء الحساب"}

                    {!formik.isSubmitting && (
                        <span>
                            <IoIosArrowDropleftCircle />
                        </span>
                    )}
                </button>
                
                <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    className="w-full mt-2 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors shadow hover:shadow-red-500 flex items-center justify-center gap-2"
                >
                    <span className="font-bold text-lg"><FaGoogle /></span>
                    إنشاء حساب باستخدام Google
                </button>
            </form>

            <div className="flex items-center justify-center gap-1 mt-2 text-sm">
                <span className="text-muted-foreground">
                    لديك حساب بالفعل؟
                </span>

                <Link
                    to={`/${locale}/login`}
                    className="text-whatsapp font-semibold hover:underline transition-all"
                >
                    تسجيل الدخول
                </Link>
            </div>

        </div>
    );
}