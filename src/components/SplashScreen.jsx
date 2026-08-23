import { motion } from "framer-motion";
import { CarFront, ChevronRight, Code2 } from "lucide-react";

const parcaciklar = [
  { left: "8%", top: "18%", delay: 0.1, duration: 4.2 },
  { left: "17%", top: "72%", delay: 0.8, duration: 5.1 },
  { left: "31%", top: "24%", delay: 1.2, duration: 4.7 },
  { left: "46%", top: "84%", delay: 0.4, duration: 5.4 },
  { left: "63%", top: "15%", delay: 1.5, duration: 4.5 },
  { left: "78%", top: "72%", delay: 0.7, duration: 5.2 },
  { left: "91%", top: "25%", delay: 1.1, duration: 4.9 },
];

const selektorAnimasyonu = {
  opacity: [0, 1, 0.12, 1, 0],
  scale: [0.72, 1.22, 0.9, 1.18, 0.8],
};

const selektorGecisi = {
  delay: 1.2,
  duration: 1.15,
  times: [0, 0.15, 0.34, 0.52, 1],
  ease: "easeInOut",
};

export default function SplashScreen({ onTamamla }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -18, filter: "blur(10px)" }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-[#07090d] px-5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_34%,rgba(255,182,39,0.16),transparent_34%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07090d] via-[#07090d]/95 to-[#11151c]" />

      <motion.div
        animate={{
          x: [-30, 25, -30],
          y: [-12, 12, -12],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-40 top-1/4 h-[430px] w-[430px] rounded-full bg-amber/10 blur-[145px]"
      />

      {parcaciklar.map((parcacik, index) => (
        <motion.span
          key={index}
          animate={{
            opacity: [0.06, 0.7, 0.06],
            y: [10, -14, 10],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            delay: parcacik.delay,
            duration: parcacik.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: parcacik.left,
            top: parcacik.top,
          }}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-amber shadow-[0_0_14px_rgba(255,182,39,0.9)]"
        />
      ))}

      {/* Gerçek araç ve selektör efekti */}
      <motion.div
        initial={{ opacity: 0, x: 180, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.25, ease: "easeOut" }}
        className="pointer-events-none absolute right-[-3%] top-[25%] hidden w-[min(66vw,1080px)] -translate-y-1/2 lg:block xl:top-[23%]"
      >
        <div className="relative">
          <img
            src="/images/splash-car.png"
            alt="RentCar lüks araç"
            className="w-full select-none object-contain opacity-90 mix-blend-screen drop-shadow-[0_45px_90px_rgba(0,0,0,0.85)]"
          />

          {/* Sol far */}
          <motion.span
            animate={selektorAnimasyonu}
            transition={selektorGecisi}
            className="absolute left-[23.8%] top-[49.5%] h-[8.5%] w-[17%] rounded-[50%] bg-white blur-[13px] shadow-[0_0_55px_18px_rgba(255,244,205,0.95)]"
          />

          {/* Sağ far */}
          <motion.span
            animate={selektorAnimasyonu}
            transition={selektorGecisi}
            className="absolute right-[21.8%] top-[49.5%] h-[8.5%] w-[17%] rounded-[50%] bg-white blur-[13px] shadow-[0_0_55px_18px_rgba(255,244,205,0.95)]"
          />

          {/* Sol far huzmesi */}
          <motion.div
            animate={{
              opacity: [0, 0.42, 0.04, 0.38, 0],
              scaleX: [0.55, 1.08, 0.7, 1, 0.65],
            }}
            transition={selektorGecisi}
            className="absolute left-[-12%] top-[47%] h-[16%] w-[72%] origin-right -rotate-2 bg-[linear-gradient(90deg,transparent,rgba(255,246,210,0.18),rgba(255,255,255,0.38))] blur-2xl"
          />

          {/* Sağ far huzmesi */}
          <motion.div
            animate={{
              opacity: [0, 0.42, 0.04, 0.38, 0],
              scaleX: [0.55, 1.08, 0.7, 1, 0.65],
            }}
            transition={selektorGecisi}
            className="absolute right-[-12%] top-[47%] h-[16%] w-[72%] origin-left rotate-2 bg-[linear-gradient(270deg,transparent,rgba(255,246,210,0.18),rgba(255,255,255,0.38))] blur-2xl"
          />
        </div>
      </motion.div>

      {/* Sol içerik */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex w-full max-w-lg flex-col items-center text-center lg:mr-[46%]"
      >
        {/* Logo */}
        <motion.div
          initial={{ rotate: -10, scale: 0.75 }}
          animate={{
            rotate: 0,
            scale: [1, 1.045, 1],
          }}
          transition={{
            rotate: {
              delay: 0.15,
              duration: 0.65,
              type: "spring",
            },
            scale: {
              delay: 0.7,
              duration: 2.4,
              repeat: Infinity,
            },
          }}
          className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] border border-amber/30 bg-amber shadow-[0_24px_80px_rgba(255,182,39,0.3)]"
        >
          <motion.span
            initial={{ x: "-180%" }}
            animate={{ x: "220%" }}
            transition={{
              delay: 0.8,
              duration: 1.2,
              repeat: Infinity,
              repeatDelay: 2.4,
            }}
            className="absolute inset-y-0 w-10 rotate-12 bg-gradient-to-r from-transparent via-white/65 to-transparent blur-sm"
          />

          <CarFront
            size={47}
            strokeWidth={2.1}
            className="relative z-10 text-asfalt"
          />
        </motion.div>

        {/* Marka */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.55 }}
          className="mt-7"
        >
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Rent<span className="text-amber">Car</span>
          </h1>

          <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-white/45">
            Yolculuğun özgür olsun
          </p>
        </motion.div>

        {/* Yükleme çubuğu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.55 }}
          className="mt-12 w-full"
        >
          <div className="relative mx-auto h-2 w-full max-w-xs overflow-hidden rounded-full border border-white/5 bg-white/[0.07]">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                delay: 0.25,
                duration: 4.75,
                ease: "easeInOut",
              }}
              className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#e89a10] via-amber to-[#ffd36b] shadow-[0_0_22px_rgba(255,182,39,0.7)]"
            >
              <motion.span
                initial={{ x: "-140%" }}
                animate={{ x: "240%" }}
                transition={{
                  duration: 1.15,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-y-0 w-20 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/70 to-transparent blur-sm"
              />
            </motion.div>
          </div>

          <p className="mt-4 text-xs text-white/35">
            Araç filonuz hazırlanıyor...
          </p>
        </motion.div>

        {/* İmza */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.5 }}
          className="mt-10 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.035] px-6 py-4 backdrop-blur-xl"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber/25 bg-amber/10 text-amber">
            <Code2 size={17} />
          </span>

          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
              Tasarlayan ve geliştiren
            </p>

            <p className="mt-1 font-display text-base font-bold text-white">
              Eyyüp Berat Kolsuzoğlu
            </p>
          </div>
        </motion.div>

        {/* Atla butonu */}
        <button
          type="button"
          onClick={onTamamla}
          className="mt-7 inline-flex items-center gap-1 text-xs font-semibold text-white/35 transition hover:text-amber"
        >
          Atla
          <ChevronRight size={14} />
        </button>
      </motion.div>

      {/* Alt bilgi */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/25">
        © 2026 RentCar · Tüm hakları saklıdır.
      </div>

      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-amber/50 to-transparent" />
    </motion.div>
  );
}
