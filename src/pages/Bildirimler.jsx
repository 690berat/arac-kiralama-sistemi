import { Bell, CalendarDays, CheckCircle2, Gift, Info } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Bildirimler({ git, kullanici, cikisYap, rezervasyonlar = [] }) {
  if (!kullanici || kullanici.rol !== "kullanici") {
    git("/giris");
    return null;
  }

  const email = String(kullanici.email || "").toLowerCase();
  const benimRezervasyonlarim = rezervasyonlar.filter((r) =>
    r.kullaniciId === kullanici.id || String(r?.musteri?.email || "").toLowerCase() === email
  );

  const dinamik = benimRezervasyonlarim.slice(0, 4).map((r) => ({
    id: r.id,
    icon: r.durum === "onaylandi" ? CheckCircle2 : CalendarDays,
    baslik: r.durum === "onaylandi" ? "Rezervasyonunuz onaylandı" : "Rezervasyonunuz alındı",
    metin: `${r.arac} için ${r.baslangic} – ${r.bitis} tarihli rezervasyonunuzu hesabınızdan takip edebilirsiniz.`,
    zaman: "Rezervasyon bildirimi",
  }));

  const bildirimler = [
    ...dinamik,
    { id: "welcome", icon: Bell, baslik: `Hoş geldiniz, ${kullanici.ad}`, metin: "RentCar hesabınız aktif. Favorilerinizi ve rezervasyonlarınızı artık tek yerden yönetebilirsiniz.", zaman: "Hesap bildirimi" },
    { id: "campaign", icon: Gift, baslik: "Size özel kampanyalar", metin: "Kampanyalı araçlarımızı inceleyerek avantajlı fiyatlardan yararlanabilirsiniz.", zaman: "Kampanya" },
  ];

  return (
    <div className="min-h-screen bg-asfalt">
      <Navbar git={git} kullanici={kullanici} cikisYap={cikisYap} />
      <main className="pt-20">
        <section className="border-b border-white/10 bg-gradient-to-b from-panel to-asfalt">
          <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-amber">Müşteri Hesabı</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-white sm:text-5xl">Bildirimler</h1>
            <p className="mt-3 text-metinSoft">Rezervasyon, ödeme ve kampanya gelişmelerini buradan takip edin.</p>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
          <div className="space-y-4">
            {bildirimler.map(({ id, icon: Icon, baslik, metin, zaman }) => (
              <article key={id} className="flex gap-4 rounded-2xl border border-white/10 bg-panel p-5 transition hover:border-amber/25">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber"><Icon size={21}/></span>
                <div className="min-w-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-bold text-white">{baslik}</h2>
                    <span className="text-[11px] text-metinSoft">{zaman}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-metinSoft">{metin}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.025] p-4 text-sm text-metinSoft"><Info size={18} className="text-amber"/> Bildirimler bu demo projede rezervasyon verilerinden otomatik oluşturulur.</div>
        </section>
      </main>
      <Footer git={git} />
    </div>
  );
}
