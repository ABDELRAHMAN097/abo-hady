import { useState } from "react";
import { IoLockClosedOutline } from "react-icons/io5";
import { FiEyeOff } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { IoWarning } from "react-icons/io5";
import AuthHeader from "../../components/shared/AuthHeader";

export default function ResetPassword() {

  const [showPassword,setShowPassword]=useState(false);
  const [showConfirm,setShowConfirm]=useState(false);

  return (

    <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg px-6 py-8">

      <AuthHeader
        role="Admin Access"
        titleClass="text-primary-color text-4xl lg:text-6xl"
        heading="New Password"
        description="Enter A New Password Below To Change Your Password"
      />

      <form className="space-y-5 mt-8">

        <div>

          <label className="block text-sm font-semibold mb-2">
            New Password
          </label>

          <div className="relative">

            <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>

            <input
              type={showPassword?"text":"password"}
              placeholder="********"
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-primary-color"
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {
                showPassword
                ?
                <IoEyeOutline/>
                :
                <FiEyeOff/>
              }
            </button>

          </div>

        </div>

        <div>

          <label className="block text-sm font-semibold mb-2">
            Confirm New Password
          </label>

          <div className="relative">

            <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>

            <input
              type={showConfirm?"text":"password"}
              placeholder="********"
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-red-400 outline-none"
            />

            <button
              type="button"
              onClick={()=>setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {
                showConfirm
                ?
                <IoEyeOutline/>
                :
                <FiEyeOff/>
              }
            </button>

          </div>

          <p className="flex items-center gap-1 text-red-500 text-xs mt-2">
            <IoWarning/>
            Password Confirmation Doesn't Match
          </p>

        </div>

        <button
          className="w-full py-3 rounded-lg bg-primary-color text-white font-semibold hover:opacity-90 transition"
        >
          Confirm
        </button>

      </form>

    </div>
  );
}