import { CalendarDays, CarFront, Heart, LogOut, Mail, MapPin, Phone, UserRound } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const durumMetni = {
  bekliyor: "Onay Bekliyor",
  onaylandi: "Onaylandı",
  tamamlandi: "Tamamlandı",
  iptal: "İptal Edildi",
};

const durumSinifi = {
  bekliyor: "border-amber/25 bg-amber/10 text-amber",
  onaylandi: "border-teal/25 bg-teal/10 text-teal",
  tamamlandi: "border-white/15 bg-white/5 text-metinSoft",
  iptal: "border-tehlike/25 bg-tehlike/10 text-tehlike",
};

function sozlesmeYazdir(rezervasyon, kullanici) {
  const pencere = window.open("", "_blank", "width=900,height=700");
  if (!pencere) return;
  pencere.document.write(`<!doctype html><html><head><title>RentCar Sözleşme</title><style>body{font-family:Arial;padding:42px;color:#111}h1{border-bottom:3px solid #ffb627;padding-bottom:14px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.box{border:1px solid #ddd;border-radius:10px;padding:14px}.sign{margin-top:70px;display:flex;justify-content:space-between}.muted{color:#666} @media print{button{display:none}}</style></head><body><h1>RentCar Araç Kiralama Sözleşmesi</h1><p class="muted">Sözleşme No: ${String(rezervasyon.id).slice(0,8).toUpperCase()}</p><div class="grid"><div class="box"><b>Müşteri</b><p>${kullanici?.ad || rezervasyon.musteri?.adSoyad || '-'}</p><p>${kullanici?.email || rezervasyon.musteri?.email || '-'}</p></div><div class="box"><b>Araç</b><p>${rezervasyon.arac}</p><p>${rezervasyon.baslangic} - ${rezervasyon.bitis}</p></div><div class="box"><b>Teslim Lokasyonu</b><p>${rezervasyon.musteri?.lokasyon || '-'}</p></div><div class="box"><b>Toplam Tutar</b><p>₺${Number(rezervasyon.tutar || 0).toLocaleString('tr-TR')}</p></div></div><p style="margin-top:30px">Bu belge eğitim amaçlı demo araç kiralama projesi tarafından oluşturulmuştur.</p><div class="sign"><span>Müşteri İmzası</span><span>RentCar Yetkilisi</span></div><button onclick="window.print()" style="margin-top:50px;padding:12px 22px;background:#ffb627;border:0;border-radius:8px;font-weight:bold">PDF Olarak Kaydet / Yazdır</button></body></html>`);
  pencere.document.close();
}

