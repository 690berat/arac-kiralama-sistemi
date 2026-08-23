import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BriefcaseBusiness,
  CarFront,
  Check,
  Fuel,
  Gauge,
  ImagePlus,
  Plus,
  Trash2,
  Settings2,
  ShieldCheck,
  Snowflake,
  Users,
} from "lucide-react";

const siniflar = ["Ekonomi", "Orta Sınıf", "SUV", "Lüks"];
const yakitTurleri = ["Benzin", "Dizel", "Hibrit", "Elektrik"];
const vitesTurleri = ["Manuel", "Otomatik", "Yarı Otomatik"];
const kisiKapasiteleri = [2, 4, 5, 7, 8];
const kapiSayilari = [2, 3, 4, 5];
const bagajKapasiteleri = ["Küçük", "Orta", "Büyük"];

export const DONANIMLAR = [
  "ABS",
  "ESP",
  "Kör Nokta Uyarı Sistemi",
  "Çarpışma Önleyici Fren",
  "Şerit Takip Asistanı",
  "Adaptif Hız Sabitleyici",
  "Yokuş Kalkış Desteği",
  "Geri Görüş Kamerası",
  "360° Kamera",
  "Ön Park Sensörü",
  "Arka Park Sensörü",
  "Anahtarsız Giriş",
  "Sunroof",
  "Deri Koltuk",
  "Isıtmalı Koltuk",
  "Elektrikli Bagaj",
  "Apple CarPlay",
  "Android Auto",
  "Bluetooth",
  "Kablosuz Şarj",
  "Navigasyon",
  "LED Farlar",
  "Otomatik Far Sistemi",
  "Yağmur Sensörü",
];

const BASLANGIC_FORMU = {
  marka: "",
  model: "",
  yil: new Date().getFullYear(),
  plaka: "",
  sinif: "Ekonomi",
  gunlukFiyat: "",
  kilometre: "",
  resimler: [""],
  yakit: "Benzin",
  vites: "Manuel",
  kisiSayisi: 5,
  kapiSayisi: 5,
  bagaj: "Orta",
  klima: true,
  donanimlar: [],
};

