import React from "react";
import Link from "next/link";
import { TbAlertTriangle } from "react-icons/tb";

const Page = () => {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
        <TbAlertTriangle size={50} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">الوصول مرفوض!</h1>
        <p className="text-gray-600 mb-6">
          ليس لديك الصلاحية للوصول إلى هذه الصفحة. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع المسؤول.
        </p>
        <Link href="/">
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
          >
          العودة للصفحة الرئيسية
        </button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
