import * as Yup from "yup";

export const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
    .required("الاسم الكامل مطلوب"),

  phone: Yup.string()
    .matches(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح")
    .required("رقم الهاتف مطلوب"),

  email: Yup.string()
    .email("البريد الإلكتروني غير صحيح")
    .required("البريد الإلكتروني مطلوب"),

  password: Yup.string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .required("كلمة المرور مطلوبة"),
    
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "كلمتا المرور غير متطابقتين")
    .required("تأكيد كلمة المرور مطلوب"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("البريد الإلكتروني غير صحيح")
    .required("البريد الإلكتروني مطلوب"),

  password: Yup.string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .required("كلمة المرور مطلوبة"),
});

export const forgotPasswordSchema = Yup.object({
    email: Yup.string()
        .email("البريد الإلكتروني غير صحيح")
        .required("البريد الإلكتروني مطلوب"),
});
