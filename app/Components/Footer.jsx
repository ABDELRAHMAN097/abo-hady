import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center bg-gray-500 text-center text-white">
      <div className="container p-6">
        <div className="">
          <div className="flex items-center justify-between">
            <Link href="/signup">
              <button
                type="button"
                className="inline-block rounded-full border-2 border-neutral-50 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-neutral-300 hover:text-neutral-200 focus:border-neutral-300 focus:text-neutral-200 focus:outline-none focus:ring-0 active:border-neutral-300 active:text-neutral-200 dark:hover:bg-fuchsia-500 dark:focus:bg-neutral-600"
                data-twe-ripple-init
                data-twe-ripple-color="light"
              >
                Sign up!
              </button>
            </Link>
            <div className="flex items-center">
              <a href="https://web.facebook.com/profile.php?id=61563414478280">
                <FaFacebookF className="text-white text-[18px] ml-5" />
              </a>
              <a href="https://www.tiktok.com/@toto00store?_t=ZS-8uQuCuPR9LW&_r=1">
                <FaTiktok className="text-white text-[18px] ml-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-black/20 p-4 text-center cursor-pointer">
        © {new Date().getFullYear()} Vitality All Rights Reserved. | Developed
        by{" "}
        <a
          href="https://wa.me/201023671214"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-500 font-semibold hover:underline"
        >
          Abdelrahman Magdy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
