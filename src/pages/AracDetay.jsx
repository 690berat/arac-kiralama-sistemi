import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Expand,
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  Fuel,
  Gauge,
  Heart,
  ShieldCheck,
  Snowflake,
  Star,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AracDetay({
  arac,
  git,
  favoriMi,
  favoriDegistir,
  kullanici,
  cikisYap,
  yorumlar = [],
  yorumEkle,
}) {
  const [puan, setPuan] = useState(5);
  const [yorum, setYorum] = useState("");
  const [aktifResim, setAktifResim] = useState(0);
  const [tamEkranAcik, setTamEkranAcik] = useState(false);

  useEffect(() => {
    if (!tamEkranAcik) return;
    const eskiOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const klavye = (event) => {
      if (event.key === "Escape") setTamEkranAcik(false);
      if (event.key === "ArrowLeft") setAktifResim((n) => (n - 1 + galeriUzunluk.current) % galeriUzunluk.current);
      if (event.key === "ArrowRight") setAktifResim((n) => (n + 1) % galeriUzunluk.current);
    };
    window.addEventListener("keydown", klavye);
    return () => {
      document.body.style.overflow = eskiOverflow;
      window.removeEventListener("keydown", klavye);
    };
  }, [tamEkranAcik]);

  const galeriUzunluk = useMemo(() => ({ current: Math.max(1, arac?.resimler?.filter(Boolean)?.length || (arac?.resimUrl ? 1 : 1)) }), [arac]);

  const ortalama = useMemo(() => {
    if (!yorumlar.length) return "Yeni";
    return (
      yorumlar.reduce((toplam, item) => toplam + Number(item.puan || 0), 0) /
      yorumlar.length
    ).toFixed(1);
  }, [yorumlar]);

  if (!arac) {
    return (
      <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-asfalt">
        <Navbar git={git} kullanici={kullanici} cikisYap={cikisYap} />
        <div className="pt-40 text-center text-white">
          <h1 className="text-3xl font-bold">Araç bulunamadı</h1>
          <button onClick={() => git("/araclar")} className="mt-6 rounded-xl bg-amber px-6 py-3 font-bold text-asfalt">Araçlara dön</button>
        </div>
      </div>
    );
  }

  const donanimlar = Array.isArray(arac.donanimlar) ? arac.donanimlar : [];

  const resimler = (
    Array.isArray(arac.resimler) && arac.resimler.length
      ? arac.resimler
      : [arac.resimUrl]
  )
    .map((resim) => String(resim || "").trim())
    .filter(Boolean);

  const galeriResimleri = resimler.length
    ? resimler
    : [
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
      ];

  const oncekiResim = () => {
    setAktifResim((onceki) =>
      onceki === 0 ? galeriResimleri.length - 1 : onceki - 1,
    );
  };

  const sonrakiResim = () => {
    setAktifResim((onceki) =>
      onceki === galeriResimleri.length - 1 ? 0 : onceki + 1,
    );
  };

  const kilometre = Math.max(
    0,
    Number(arac.kilometre ?? arac.km ?? 0),
  );

  const teknikOzellikler = [
    {
      icon: Gauge,
      baslik: "Kilometre",
      deger: `${kilometre.toLocaleString("tr-TR")} km`,
    },
    {
      icon: CarFront,
      baslik: "Vites",
      deger: arac.vites || "Manuel",
    },
    {
      icon: Fuel,
      baslik: "Yakıt",
      deger: arac.yakit || "Benzin",
    },
    {
      icon: Users,
      baslik: "Kapasite",
      deger: `${Number(arac.kisiSayisi) || 5} Kişi`,
    },
    {
      icon: CalendarDays,
      baslik: "Model",
      deger: arac.yil,
    },
    {
      icon: CarFront,
      baslik: "Kapı",
      deger: `${Number(arac.kapiSayisi) || 5} Kapı`,
    },
    {
      icon: BriefcaseBusiness,
      baslik: "Bagaj",
      deger: arac.bagaj || "Orta",
    },
    {
      icon: Snowflake,
      baslik: "Klima",
      deger: arac.klima === false ? "Yok" : "Var",
    },
  ];

  const gonder = (e) => {
    e.preventDefault();
    if (!kullanici) return git("/giris");
    if (!yorum.trim()) return;

    yorumEkle?.({
      id: crypto.randomUUID(),
      aracId: arac.id,
      kullaniciId: kullanici.id,
      ad: kullanici.ad,
      puan,
      yorum: yorum.trim(),
      tarih: new Date().toISOString(),
    });

    setYorum("");
    setPuan(5);
  };

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-asfalt">
      <Navbar git={git} kullanici={kullanici} cikisYap={cikisYap} />

      <main className="w-full min-w-0 pt-20">
        <section className="mx-auto w-full max-w-7xl min-w-0 px-3 py-6 sm:px-4 sm:py-10 lg:px-8">
          <button onClick={() => git("/araclar")} className="flex items-center gap-2 text-sm text-metinSoft transition hover:text-amber">
            <ArrowLeft size={17} /> Araçlara dön
          </button>

          <div className="mt-5 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)] lg:gap-8">
            <div className="min-w-0 w-full">
              <div className="min-w-0 w-full">
                <div className="group relative w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-panel sm:rounded-3xl">
                  <img
                    onClick={() => setTamEkranAcik(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setTamEkranAcik(true); } }}
                    src={galeriResimleri[aktifResim]}
                    alt={`${arac.marka} ${arac.model} ${aktifResim + 1}. fotoğraf`}
                    className="block h-[240px] w-full cursor-zoom-in object-contain bg-black/40 transition duration-500 min-[380px]:h-[280px] sm:h-[440px] lg:h-[520px] lg:object-cover"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

                  {galeriResimleri.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={oncekiResim}
                        aria-label="Önceki fotoğraf"
                        className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur transition hover:border-amber/40 hover:text-amber"
                      >
                        <ChevronLeft size={22} />
                      </button>

                      <button
                        type="button"
                        onClick={sonrakiResim}
                        aria-label="Sonraki fotoğraf"
                        className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur transition hover:border-amber/40 hover:text-amber"
                      >
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}

                  <div className="absolute right-5 top-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTamEkranAcik(true)}
                      aria-label="Fotoğrafı büyüt"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition hover:border-amber/40 hover:text-amber"
                    >
                      <Expand size={19} />
                    </button>

                    <button
                      type="button"
                      onClick={() => favoriDegistir?.(arac.id)}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition hover:border-amber/40 hover:text-amber"
                    >
                      <Heart
                        className={
                          favoriMi
                            ? "fill-amber text-amber"
                            : ""
                        }
                      />
                    </button>
                  </div>

                  <span className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    {aktifResim + 1} / {galeriResimleri.length}
                  </span>
                </div>

                {galeriResimleri.length > 1 && (
                  <div className="custom-scrollbar mt-3 flex w-full min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-2 sm:gap-3">
                    {galeriResimleri.map((resim, index) => (
                      <button
                        key={`${resim}-${index}`}
                        type="button"
                        onClick={() => { setAktifResim(index); setTamEkranAcik(true); }}
                        className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-28 ${
                          aktifResim === index
                            ? "border-amber shadow-[0_0_22px_rgba(255,182,39,0.18)]"
                            : "border-white/10 opacity-65 hover:border-white/30 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={resim}
                          alt={`${index + 1}. küçük araç fotoğrafı`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                {teknikOzellikler.map(({ icon: Icon, baslik, deger }) => (
                  <div key={baslik} className="min-w-0 rounded-xl border border-white/10 bg-panel p-3 sm:rounded-2xl sm:p-4">
                    <Icon className="text-amber" />
                    <p className="mt-3 text-xs text-metinSoft">{baslik}</p>
                    <p className="mt-1 break-words text-sm font-bold text-white sm:text-base">{deger}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="min-w-0 h-fit rounded-2xl border border-white/10 bg-panel p-4 sm:p-7 lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-amber">{arac.sinif}</p>
              <h1 className="mt-3 break-words font-display text-3xl font-extrabold text-white sm:text-4xl">{arac.marka} {arac.model}</h1>
              <p className="mt-2 text-sm text-metinSoft">{arac.plaka} • {arac.yil} model • {kilometre.toLocaleString("tr-TR")} km</p>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <Star className="fill-amber text-amber" size={18} />
                <span className="font-bold text-white">{ortalama}</span>
                <span className="text-metinSoft">({yorumlar.length} yorum)</span>
              </div>

              <div className="my-7 h-px bg-white/10" />
              <p className="text-xs uppercase tracking-widest text-metinSoft">Günlük fiyat</p>
              <p className="mt-1 break-words font-display text-3xl font-extrabold text-amber sm:text-4xl">
                ₺{Number(arac.gunlukFiyat || 0).toLocaleString("tr-TR")} <span className="text-sm font-normal text-metinSoft">/ gün</span>
              </p>

              <div className="mt-7 space-y-3 text-sm text-metinSoft">
                <p className="flex gap-2"><CheckCircle2 className="text-teal" size={18} /> Tarih uygunluk kontrolü</p>
                <p className="flex gap-2"><ShieldCheck className="text-teal" size={18} /> Sigortalı ve bakımlı araç</p>
              </div>

              <button disabled={arac.durum !== "musait"} onClick={() => git(`/rezervasyon/${arac.id}`)} className="mt-8 w-full min-w-0 whitespace-normal rounded-xl bg-amber px-3 py-4 text-center text-sm font-extrabold leading-5 text-asfalt transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:text-base">
                {arac.durum === "musait" ? "Hemen Rezervasyon Yap" : "Şu Anda Müsait Değil"}
              </button>
            </aside>
          </div>

          <section className="mt-8 min-w-0 rounded-2xl border border-white/10 bg-panel p-4 sm:mt-12 sm:rounded-3xl sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber">Araç donanımları</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-white">Bu araçta bulunan özellikler</h2>
                <p className="mt-2 text-sm text-metinSoft">Yalnızca yönetici tarafından seçilen donanımlar gösterilir.</p>
              </div>
              <span className="w-fit rounded-full border border-amber/20 bg-amber/10 px-4 py-2 text-xs font-bold text-amber">{donanimlar.length} özellik</span>
            </div>

            {donanimlar.length ? (
              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {donanimlar.map((donanim) => (
                  <div key={donanim} className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/15 text-teal">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <span className="text-sm font-medium leading-6 text-metin">{donanim}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-7 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
                <ShieldCheck size={34} className="mx-auto text-metinSoft/40" />
                <h3 className="mt-4 font-bold text-white">Donanım bilgisi eklenmemiş</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-metinSoft">Bu aracı yönetim panelinden düzenleyerek araçta bulunan donanımları seçebilirsiniz.</p>
              </div>
            )}
          </section>

          <section className="mt-8 grid min-w-0 grid-cols-1 gap-5 lg:mt-12 lg:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)] lg:gap-7">
            <form onSubmit={gonder} className="h-fit min-w-0 rounded-2xl border border-white/10 bg-panel p-4 sm:p-6">
              <h2 className="text-xl font-bold text-white">Aracı Puanla</h2>
              <p className="mt-1 text-sm text-metinSoft">Deneyimini diğer müşterilerle paylaş.</p>
              <div className="mt-5 flex gap-2">
                {[1, 2, 3, 4, 5].map((sayi) => (
                  <button type="button" key={sayi} onClick={() => setPuan(sayi)}>
                    <Star size={26} className={sayi <= puan ? "fill-amber text-amber" : "text-white/20"} />
                  </button>
                ))}
              </div>
              <textarea value={yorum} onChange={(e) => setYorum(e.target.value)} className="contact-input mt-5 min-h-28 py-3" placeholder="Yorumunuzu yazın..." />
              <button className="mt-4 w-full rounded-xl bg-amber py-3 font-bold text-asfalt">{kullanici ? "Yorumu Gönder" : "Giriş Yap ve Yorumla"}</button>
            </form>

            <div className="min-w-0 rounded-2xl border border-white/10 bg-panel p-4 sm:p-6">
              <h2 className="text-xl font-bold text-white">Müşteri Yorumları</h2>
              {yorumlar.length ? (
                <div className="mt-5 space-y-4">
                  {yorumlar.map((item) => (
                    <article key={item.id} className="rounded-2xl bg-white/[.035] p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{item.ad}</p>
                          <p className="mt-1 text-xs text-metinSoft">{new Date(item.tarih).toLocaleDateString("tr-TR")}</p>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((sayi) => (
                            <Star key={sayi} size={15} className={sayi <= item.puan ? "fill-amber text-amber" : "text-white/15"} />
                          ))}
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-metinSoft">{item.yorum}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-metinSoft">Bu araç için henüz yorum yapılmadı.</p>
              )}
            </div>
          </section>
        </section>
      </main>

      {tamEkranAcik && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/95 px-2 py-14 backdrop-blur-lg sm:p-4"
          onClick={() => setTamEkranAcik(false)}
        >
          <button
            type="button"
            onClick={() => setTamEkranAcik(false)}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl text-white"
          >
            ×
          </button>

          {galeriResimleri.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  oncekiResim();
                }}
                className="absolute left-2 top-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white sm:left-8"
              >
                <ChevronLeft size={25} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sonrakiResim();
                }}
                className="absolute right-2 top-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white sm:right-8"
              >
                <ChevronRight size={25} />
              </button>
            </>
          )}

          <img
            src={galeriResimleri[aktifResim]}
            alt={`${arac.marka} ${arac.model} tam ekran fotoğraf`}
            className="max-h-[calc(100dvh-120px)] max-w-[100%] rounded-lg object-contain sm:max-h-[88vh] sm:max-w-[92vw] sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <span className="absolute bottom-6 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white">
            {aktifResim + 1} / {galeriResimleri.length}
          </span>
        </div>
      )}

      <Footer git={git} />
    </div>
  );
}
