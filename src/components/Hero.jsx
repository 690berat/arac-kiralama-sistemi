import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  Headphones,
  MapPin,
  ShieldCheck,
} from "lucide-react";

// Ekran genişliğine uygun görsel yükle: büyük dosyaları telefona indirme.
const HERO_IMAGE = "https://images.unsplash.com/photo-1504215680853-026ed2a45def";
const heroSrc = (width) => `${HERO_IMAGE}?q=75&w=${width}&auto=format&fit=crop`;

const avantajlar = [
  { icon: CheckCircle2, title: "Uygun Fiyat", text: "En iyi fiyat garantisi" },
  { icon: ShieldCheck, title: "Güvenli Kiralama", text: "Sigortalı ve güvenli araçlar" },
  { icon: Headphones, title: "7/24 Destek", text: "Her zaman yanınızdayız" },
];

// İçerik ilk kareden itibaren görünür; kısa hareket animasyonu gecikme yaratmaz.
const girisAnimasyonu = {
  initial: { opacity: 1, y: 9 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.24, ease: "easeOut" },
};

export default function Hero({ git }) {
  const araclaraGit = () => {
    git ? git("/araclar") : window.location.assign("/araclar");
  };

  const aramaYap = (e) => {
    e.preventDefault();
    araclaraGit();
  };

  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#07090d] pt-20">
      <div className="absolute inset-0 -z-20 bg-[#07090d]">
        <img
          src={heroSrc(1600)}
          srcSet={[
            `${heroSrc(640)} 640w`,
            `${heroSrc(960)} 960w`,
            `${heroSrc(1280)} 1280w`,
            `${heroSrc(1600)} 1600w`,
            `${heroSrc(1920)} 1920w`,
          ].join(", ")}
          sizes="100vw"
          alt="Sahil yolunda lüks kiralık araç"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[61%_center] sm:object-[64%_center] lg:object-[68%_center]"
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,7,11,0.98)_0%,rgba(4,7,11,0.94)_34%,rgba(4,7,11,0.62)_56%,rgba(4,7,11,0.15)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,7,11,0.15)_0%,rgba(4,7,11,0.06)_55%,rgba(4,7,11,0.92)_100%)]" />
      <div className="absolute -right-24 top-8 -z-10 h-[420px] w-[420px] rounded-full bg-amber/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-10 lg:pt-20">
        <motion.div {...girisAnimasyonu} className="max-w-[650px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white/90 shadow-lg backdrop-blur-xl">
            <ShieldCheck size={15} className="text-amber" />
            Güvenli, hızlı ve kolay araç kiralama
          </span>

          <h1 className="mt-7 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[68px]">
            Hayalinizdeki aracı
            <span className="mt-1 block text-amber">kolayca kiralayın</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
            Geniş araç filomuz, şeffaf fiyatlarımız ve kesintisiz desteğimizle
            yolculuğunuza güvenle başlayın.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/araclar"
              onClick={(e) => {
                e.preventDefault();
                araclaraGit();
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-amber px-6 py-3.5 text-sm font-extrabold text-asfalt shadow-[0_14px_40px_rgba(255,182,39,0.24)] transition duration-300 hover:-translate-y-1 hover:brightness-110"
            >
              Araçları İncele
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#neden-biz"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10"
            >
              Hizmetlerimiz
            </a>
          </div>
        </motion.div>

        <div className="mt-11 grid max-w-3xl gap-3 sm:grid-cols-3">
          {avantajlar.map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              {...girisAnimasyonu}
              whileHover={{ y: -4 }}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-3 backdrop-blur-md"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber/40 bg-amber/10 text-amber">
                <Icon size={19} />
              </span>
              <div>
                <p className="text-sm font-bold text-white">{title}</p>
                <p className="mt-0.5 text-xs text-white/55">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.form
          onSubmit={aramaYap}
          {...girisAnimasyonu}
          className="mt-10 grid gap-4 rounded-3xl border border-white/15 bg-[#101216]/88 p-5 shadow-[0_28px_70px_rgba(0,0,0,0.48)] backdrop-blur-2xl md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_.82fr_auto] lg:items-end lg:gap-5 lg:p-6"
        >
          <SearchField label="Alış Lokasyonu" icon={MapPin}>
            <input required type="text" placeholder="Lokasyon seçin" className="booking-input" />
          </SearchField>

          <SearchField label="Alış Tarihi" icon={CalendarDays}>
            <input required type="date" className="booking-input" />
          </SearchField>

          <SearchField label="Bitiş Tarihi" icon={CalendarDays}>
            <input required type="date" className="booking-input" />
          </SearchField>

          <SearchField label="Araç Tipi" icon={Car}>
            <select className="booking-input">
              <option value="hepsi">Tümü</option>
              <option value="ekonomi">Ekonomi</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="luks">Lüks</option>
            </select>
          </SearchField>

          <button
            type="submit"
            className="group flex h-[56px] min-w-[170px] items-center justify-center gap-2 rounded-xl bg-amber px-7 text-sm font-extrabold text-asfalt shadow-[0_12px_35px_rgba(255,182,39,0.23)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
          >
            Araçları Göster
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function SearchField({ label, icon: Icon, children }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-bold text-white/80">{label}</span>
      <span className="relative block">
        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-amber"
        />
        {children}
      </span>
    </label>
  );
}