export default function Hesabim({
  git,
  kullanici,
  cikisYap,
  rezervasyonlar = [],
  araclar = [],
  favoriler = [],
}) {
  if (!kullanici || kullanici.rol !== "kullanici") {
    return (
      <div className="min-h-screen bg-asfalt">
        <Navbar git={git} kullanici={kullanici} cikisYap={cikisYap} />
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 pt-20">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-panel p-10 text-center">
            <UserRound size={52} className="mx-auto text-amber" />
            <h1 className="mt-5 text-3xl font-extrabold text-white">Hesabınıza giriş yapın</h1>
            <p className="mt-3 text-metinSoft">Profilinizi ve rezervasyonlarınızı görmek için müşteri hesabınızla giriş yapmalısınız.</p>
            <button onClick={() => git("/giris")} className="mt-7 rounded-xl bg-amber px-7 py-3 font-bold text-asfalt">Giriş Yap</button>
          </div>
        </main>
        <Footer git={git} />
      </div>
    );
  }

  const email = String(kullanici.email || "").trim().toLowerCase();
  const benimRezervasyonlarim = rezervasyonlar.filter((rezervasyon) => {
    const rezervasyonEmail = String(rezervasyon?.musteri?.email || "").trim().toLowerCase();
    return rezervasyon.kullaniciId === kullanici.id || rezervasyonEmail === email;
  });

  const toplamHarcama = benimRezervasyonlarim
    .filter((r) => r.durum !== "iptal")
    .reduce((toplam, r) => toplam + Number(r.tutar || 0), 0);

  return (
    <div className="min-h-screen bg-asfalt">
      <Navbar git={git} kullanici={kullanici} cikisYap={cikisYap} />
      <main className="pt-20">
        <section className="border-b border-white/10 bg-gradient-to-b from-panel to-asfalt">
          <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-amber">Müşteri Paneli</p>
            <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-display text-4xl font-extrabold text-white sm:text-5xl">Hoş geldiniz, {kullanici.ad}</h1>
                <p className="mt-3 text-metinSoft">Hesap bilgilerinizi, favorilerinizi ve rezervasyonlarınızı buradan takip edebilirsiniz.</p>
              </div>
              <button onClick={cikisYap} className="inline-flex items-center justify-center gap-2 rounded-xl border border-tehlike/30 px-5 py-3 text-sm font-bold text-tehlike transition hover:bg-tehlike/10">
                <LogOut size={17} /> Çıkış Yap
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-3">
            <OzetKart icon={CalendarDays} etiket="Rezervasyonlarım" deger={benimRezervasyonlarim.length} />
            <OzetKart icon={Heart} etiket="Favori Araçlarım" deger={favoriler.length} />
            <OzetKart icon={CarFront} etiket="Toplam Tutar" deger={`₺${toplamHarcama.toLocaleString("tr-TR")}`} />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
            <aside className="h-fit rounded-3xl border border-white/10 bg-panel p-7">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber text-2xl font-extrabold text-asfalt">
                {String(kullanici.ad || "M").trim().charAt(0).toUpperCase()}
              </div>
              <h2 className="mt-5 text-2xl font-bold text-white">{kullanici.ad}</h2>
              <p className="mt-1 text-sm text-teal">Aktif müşteri hesabı</p>
              <div className="mt-6 space-y-3">
                <BilgiSatiri icon={Mail} metin={kullanici.email} />
                {kullanici.telefon && <BilgiSatiri icon={Phone} metin={kullanici.telefon} />}
              </div>
              <button onClick={() => git("/favoriler")} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-bold text-white transition hover:border-amber/40 hover:text-amber">
                <Heart size={17} /> Favorilerimi Gör
              </button>
              <button onClick={() => git("/araclar")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber py-3 text-sm font-extrabold text-asfalt">
                <CarFront size={17} /> Yeni Araç Kirala
              </button>
            </aside>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-amber">Geçmiş ve aktif işlemler</p>
                  <h2 className="mt-2 text-3xl font-extrabold text-white">Rezervasyonlarım</h2>
                </div>
              </div>

              {benimRezervasyonlarim.length ? (
                <div className="mt-6 space-y-4">
                  {benimRezervasyonlarim.map((rezervasyon) => {
                    const arac = araclar.find((a) => a.id === rezervasyon.aracId);
                    return (
                      <article key={rezervasyon.id} className="overflow-hidden rounded-3xl border border-white/10 bg-panel transition hover:border-amber/25">
                        <div className="grid sm:grid-cols-[190px_1fr]">
                          <div className="min-h-40 bg-white/[.03]">
                            {arac?.resimUrl ? <img src={arac.resimUrl} alt={rezervasyon.arac} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><CarFront size={42} className="text-metinSoft" /></div>}
                          </div>
                          <div className="p-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <h3 className="text-xl font-bold text-white">{rezervasyon.arac}</h3>
                                <p className="mt-1 text-xs text-metinSoft">Rezervasyon No: {String(rezervasyon.id).slice(0, 8).toUpperCase()}</p>
                              </div>
                              <span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${durumSinifi[rezervasyon.durum] || durumSinifi.bekliyor}`}>{durumMetni[rezervasyon.durum] || rezervasyon.durum}</span>
                            </div>
                            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                              <MiniBilgi icon={CalendarDays} baslik="Kiralama Tarihi" metin={`${rezervasyon.baslangic} – ${rezervasyon.bitis}`} />
                              <MiniBilgi icon={MapPin} baslik="Teslim Noktası" metin={rezervasyon?.musteri?.lokasyon || "Belirtilmedi"} />
                              <MiniBilgi icon={CarFront} baslik="Toplam Tutar" metin={`₺${Number(rezervasyon.tutar || 0).toLocaleString("tr-TR")}`} vurgu />
                            </div>
                            <button onClick={() => sozlesmeYazdir(rezervasyon, kullanici)} className="mt-4 rounded-xl border border-amber/30 bg-amber/10 px-4 py-2 text-xs font-bold text-amber transition hover:bg-amber hover:text-asfalt">Sözleşmeyi PDF Olarak Kaydet</button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-panel p-12 text-center">
                  <CalendarDays size={50} className="mx-auto text-metinSoft" />
                  <h3 className="mt-5 text-2xl font-bold text-white">Henüz rezervasyonunuz yok</h3>
                  <p className="mt-2 text-metinSoft">İlk aracınızı seçerek rezervasyon oluşturmaya başlayabilirsiniz.</p>
                  <button onClick={() => git("/araclar")} className="mt-6 rounded-xl bg-amber px-6 py-3 font-bold text-asfalt">Araçları İncele</button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer git={git} />
    </div>
  );
}

function OzetKart({ icon: Icon, etiket, deger }) {
  return <div className="rounded-2xl border border-white/10 bg-panel p-5"><Icon size={21} className="text-amber"/><p className="mt-4 text-2xl font-extrabold text-white">{deger}</p><p className="mt-1 text-xs text-metinSoft">{etiket}</p></div>;
}
function BilgiSatiri({ icon: Icon, metin }) { return <div className="flex items-center gap-3 rounded-xl bg-white/[.035] px-4 py-3 text-sm text-metinSoft"><Icon size={16} className="text-amber"/><span className="truncate">{metin}</span></div>; }
function MiniBilgi({ icon: Icon, baslik, metin, vurgu }) { return <div className="rounded-xl bg-white/[.035] p-3"><div className="flex items-center gap-2 text-[11px] text-metinSoft"><Icon size={14} className="text-amber"/>{baslik}</div><p className={`mt-2 font-bold ${vurgu ? "text-amber" : "text-white"}`}>{metin}</p></div>; }
