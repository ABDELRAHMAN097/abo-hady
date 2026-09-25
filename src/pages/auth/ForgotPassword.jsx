import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { resetPassword } from "@/services/auth";
import { forgotPasswordSchema } from "@/validations/authSchemas";


export default function ForgotPassword() {
  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: forgotPasswordSchema,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await resetPassword(values.email.trim());

        toast.success(
          "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني."
        );

        resetForm();
      } catch (error) {
        console.error(error);

        switch (error.code) {
          case "auth/user-not-found":
            toast.error(
              "لا يوجد حساب مسجل بهذا البريد الإلكتروني."
            );
            break;

          case "auth/invalid-email":
            toast.error(
              "البريد الإلكتروني غير صحيح."
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
              "حدث خطأ أثناء إرسال رابط إعادة التعيين."
            );
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full rounded-2xl bg-card p-4 grid gap-1 space-y-4">
      <div>
        <h1 className="text-2xl text-text-primary font-semibold">هل نسيت كلمة السر</h1>
        <p className="text-text-secondary">أدخل عنوان بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين.</p>
      </div>


      <form onSubmit={formik.handleSubmit} className="space-y-1">
        {/* Email */}
        <div className="space-y-1">

          <label className="text-lg font-semibold text-gray-700 block">Email Address</label>
          <div
            className={`relative flex items-center ${formik.touched.email && formik.errors.email
              ? "border-red-500"
              : "border-accent focus-within:border-whatsapp"
              } border rounded-xl transition`}
          >
            <span className="absolute left-3.5 text-gray-400">
              <HiOutlineMail />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full py-2.5 pl-11 pr-4 text-sm text-gray-800 border border-accent rounded-xl focus:outline-none focus:border-whatsapp focus:ring-1 focus:ring-whatsapp transition placeholder-gray-300"
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <span className="text-red-500 text-xs">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="text-right text-sm text-text-primary">
          <Link
            to="/login"
            className="hover:text-whatsapp transition"
          >
            العودة لتسجيل الدخول
          </Link>
        </div>

        {/* Button */}
        <div className="w-full grid items-center justify-center gap-y-4 mt-2">

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="bg-whatsapp hover:bg-whatsapp/80 disabled:opacity-50 disabled:cursor-not-allowed transition text-center text-white px-10 py-2 rounded-md"
          >
            {formik.isSubmitting
              ? "جاري الإرسال..."
              : "إرسال رابط إعادة التعيين"}
          </button>

        </div>
      </form>
    </div>
  );
}