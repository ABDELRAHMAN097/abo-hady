import {
    FaCar,
    FaPhoneAlt,
    FaWhatsapp,
} from "react-icons/fa";

export default function LandingFooter({
    isArabic,
    onScroll,
}) {
    return (
        <footer className="border-t border-white/10 bg-[#08090D]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {/* BRAND */}

                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-whatsapp flex items-center justify-center">
                                <FaCar className="text-black" />
                            </div>

                            <div>
                                <h3 className="font-bold">
                                    Abu Hady
                                </h3>

                                <p className="text-[10px] text-whatsapp uppercase tracking-widest">
                                    Luxury Car Rental
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-500 leading-7 mt-5 max-w-sm">
                            {isArabic
                                ? "تجربة تأجير سيارات فاخرة مصممة لتناسب احتياجاتك."
                                : "A premium luxury car rental experience designed around your needs."}
                        </p>
                    </div>

                    {/* QUICK LINKS */}

                    <div>
                        <h4 className="font-semibold mb-5">
                            {isArabic
                                ? "روابط سريعة"
                                : "Quick Links"}
                        </h4>

                        <div className="flex flex-col gap-3 text-gray-500">
                            <button
                                onClick={() =>
                                    onScroll("home")
                                }
                                className="text-start hover:text-whatsapp transition"
                            >
                                {isArabic
                                    ? "الرئيسية"
                                    : "Home"}
                            </button>

                            <button
                                onClick={() =>
                                    onScroll(
                                        "services"
                                    )
                                }
                                className="text-start hover:text-whatsapp transition"
                            >
                                {isArabic
                                    ? "خدماتنا"
                                    : "Services"}
                            </button>

                            <button
                                onClick={() =>
                                    onScroll("fleet")
                                }
                                className="text-start hover:text-whatsapp transition"
                            >
                                {isArabic
                                    ? "السيارات"
                                    : "Our Fleet"}
                            </button>

                            <button
                                onClick={() =>
                                    onScroll(
                                        "gallery"
                                    )
                                }
                                className="text-start hover:text-whatsapp transition"
                            >
                                {isArabic
                                    ? "المعرض"
                                    : "Gallery"}
                            </button>

                            <button
                                onClick={() =>
                                    onScroll(
                                        "contact"
                                    )
                                }
                                className="text-start hover:text-whatsapp transition"
                            >
                                {isArabic
                                    ? "تواصل معنا"
                                    : "Contact"}
                            </button>
                        </div>
                    </div>

                    {/* CONTACT */}

                    <div>
                        <h4 className="font-semibold mb-5">
                            {isArabic
                                ? "تواصل معنا"
                                : "Contact Us"}
                        </h4>

                        <div className="space-y-4 text-gray-500">
                            <div className="flex items-center gap-3">
                                <FaPhoneAlt className="text-whatsapp shrink-0" />

                                <span dir="ltr">
                                    +20 100 000 0000
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <FaWhatsapp className="text-whatsapp shrink-0" />

                                <span>
                                    WhatsApp
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-gray-600">
                    ©{" "}
                    {new Date().getFullYear()}{" "}
                    Abu Hady Luxury Car Rental.{" "}
                    {isArabic
                        ? "جميع الحقوق محفوظة."
                        : "All rights reserved."}
                </div>
            </div>
        </footer>
    );
}