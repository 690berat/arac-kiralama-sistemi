import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Edit3,
  Fuel,
  Gauge,
  Heart,
  Snowflake,
  Trash2,
  Users,
} from "lucide-react";
import { DURUM_ETIKETLERI } from "../interfaces/Arac";

const durumStilleri = {
  musait: {
    rozet: "border-teal/30 bg-teal/15 text-teal",
    nokta: "bg-teal",
  },
  kirada: {
    rozet: "border-amber/35 bg-amber/15 text-amber",
    nokta: "bg-amber",
  },
  bakimda: {
    rozet: "border-tehlike/30 bg-tehlike/15 text-tehlike",
    nokta: "bg-tehlike",
  },
};

export default function AracKarti({
  arac,
  onDurumDegistir,
  onDuzenle,
  onSil,
  yonetim = true,
  git,
  favoriMi = false,
  favoriDegistir,
}) {
  const stil = durumStilleri[arac.durum] || durumStilleri.musait;

  const vites = arac.vites || "Manuel";
  const yakit = arac.yakit || "Benzin";
  const kisiSayisi = Number(arac.kisiSayisi) || 5;
  const kapiSayisi = Number(arac.kapiSayisi) || 5;
  const bagaj = arac.bagaj || "Orta";
  const klima = arac.klima === false ? "Yok" : "Var";
  const kilometre = Math.max(0, Number(arac.kilometre ?? arac.km ?? 0));
  const kapakResmi =
    (Array.isArray(arac.resimler) &&
      arac.resimler.find((resim) => String(resim || "").trim())) ||
    arac.resimUrl ||
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop";

  const sil = () => {
    const onay = window.confirm(
      `${arac.marka} ${arac.model} aracını silmek istediğinize emin misiniz?`,
    );

    if (onay && onSil) {
      onSil(arac.id);
    }
  };

  const araciAc = (e) => {
    e.preventDefault();
    const hedef = `/arac/${arac.id}`;

    if (git) {
      git(hedef);
    } else {
      window.location.assign(hedef);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#1b1e24] shadow-[0_22px_60px_rgba(0,0,0,0.22)] transition duration-300 hover:border-amber/35 hover:shadow-[0_28px_80px_rgba(0,0,0,0.34)]"
    >
      <div className="relative h-[235px] overflow-hidden bg-gradient-to-br from-[#282c35] to-[#15171c]">
        <img
          src={kapakResmi}
          alt={`${arac.marka} ${arac.model}`}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.07]"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#15171c] via-[#15171c]/10 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#15171c] to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-xl">
            {arac.sinif}
          </span>
        </div>

        <div className="absolute right-4 top-4 flex items-center gap-2">
          {!yonetim && favoriDegistir && (
            <button
              type="button"
              onClick={() => favoriDegistir(arac.id)}
              aria-label={favoriMi ? "Favorilerden çıkar" : "Favorilere ekle"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-xl transition hover:border-amber/40 hover:text-amber"
            >
              <Heart
                size={16}
                className={favoriMi ? "fill-amber text-amber" : ""}
              />
            </button>
          )}

          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold backdrop-blur-xl ${stil.rozet}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${stil.nokta}`} />
            {DURUM_ETIKETLERI[arac.durum] || "Müsait"}
          </span>
        </div>

        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber">
              {arac.yil} model
            </p>

            <h3 className="mt-1 truncate font-display text-2xl font-bold leading-none text-white">
              {arac.marka} {arac.model}
            </h3>
          </div>

          <span className="plaka-badge shrink-0 px-2.5 py-1 text-[11px] font-bold shadow-lg">
            {arac.plaka}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Ozellik
            icon={Gauge}
            baslik="Kilometre"
            deger={`${kilometre.toLocaleString("tr-TR")} km`}
          />
          <Ozellik icon={Fuel} baslik="Yakıt" deger={yakit} />
          <Ozellik icon={CarFront} baslik="Vites" deger={vites} />
          <Ozellik
            icon={Users}
            baslik="Kapasite"
            deger={`${kisiSayisi} Kişi`}
          />
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Ozellik
            icon={CalendarDays}
            baslik="Model"
            deger={arac.yil}
          />
          <Ozellik
            icon={CarFront}
            baslik="Kapı"
            deger={`${kapiSayisi} Kapı`}
          />
          <Ozellik
            icon={BriefcaseBusiness}
            baslik="Bagaj"
            deger={bagaj}
          />
          <Ozellik
            icon={Snowflake}
            baslik="Klima"
            deger={klima}
          />
        </div>

        <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-metinSoft">
              Günlük kiralama
            </p>

            <div className="mt-1 flex items-end gap-1">
              <span className="font-display text-3xl font-extrabold leading-none text-amber">
                ₺{Number(arac.gunlukFiyat || 0).toLocaleString("tr-TR")}
              </span>

              <span className="pb-0.5 text-xs text-metinSoft">/ gün</span>
            </div>
          </div>

          {arac.durum === "musait" && (
            <span className="hidden items-center gap-1.5 text-xs font-semibold text-teal sm:flex">
              <CheckCircle2 size={15} />
              Hemen uygun
            </span>
          )}
        </div>

        {yonetim ? (
          <div className="mt-5 flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <select
                value={arac.durum}
                onChange={(e) => onDurumDegistir?.(arac.id, e.target.value)}
                aria-label={`${arac.marka} ${arac.model} durumunu değiştir`}
                className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.045] px-3 pr-8 text-xs font-semibold text-metin outline-none transition hover:border-amber/30 focus:border-amber focus:ring-4 focus:ring-amber/10"
              >
                <option value="musait">Müsait</option>
                <option value="kirada">Kirada</option>
                <option value="bakimda">Bakımda</option>
              </select>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-metinSoft">
                ▼
              </span>
            </div>

            <button
              type="button"
              onClick={() => onDuzenle?.(arac)}
              title="Aracı düzenle"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] text-metinSoft transition hover:border-amber/40 hover:bg-amber/10 hover:text-amber"
            >
              <Edit3 size={17} />
            </button>

            <button
              type="button"
              onClick={sil}
              title="Aracı sil"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-tehlike/20 bg-tehlike/[0.04] text-tehlike/80 transition hover:border-tehlike/40 hover:bg-tehlike/10 hover:text-tehlike"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ) : (
          <a
            href={`/arac/${arac.id}`}
            onClick={araciAc}
            className="mt-5 flex h-12 items-center justify-center rounded-xl bg-amber text-sm font-extrabold text-asfalt transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Aracı İncele ve Kirala
          </a>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-12 -bottom-20 h-28 rounded-full bg-amber/10 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />
    </motion.article>
  );
}

function Ozellik({ icon: Icon, baslik, deger }) {
  return (
    <div className="flex min-w-0 flex-col items-center rounded-xl border border-white/[0.06] bg-white/[0.035] px-1.5 py-3 text-center transition hover:border-amber/20 hover:bg-amber/[0.035]">
      <Icon size={16} className="text-amber" />

      <span className="mt-2 text-[9px] uppercase tracking-wide text-metinSoft/75">
        {baslik}
      </span>

      <span
        title={String(deger)}
        className="mt-0.5 max-w-full truncate text-[10px] font-semibold text-metin"
      >
        {deger}
      </span>
    </div>
  );
}
