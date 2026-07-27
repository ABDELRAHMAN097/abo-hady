# 🛍️ TOTO Store - متجر إلكتروني بسيط وذكي

TOTO Store هو موقع متجر إلكتروني تم تطويره باستخدام Next.js و Firebase. بيوفر تجربة سهلة واحترافية للمستخدمين مع نظام تسجيل دخول، لوحة تحكم للإدارة، وتحكم كامل في المنتجات.

الموقع مصمم لعرض المنتجات بطريقة جذابة مع زر تواصل مباشر على **واتساب** لسرعة التواصل بين العميل وصاحب المشروع.

---

## ✨ المميزات الرئيسية

- 🔐 **نظام تسجيل الدخول والتسجيل** باستخدام Firebase.
- 🧑‍💼 **تقسيم المستخدمين** بين مسؤول (Admin) ومستخدم عادي.
- 🚫 **حماية الصفحات** من الوصول غير المصرّح به.
- 🛍️ **لوحة تحكم للإدارة**: إضافة، تعديل، حذف منتجات.
- 📦 **عرض ديناميكي للمنتجات** مع صفحة مخصصة لكل منتج.
- 📱 **تصميم متجاوب** متوافق مع جميع الشاشات.
- 💬 **زر تواصل مباشر عبر واتساب** في كل صفحة منتج.
- 🎉 **إشعارات فورية (Toast)** لتأكيد العمليات.
- 🌐 **تعدد الصفحات (Home, About, Women, Layout, Wishlist, etc)**.

---

## 🧑‍💻 التقنيات المستخدمة

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Auth](https://firebase.google.com/products/auth)
- [Cloud Firestore](https://firebase.google.com/products/firestore)
- Context API (لعربة التسوق وحالة المستخدم)
- LocalStorage (لحفظ عربة التسوق)
- WhatsApp API (للربط المباشر)

---

## 🚀 طريقة التشغيل المحلي

```bash
# 1. كلون للمشروع
git clone https://github.com/ABDELRAHMAN097/totostore.git
cd totostore

# 2. تثبيت الاعتمادات
npm install

# 3. تشغيل الموقع على الخادم المحلي
npm run dev


TOTO Store is a simple e-commerce site built with Next.js and Firebase. It includes login system, admin dashboard for full product management, and a WhatsApp integration for fast and direct customer communication.

🛠️ Features:

Login / Signup

Admin & User Roles

Protected Routes

Add / Edit / Delete Products

WhatsApp Button in Product Page

Mobile Responsive Design

Toast Notifications

🔧 Stack: Next.js + Firebase + Tailwind + React + Context API

💬 No payment gateway yet, but WhatsApp chat simplifies the deal-making process.

