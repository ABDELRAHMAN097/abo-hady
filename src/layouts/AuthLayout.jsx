import { Outlet } from "react-router-dom";

export default function AuthRegisterLayout({ children, title, subtitle }) {
  return (
    <div
      className="bg-[#0B0C10] text-[#F9FAFB] font-cairo flex flex-col"
      dir="rtl"
    >
      <header className="shrink-0 px-6 py-4 md:px-12 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#D4AF37] p-[2px] shadow-lg shadow-[#10B981]/20">
            <div className="w-full h-full bg-[#111827] rounded-[10px] flex items-center justify-center font-bold text-xl text-[#D4AF37]">
              أ
            </div>
          </div>

          <div>
            <h1 className="text-xl font-black tracking-wider text-white">
              أبو هادي
            </h1>

            <p className="text-[10px] text-[#D4AF37] tracking-widest font-semibold uppercase">
              LUXURY CAR RENTAL
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/201026116087"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-[#111827] hover:bg-[#1F2937] border border-[#374151] hover:border-[#25D366] text-xs px-4 py-2 rounded-xl transition-all group"
        >
          <span className="w-2 rounded-full bg-[#25D366] animate-pulse" />

          <span className="text-[#9CA3AF] group-hover:text-white transition-colors">
            الدعم الفوري
          </span>
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center px-0 md:px-8 py-2">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 bg-[#111827] border border-[#374151] rounded-3xl overflow-hidden shadow-2xl">
          
          <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center relative">
            <Outlet />
          </div>
          <div className="hidden lg:flex lg:col-span-6 bg-[#0F172A] relative overflow-hidden flex-col justify-between p-12 border-r border-[#374151]">
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#10b98148] rounded-full blur-3xl pointer-events-none" />

            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4af373d] rounded-full blur-3xl pointer-events-none" />

            <div
              className="absolute inset-0 opacity-40 mix-blend-luminosity bg-cover bg-center pointer-events-none"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop')",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent" />

            <div className="relative z-10 self-start">
              <span className="inline-flex items-center gap-2 bg-[#1F2937]/80 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-semibold">
                <span>✦</span>
                تجربة قيادة لا تُنسى في مصر
              </span>
            </div>

            <div className="relative z-10 mt-auto">
              <blockquote className="text-xl font-bold text-white leading-relaxed mb-4">
                "أسطول من أفخم السيارات الرياضية والرئاسية في انتظارك.. رفاهية تليق بمكانتك."
              </blockquote>

              <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  ★ ★ ★ ★ ★
                </div>

                <span>
                  خيار صفوة المجتمع لخدمات الليموزين وتأجير السيارات الفارهة
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 px-6 py-3 text-center text-xs text-[#6B7280]">
        &copy; {new Date().getFullYear()} أبو هادي لتأجير السيارات الفاخرة. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}