export default function AracForm({ onKaydet, duzenlenenArac, onIptal }) {
  const [form, setForm] = useState(BASLANGIC_FORMU);

  useEffect(() => {
    if (duzenlenenArac) {
      setForm({
        marka: duzenlenenArac.marka || "",
        model: duzenlenenArac.model || "",
        yil: duzenlenenArac.yil || new Date().getFullYear(),
        plaka: duzenlenenArac.plaka || "",
        sinif: duzenlenenArac.sinif || "Ekonomi",
        gunlukFiyat: duzenlenenArac.gunlukFiyat || "",
        kilometre: duzenlenenArac.kilometre ?? duzenlenenArac.km ?? "",
        resimler:
          Array.isArray(duzenlenenArac.resimler) &&
          duzenlenenArac.resimler.length
            ? duzenlenenArac.resimler
            : [duzenlenenArac.resimUrl || ""],
        yakit: duzenlenenArac.yakit || "Benzin",
        vites: duzenlenenArac.vites || "Manuel",
        kisiSayisi: duzenlenenArac.kisiSayisi || 5,
        kapiSayisi: duzenlenenArac.kapiSayisi || 5,
        bagaj: duzenlenenArac.bagaj || "Orta",
        klima: duzenlenenArac.klima ?? true,
        donanimlar: Array.isArray(duzenlenenArac.donanimlar)
          ? duzenlenenArac.donanimlar.filter((donanim) => DONANIMLAR.includes(donanim))
          : [],
      });
    } else {
      setForm({ ...BASLANGIC_FORMU, yil: new Date().getFullYear(), donanimlar: [], resimler: [""] });
    }
  }, [duzenlenenArac]);

  const alanGuncelle = (alan, deger) => {
    setForm((onceki) => ({ ...onceki, [alan]: deger }));
  };

  const resimGuncelle = (index, deger) => {
    setForm((onceki) => ({
      ...onceki,
      resimler: onceki.resimler.map((resim, sira) =>
        sira === index ? deger : resim,
      ),
    }));
  };

  const resimEkle = () => {
    setForm((onceki) => {
      if (onceki.resimler.length >= 8) return onceki;

      return {
        ...onceki,
        resimler: [...onceki.resimler, ""],
      };
    });
  };

  const resimSil = (index) => {
    setForm((onceki) => {
      const yeniResimler = onceki.resimler.filter(
        (_, sira) => sira !== index,
      );

      return {
        ...onceki,
        resimler: yeniResimler.length ? yeniResimler : [""],
      };
    });
  };

  const donanimDegistir = (donanim) => {
    setForm((onceki) => ({
      ...onceki,
      donanimlar: onceki.donanimlar.includes(donanim)
        ? onceki.donanimlar.filter((item) => item !== donanim)
        : [...onceki.donanimlar, donanim],
    }));
  };

  const tumunuDegistir = () => {
    setForm((onceki) => ({
      ...onceki,
      donanimlar: onceki.donanimlar.length === DONANIMLAR.length ? [] : [...DONANIMLAR],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.marka.trim() || !form.model.trim() || !form.plaka.trim()) return;

    onKaydet({
      id: duzenlenenArac ? duzenlenenArac.id : crypto.randomUUID(),
      marka: form.marka.trim(),
      model: form.model.trim(),
      yil: Number(form.yil),
      plaka: form.plaka.trim().toUpperCase(),
      sinif: form.sinif,
      gunlukFiyat: Number(form.gunlukFiyat) || 0,
      kilometre: Math.max(0, Number(form.kilometre) || 0),
      yakit: form.yakit,
      vites: form.vites,
      kisiSayisi: Number(form.kisiSayisi),
      kapiSayisi: Number(form.kapiSayisi),
      bagaj: form.bagaj,
      klima: Boolean(form.klima),
      donanimlar: form.donanimlar,
      durum: duzenlenenArac ? duzenlenenArac.durum : "musait",
      resimler: (() => {
        const temizResimler = form.resimler
          .map((resim) => resim.trim())
          .filter(Boolean);

        return temizResimler.length
          ? temizResimler
          : [
              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop",
            ];
      })(),
      resimUrl:
        form.resimler.find((resim) => resim.trim())?.trim() ||
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop",
    });

    if (!duzenlenenArac) {
      setForm({ ...BASLANGIC_FORMU, yil: new Date().getFullYear(), donanimlar: [], resimler: [""] });
    }
  };

  const inputSinifi =
    "w-full rounded-xl border border-kenar bg-panelLight px-3 py-2.5 text-sm text-metin outline-none transition placeholder:text-metinSoft/40 focus:border-amber focus:ring-2 focus:ring-amber/20";

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className={`space-y-5 rounded-2xl border bg-panel p-6 transition-colors ${
        duzenlenenArac ? "border-amber/40" : "border-kenar"
      }`}
    >
      <div className="flex items-center gap-3">
        <motion.span
          key={duzenlenenArac ? "duzenle" : "ekle"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber/20 bg-amber/10 text-amber"
        >
          <CarFront size={20} />
        </motion.span>

        <div>
          <AnimatePresence mode="wait">
            <motion.h2
              key={duzenlenenArac ? "duzenle-baslik" : "ekle-baslik"}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="font-display text-lg font-semibold tracking-wide text-metin uppercase"
            >
              {duzenlenenArac ? "Aracı Güncelle" : "Filoya Araç Ekle"}
            </motion.h2>
          </AnimatePresence>
          <p className="mt-1 text-xs text-metinSoft">Araç bilgilerini ve donanımlarını seçin.</p>
        </div>
      </div>

      <FormBolumu baslik="Temel Araç Bilgileri">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormAlani label="Marka">
            <input value={form.marka} onChange={(e) => alanGuncelle("marka", e.target.value)} placeholder="Volkswagen" className={inputSinifi} required />
          </FormAlani>
          <FormAlani label="Model">
            <input value={form.model} onChange={(e) => alanGuncelle("model", e.target.value)} placeholder="Golf" className={inputSinifi} required />
          </FormAlani>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormAlani label="Model Yılı">
            <input type="number" value={form.yil} onChange={(e) => alanGuncelle("yil", e.target.value)} min="1990" max="2035" className={inputSinifi} />
          </FormAlani>
          <FormAlani label="Plaka">
            <input value={form.plaka} onChange={(e) => alanGuncelle("plaka", e.target.value)} placeholder="34 ABC 123" className={`${inputSinifi} uppercase`} required />
          </FormAlani>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormAlani label="Araç Sınıfı">
            <select value={form.sinif} onChange={(e) => alanGuncelle("sinif", e.target.value)} className={inputSinifi}>
              {siniflar.map((sinif) => <option key={sinif} value={sinif}>{sinif}</option>)}
            </select>
          </FormAlani>
          <FormAlani label="Günlük Fiyat (₺)">
            <input type="number" value={form.gunlukFiyat} onChange={(e) => alanGuncelle("gunlukFiyat", e.target.value)} placeholder="1200" min="0" className={inputSinifi} required />
          </FormAlani>
        </div>

        <SecimAlani label="Kilometre" icon={Gauge}>
          <input
            type="number"
            value={form.kilometre}
            onChange={(e) => alanGuncelle("kilometre", e.target.value)}
            placeholder="45000"
            min="0"
            step="100"
            className={inputSinifi}
            required
          />
          <p className="mt-1.5 text-[10px] text-metinSoft/60">
            Örnek: 45.000 km için 45000 yazın.
          </p>
        </SecimAlani>
      </FormBolumu>

      <FormBolumu baslik="Araç Özellikleri">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SecimAlani label="Yakıt Türü" icon={Fuel}>
            <select value={form.yakit} onChange={(e) => alanGuncelle("yakit", e.target.value)} className={inputSinifi}>
              {yakitTurleri.map((yakit) => <option key={yakit} value={yakit}>{yakit}</option>)}
            </select>
          </SecimAlani>
          <SecimAlani label="Vites Türü" icon={Settings2}>
            <select value={form.vites} onChange={(e) => alanGuncelle("vites", e.target.value)} className={inputSinifi}>
              {vitesTurleri.map((vites) => <option key={vites} value={vites}>{vites}</option>)}
            </select>
          </SecimAlani>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SecimAlani label="Kişi Kapasitesi" icon={Users}>
            <select value={form.kisiSayisi} onChange={(e) => alanGuncelle("kisiSayisi", Number(e.target.value))} className={inputSinifi}>
              {kisiKapasiteleri.map((sayi) => <option key={sayi} value={sayi}>{sayi} Kişilik</option>)}
            </select>
          </SecimAlani>
          <SecimAlani label="Kapı Sayısı" icon={CarFront}>
            <select value={form.kapiSayisi} onChange={(e) => alanGuncelle("kapiSayisi", Number(e.target.value))} className={inputSinifi}>
              {kapiSayilari.map((sayi) => <option key={sayi} value={sayi}>{sayi} Kapı</option>)}
            </select>
          </SecimAlani>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SecimAlani label="Bagaj Kapasitesi" icon={BriefcaseBusiness}>
            <select value={form.bagaj} onChange={(e) => alanGuncelle("bagaj", e.target.value)} className={inputSinifi}>
              {bagajKapasiteleri.map((bagaj) => <option key={bagaj} value={bagaj}>{bagaj}</option>)}
            </select>
          </SecimAlani>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-metinSoft">Klima</label>
            <button
              type="button"
              onClick={() => alanGuncelle("klima", !form.klima)}
              className={`flex h-[42px] w-full items-center justify-between rounded-xl border px-3 text-sm transition ${
                form.klima ? "border-teal/40 bg-teal/10 text-teal" : "border-kenar bg-panelLight text-metinSoft"
              }`}
            >
              <span className="flex items-center gap-2"><Snowflake size={17} />{form.klima ? "Klima Var" : "Klima Yok"}</span>
              <span className={`relative h-6 w-11 rounded-full transition ${form.klima ? "bg-teal" : "bg-white/10"}`}>
                <motion.span animate={{ x: form.klima ? 21 : 3 }} transition={{ duration: 0.2 }} className="absolute top-1 h-4 w-4 rounded-full bg-white shadow" />
              </span>
            </button>
          </div>
        </div>
      </FormBolumu>

      <FormBolumu baslik="Araç Donanımları">
        <div className="flex flex-col gap-3 rounded-xl border border-amber/15 bg-amber/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber/20 bg-amber/10 text-amber"><ShieldCheck size={19} /></span>
            <div>
              <p className="text-sm font-semibold text-metin">{form.donanimlar.length} özellik seçildi</p>
              <p className="mt-0.5 text-xs text-metinSoft">Araçta bulunan özellikleri işaretleyin.</p>
            </div>
          </div>
          <button type="button" onClick={tumunuDegistir} className="w-fit text-xs font-semibold text-amber transition hover:brightness-125">
            {form.donanimlar.length === DONANIMLAR.length ? "Tümünü kaldır" : "Tümünü seç"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {DONANIMLAR.map((donanim) => {
            const secili = form.donanimlar.includes(donanim);
            return (
              <button
                key={donanim}
                type="button"
                onClick={() => donanimDegistir(donanim)}
                aria-pressed={secili}
                className={`flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                  secili
                    ? "border-amber/45 bg-amber/10 text-metin"
                    : "border-white/[0.07] bg-white/[0.025] text-metinSoft hover:border-amber/25 hover:text-metin"
                }`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${secili ? "border-amber bg-amber text-asfalt" : "border-white/15 bg-black/10"}`}>
                  {secili && <Check size={13} strokeWidth={3} />}
                </span>
                <span className="leading-5">{donanim}</span>
              </button>
            );
          })}
        </div>
      </FormBolumu>

      <FormBolumu baslik="Araç Fotoğrafları">
        <div className="flex flex-col gap-3 rounded-xl border border-amber/15 bg-amber/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber/20 bg-amber/10 text-amber">
              <ImagePlus size={19} />
            </span>

            <div>
              <p className="text-sm font-semibold text-metin">
                {form.resimler.filter((resim) => resim.trim()).length} fotoğraf eklendi
              </p>
              <p className="mt-0.5 text-xs text-metinSoft">
                İlk fotoğraf araç kartında kapak görseli olur.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resimEkle}
            disabled={form.resimler.length >= 8}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-amber/25 bg-amber/10 px-3 py-2 text-xs font-semibold text-amber transition hover:bg-amber/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={15} />
            Fotoğraf Alanı Ekle
          </button>
        </div>

        <div className="space-y-3">
          {form.resimler.map((resim, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-medium text-metinSoft">
                  {index === 0
                    ? "Kapak Fotoğrafı"
                    : `${index + 1}. Fotoğraf`}
                </label>

                {form.resimler.length > 1 && (
                  <button
                    type="button"
                    onClick={() => resimSil(index)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-tehlike/20 bg-tehlike/[0.05] px-2.5 py-1.5 text-[10px] font-semibold text-tehlike transition hover:bg-tehlike/10"
                  >
                    <Trash2 size={13} />
                    Kaldır
                  </button>
                )}
              </div>

              <input
                value={resim}
                onChange={(e) =>
                  resimGuncelle(index, e.target.value)
                }
                placeholder="https://..."
                className={`${inputSinifi} mt-2`}
              />

              {resim.trim() && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 overflow-hidden rounded-xl border border-kenar bg-panelLight"
                >
                  <img
                    src={resim}
                    alt={`${index + 1}. araç fotoğrafı ön izlemesi`}
                    className="h-36 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.opacity = "0.25";
                    }}
                    onLoad={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <p className="text-[10px] leading-5 text-metinSoft/60">
          En fazla 8 fotoğraf ekleyebilirsiniz. Ön, arka, yan ve iç
          mekân fotoğrafları kullanmanız önerilir.
        </p>
      </FormBolumu>

      <div className="flex gap-2 pt-1">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="flex-1 rounded-xl bg-amber px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-asfalt transition hover:brightness-110">
          {duzenlenenArac ? "Aracı Güncelle" : "Filoya Ekle"}
        </motion.button>
        {duzenlenenArac && (
          <motion.button initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={onIptal} className="whitespace-nowrap rounded-xl border border-kenar px-4 py-3 text-sm text-metinSoft transition hover:bg-panelLight hover:text-metin">
            İptal
          </motion.button>
        )}
      </div>
    </motion.form>
  );
}

function FormBolumu({ baslik, children }) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber">{baslik}</p>
      {children}
    </div>
  );
}

function FormAlani({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-metinSoft">{label}</label>
      {children}
    </div>
  );
}

function SecimAlani({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-metinSoft"><Icon size={14} className="text-amber" />{label}</label>
      {children}
    </div>
  );
}
