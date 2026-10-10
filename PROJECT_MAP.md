# 🗺️ خريطة هيكل المشروع ودليل التطوير السريع (Project Architecture & Developer Map)

هذا الدليل تم إعداده ليكون مرجعاً مستقلاً تماماً عن سير الكود البرمجي؛ يساعدك عند الرغبة في تطوير أو تعديل أي ميزة في المشروع على معرفة **جميع الملفات المرتبطة بها مباشرة** وكيفية تدفق البيانات بينها.

---

## 📑 الفهرس السريع

1. [نظام التوثيق والمصادقة (Authentication)](#1-نظام-التوثيق-والمصادقة-authentication)
2. [الملف الشخصي وبوابة العميل (User Profile & Customer Portal)](#2-الملف-الشخصي-وبوابة-العميل-user-profile--customer-portal)
3. [إدارة المستخدمين والأدوار (Users Management & RBAC)](#3-إدارة-المستخدمين-والأدوار-users-management--rbac)
4. [الصفحة الرئيسية وأقسامها (Landing Page)](#4-الصفحة-الرئيسية-وأقسامها-landing-page)
5. [لوحة التحكم والإدارة (Dashboard & Admin Settings)](#5-لوحة-التحكم-والإدارة-dashboard--admin-settings)
6. [نظام رفع الملفات والصور (Cloudinary Media)](#6-نظام-رفع-الملفات-والصور-cloudinary-media)
7. [الترجمة وتعدد اللغات (i18n / Localization)](#7-الترجمة-وتعدد-اللغات-i18n--localization)
8. [المسارات وحماية الصفحات (Routing & Guards)](#8-المسارات-وحماية-الصفحات-routing--guards)
9. [طبقة الخدمات وقواعد البيانات (Services & Firebase)](#9-طبقة-الخدمات-وقواعد-البيانات-services--firebase)

---

## 1. نظام التوثيق والمصادقة (Authentication)

### 📌 الوظيفة:
تسجيل الدخول، إنشاء حساب جديد، تسجيل الدخول عبر Google، استعادة كلمة المرور، التحقق من البريد الإلكتروني.

### 📁 الملفات المرتبطة:
| العنصر | مسار الملف | الوظيفة |
| :--- | :--- | :--- |
| **صفحة الدخول** | `src/pages/auth/Login.jsx` | واجهة تسجيل الدخول بالبريد أو Google |
| **صفحة التسجيل** | `src/pages/auth/Register.jsx` | إنشاء حساب جديد للعميل |
| **نسيان كلمة المرور** | `src/pages/auth/ForgotPassword.jsx` | إرسال رابط استعادة كلمة المرور |
| **إعادة تعيين كلمة المرور** | `src/pages/auth/ResetPassword.jsx` | شاشة ضبط كلمة المرور الجديدة |
| **اختيار الدور** | `src/pages/auth/SelectRole.jsx` | اختيار دور المستخدم عند الحاجة |
| **خدمة التوثيق** | `src/services/authService.js` | دوال Firebase Auth (`loginWithEmail`, `registerWithEmail`, `signInWithGoogle`...) |
| **سياق المصادقة** | `src/context/AuthContext.jsx` | تتبع حالة المستخدم وتسجيل الخروج عالمياً |
| **التحقق من صحة المدخلات** | `src/validations/authSchemas.js` | قواعد Yup الخاصة بالبريد وكلمة المرور |
| **قالب المصادقة العام** | `src/layouts/AuthLayout.jsx` | الغلاف والتصميم الخارجي لصفحات الدخول |

> 💡 **لو أردت تطوير شيء في التوثيق:**
> - تعديل حقول التسجيل ⬅️ `src/pages/auth/Register.jsx` + `src/validations/authSchemas.js`
> - تغيير آليات الـ Firebase ⬅️ `src/services/authService.js`

---

## 2. الملف الشخصي وبوابة العميل (User Profile & Customer Portal)

### 📌 الوظيفة:
عرض وتعديل بيانات المستخدم الشخصية (الاسم، الهاتف، العنوان، تاريخ الميلاد)، رفع الصورة الشخصية، إدارة رخص القيادة ووثائق الهوية، وتغيير كلمة المرور.

### 📁 الملفات المرتبطة:
| العنصر | مسار الملف | الوظيفة |
| :--- | :--- | :--- |
| **غلاف البروفايل** | `src/pages/dashboard/ProfileWrapper.jsx` | يفصل بين عرض العميل (Customer) وعرض الإدارة (Dashboard) |
| **الصفحة المركزية** | `src/pages/dashboard/Profile.jsx` | تجمع كل تبويبات البروفايل وتدير التحديث التلقائي |
| **الترويسة والصورة** | `src/components/profile/ProfileHeader.jsx` | عرض الاسم والرتبة وتغيير الصورة الشخصية عبر Cloudinary |
| **البيانات الشخصية** | `src/components/profile/PersonalInformation.jsx` | نموذج تعديل الاسم والهاتف والمدينة والعنوان |
| **بيانات السائق** | `src/components/profile/DriverInformation.jsx` | بيانات الرخصة ونوع المركبة (للسائقين) |
| **المستندات والوثائق** | `src/components/profile/DocumentsSection.jsx` | رفع صور البطاقة والرخصة والتحقق منها |
| **أمان الحساب** | `src/components/profile/SecuritySection.jsx` | تغيير كلمة المرور والتحقق من البريد الإلكتروني |
| **خدمة الملف الشخصي** | `src/services/profileService.js` | دالة `updateUserProfileData` و `getUserProfile` مع دمج Firestore التلقائي |

> 💡 **لو أردت إضافة حقل جديد لبيانات المستخدم:**
> 1. أضف الحقل في واجهة العرض والتعديل ⬅️ `src/components/profile/PersonalInformation.jsx`
> 2. دالة الحفظ تستدعي تلقائياً ⬅️ `src/services/profileService.js` (يقوم بالحفظ والدمج في Firestore دون الحاجة لتعديل يدوي إضافي).

---

## 3. إدارة المستخدمين والأدوار (Users Management & RBAC)

### 📌 الوظيفة:
لوحة تحكم المشرفين لعرض جميع المستخدمين، البحث الذكي بالاسم أو الهاتف أو البريد، تغيير الرتب والصلاحيات (Customer, Driver, Admin, Super Admin)، وتغيير حالة الحساب (Active / Inactive).

### 📁 الملفات المرتبطة:
| العنصر | مسار الملف | الوظيفة |
| :--- | :--- | :--- |
| **صفحة المستخدمين** | `src/pages/dashboard/Users.jsx` | الصفحة الرئيسية لإدارة المستخدمين |
| **خطاف البيانات** | `src/hooks/useUsers.js` | منطق الفلترة والبحث والترقيم (Pagination) والتأخير الزمني (Debounce) |
| **إحصائيات المستخدمين** | `src/components/users/UserStats.jsx` | بطاقات أعداد العملاء والسائقين والمسؤولين |
| **فلاتر البحث** | `src/components/users/UserFilters.jsx` | حقول البحث بالاسم والهاتف والفلترة حسب الدور والحالة |
| **جدول المستخدمين** | `src/components/users/UsersTable.jsx` | عرض صفوف المستخدمين وتغيير رتبهم وحالاتهم |
| **ترقيم الصفحات** | `src/components/users/UsersPagination.jsx` | أزرار التالي والسابق |
| **خدمة المستخدمين** | `src/services/userService.js` | دوال `getAllUsers`, `searchUsers`, `updateUserRole`, `getUserStats` |
| **أدوات الفهرسة والبحث** | `src/services/userUtils.js` | خوارزميات معالجة الحروف العربية والبحث المركب |

> 💡 **لو أردت تعديل خوارزمية البحث أو إضافة فلاتر جديدة:**
> - تعديل شروط البحث في قاعدة البيانات ⬅️ `src/services/userService.js` + `src/services/userUtils.js`
> - تعديل واجهة الفلترة ⬅️ `src/components/users/UserFilters.jsx` + `src/hooks/useUsers.js`

---

## 4. الصفحة الرئيسية وأقسامها (Landing Page)

### 📌 الوظيفة:
الواجهة العامة للزوار: البانر الرئيسي، الخدمات، أسطول السيارات، معرض الصور، لماذا نحن، اتصل بنا، وحجز السيارات.

### 📁 الملفات المرتبطة:
| القسم | مسار الملف | الوظيفة |
| :--- | :--- | :--- |
| **الصفحة الأم** | `src/pages/LandingPage.jsx` | تجمع الأقسام وتستمع للتمرير السلس وتدير اشتراك Firebase الحقيقي |
| **شريط التنقل العلوي** | `src/components/NavparLanding.jsx` | روابط الانتقال السلس للأقسام والتنقل من الصفحات الأخرى مثل البروفايل |
| **البانر الترحيبي (Hero)** | `src/components/landing/LandingHero.jsx` | العناوين الترويجية وزر الحجز والصورة الرئيسية |
| **قسم الخدمات** | `src/components/landing/LandingServices.jsx` | بطاقات الخدمات المميزة (توصيل مطار، سيارات فاخرة...) |
| **أسطول السيارات (Fleet)** | `src/components/landing/LandingFleet.jsx` | عرض السيارات المتاحة وأسعارها ومواصفاتها |
| **معرض الصور (Gallery)** | `src/components/landing/LandingGallery.jsx` | استعراض الصور في شبكة أنيقة مع فلاتر التصنيف |
| **لماذا نحن (Why Us)** | `src/components/landing/LandingWhyUs.jsx` | مميزات الخدمة وضمانات الجودة |
| **اتصل بنا والحجز (CTA)** | `src/components/landing/LandingCTA.jsx` | معلومات التواصل والواتساب وزر الاتصال المباشر |
| **تذييل الصفحة (Footer)** | `src/components/landing/LandingFooter.jsx` | الروابط السريعة وحقوق النشر |
| **خدمة الصفحة الرئيسية** | `src/services/landing.js` | حفظ وجلب إعدادات الصفحة والتخزين المؤقت (Cache) |

> 💡 **لو أردت تعديل محتوى أو تصميم قسم من الصفحة الرئيسية:**
> - عدل مباشرة في المكون المعني في المجلد ⬅️ `src/components/landing/`
> - التحكم في القفز والتمرير بين الأقسام ⬅️ `src/components/NavparLanding.jsx` + `src/pages/LandingPage.jsx`

---

## 5. لوحة التحكم والإدارة (Dashboard & Admin Settings)

### 📌 الوظيفة:
الشاشة الرئيسية للإدارة والسائقين، تعديل محتوى الصفحة الرئيسية بصرياً، المحفظة، والتقارير.

### 📁 الملفات المرتبطة:
| العنصر | مسار الملف | الوظيفة |
| :--- | :--- | :--- |
| **قالب لوحة التحكم** | `src/layouts/DashboardLayout.jsx` | الهيكل العام مع القائمة الجانبية وشريط العنوان |
| **القائمة الجانبية** | `src/components/Sidebar.jsx` | التنقل بين أقسام الإدارة وتسجيل الخروج |
| **بيانات القائمة** | `src/components/sidebarData.js` | تعريف أيقونات ومسارات عناصر القائمة الجانبية |
| **الرئيسية للوحة التحكم** | `src/pages/dashboard/Dashboard.jsx` | نظرة سريعة على المقاييس والعمليات |
| **صفحة الإعدادات** | `src/pages/dashboard/Setting.jsx` | تبويبات الإعدادات العامة وإعدادات الموقع |
| **محرر اللاندينج باج** | `src/components/sitting/EditLanding.jsx` | محرر متكامل لتعديل نصوص وصور وأقسام الصفحة الرئيسية مباشرة |
| **صفحة المحفظة** | `src/pages/dashboard/Wallet.jsx` | العمليات المالية والأرصدة |
| **صفحة التقارير** | `src/pages/dashboard/Reports.jsx` | تقارير الرحلات والإيرادات |

> 💡 **لو أردت إضافة خيار تعديل جديد للصفحة الرئيسية من لوحة التحكم:**
> - واجهة التعديل وحفظ البيانات ⬅️ `src/components/sitting/EditLanding.jsx`
> - معالجة البيانات المحفوظة ⬅️ `src/services/landing.js`

---

## 6. نظام رفع الملفات والصور (Cloudinary Media)

### 📌 الوظيفة:
رفع ومعالجة وحذف الصور (صور الملف الشخصي، صور المستندات، صور السيارات، صور المعرض) سحابياً عبر Cloudinary.

### 📁 الملفات المرتبطة:
| الملف | الوظيفة |
| :--- | :--- |
| `src/services/cloudinary.js` | دوال `uploadToCloudinary`, `deleteFromCloudinary`, `getPublicIdFromUrl` |
| `.env` | يحتوي على مفاتيح الربط: `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET` |

---

## 7. الترجمة وتعدد اللغات (i18n / Localization)

### 📌 الوظيفة:
دعم اللغتين العربية (مع الاتجاه RTL) والإنجليزية (مع الاتجاه LTR).

### 📁 الملفات المرتبطة:
| الملف | الوظيفة |
| :--- | :--- |
| `src/i18n/i18n/context.jsx` | خطاف `useI18n()` ودالة الترجمة `t("key")` والتحكم باللغة النشطة |
| `src/i18n/i18n/I18nProvider.jsx` | المزود العام الذي يضبط اتجاه الصفحة `dir="rtl"` أو `dir="ltr"` حسب مسار URL |
| `src/i18n/i18n/translations/` | ملفات قواميس الكلمات والعبارات باللغتين |
| `src/i18n/i18n/constant.js` | تعريف اللغات المدعومة واللغة الافتراضية |

---

## 8. المسارات وحماية الصفحات (Routing & Guards)

### 📌 الوظيفة:
توجيه المستخدمين بناءً على الرابط وحالة تسجيل الدخول والصلاحيات المسموحة.

### 📁 الملفات المرتبطة:
| الملف | الوظيفة |
| :--- | :--- |
| `src/routes.jsx` | شجرة المسارات المركزية للتطبيق كاملة (`/:locale/...`) |
| `src/components/common/AuthGuard.jsx` | يمنع غير المسجلين من دخول المسارات المحمية ويوجههم لتسجيل الدخول |
| `src/components/common/RoleGuard.jsx` | يتحقق من دور المستخدم (Admin, Driver...) لمنع الدخول غير المصرح |

---

## 9. طبقة الخدمات وقواعد البيانات (Services & Firebase)

### 📌 هيكل مجلد `src/services/`:
```text
src/services/
├── auth.js            # الواجهة المركزية والموحدة (Re-exports Hub) للتوافق الشامل
├── authService.js     # عمليات التوثيق وتسجيل الدخول وإنشاء الحساب بـ Firebase Auth
├── profileService.js  # جلب وتحديث وحفظ بيانات الملف الشخصي والصور بـ Firestore
├── userService.js     # استعلامات وبحث وتحديث وإحصائيات المستخدمين للوحة التحكم
├── userUtils.js       # أدوات تنظيف النصوص والأرقام العربية والبحث الذكي
├── landing.js         # جلب وحفظ ومزامنة بيانات اللاندينج باج في الوقت الفعلي
└── cloudinary.js      # رفع وإدارة الصور السحابية
```

### 📌 ملف إعدادات Firebase:
`src/config/firebase.js`:
- يحتوي على تهيئة التطبيق `initializeApp`.
- يصدر كائنات `auth` و `db` المشتركة في جميع أرجاء النظام.

---

### 🚀 ملخص سريع: كيف تجد ما تبحث عنه في ثوانٍ؟

| إذا أردت تعديل... | اتجه فوراً إلى... |
| :--- | :--- |
| نصوص أو تصميم شريط التنقل العلوي | `src/components/NavparLanding.jsx` |
| شاشات وبيانات الملف الشخصي | `src/components/profile/` و `src/pages/dashboard/Profile.jsx` |
| جدول المستخدمين وصلاحياتهم | `src/components/users/` و `src/pages/dashboard/Users.jsx` |
| أي قسم في اللاندينج باج | `src/components/landing/` و `src/pages/LandingPage.jsx` |
| القائمة الجانبية للوحة التحكم | `src/components/Sidebar.jsx` و `src/components/sidebarData.js` |
| دوال الاتصال بفايربيس والتوثيق | `src/services/` |
| إضافة نصوص مترجمة جديدة | `src/i18n/i18n/translations/` |
| إضافة صفحة جديدة أو مسار جديد | `src/routes.jsx` |
