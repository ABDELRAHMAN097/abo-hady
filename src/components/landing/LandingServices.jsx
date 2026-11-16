import {
  FaBone,
  FaRunning,
  FaChild,
  FaHeartbeat,
  FaProcedures,
  FaAppleAlt,
} from "react-icons/fa";

const SERVICES = [
  {
    icon: FaBone,
    title: "علاج العمود الفقري والانزلاق الغضروفي",
    desc: "برامج متخصصة لعلاج آلام الرقبة والفقرات القطنية وعرق النسا بدون جراحة باستخدام أحدث أجهزة الشد الفقري الرقمي.",
    tag: "الأكثر طلباً",
  },
  {
    icon: FaProcedures,
    title: "تأهيل ما بعد العمليات الجراحية",
    desc: "إعادة التأهيل بعد عمليات تغيير المفاصل، جراحات الغضروف، تثبيت الفقرات، وترقيع الرباط الصليبي لعودة سريعة وآمنة للحياة اليومية.",
    tag: "برنامج متكامل",
  },
  {
    icon: FaHeartbeat,
    title: "تأهيل كبار السن وخشونة المفاصل",
    desc: "برامج علاجية لتقوية العضلات وتحسين التوازن وتخفيف آلام خشونة الركبتين وتأهيل حالات السكتة الدماغية والجلطات.",
    tag: "رعاية مخصصة",
  },
  {
    icon: FaRunning,
    title: "إصابات الملاعب والتأهيل الرياضي",
    desc: "علاج تمزق الأربطة، التهاب الأوتار، إصابات العضلات، وإعداد الرياضيين للعودة للمنافسات في أسرع وقت ممكن وبأعلى كفاءة.",
    tag: "للرياضيين",
  },
  {
    icon: FaChild,
    title: "العلاج الطبيعي للأطفال",
    desc: "جلسات متخصصة للأطفال لعلاج تأخر النمو الحركي، حالات الشلل الدماغي، والتشوهات القوامية بإشراف أخصائيين مؤهلين.",
    tag: "عناية فائقة",
  },
  {
    icon: FaAppleAlt,
    title: "التغذية العلاجية ونحت القوام",
    desc: "أنظمة غذائية علاجية مخصصة لمرضى السمنة ومشاكل المفاصل، مع أحدث أجهزة تفتيت الدهون وتحسين اللياقة البدنية والصحة العامة.",
    tag: "صحة شاملة",
  },
];

export default function LandingServices() {
  return (
    <section id="services" className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#88a531]/10 text-[#556e17] text-xs font-bold tracking-wide mb-3">
            خدمات ألفا كير الطبية
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
            حلول متكاملة في العلاج الطبيعي والتأهيل الحركي
          </h2>
          <p className="mt-4 text-base text-gray-600 leading-relaxed">
            نعتمد في ألفا كير على أحدث البروتوكولات العلاجية العالمية لتوفير علاج فعال وآمن يضمن شفاءك واستعادة نشاطك بأفضل نتيجة ممكنة.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-7 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-[#88a531] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#88a531]/10 text-[#88a531] flex items-center justify-center text-2xl group-hover:bg-[#88a531] group-hover:text-white transition-all duration-300 shadow-xs">
                      <Icon />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700 group-hover:bg-[#88a531]/15 group-hover:text-[#556e17] transition">
                      {s.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#556e17] transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href="#booking-card"
                    className="text-xs font-bold text-[#88a531] hover:text-[#556e17] transition flex items-center gap-1"
                  >
                    <span>احجز استشارتك</span>
                    <span>←</span>
                  </a>
                  <span className="text-xs text-gray-400">جلسات فردية مجهزة</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

