import { useMemo, useState } from "react";
import { Banknote, CalendarDays, CheckCircle2, CreditCard, MapPin, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const cakisir = (a1, a2, b1, b2) => new Date(a1) < new Date(b2) && new Date(a2) > new Date(b1);

export default function Rezervasyon({ arac, git, rezervasyonEkle, kullanici, cikisYap, rezervasyonlar = [] }) {
  const [tamam, setTamam] = useState(false);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [hata, setHata] = useState("");
  const [odemeYontemi, setOdemeYontemi] = useState("kart");
  const [form, setForm] = useState({
    adSoyad: kullanici?.ad || "",
    telefon: "",
    email: "",
    lokasyon: "",
    baslangic: "",
    bitis: "",
  });

  const gun = useMemo(() => {
    if (!form.baslangic || !form.bitis) return 1;
    return Math.max(1, Math.ceil((new Date(form.bitis) - new Date(form.baslangic)) / 86400000));
  }, [form.baslangic, form.bitis]);

  const musaitMi = useMemo(() => {
    if (!form.baslangic || !form.bitis) return true;
    return !rezervasyonlar.some((r) =>
      r.aracId === arac?.id && r.durum !== "iptal" && r.baslangic && r.bitis && cakisir(form.baslangic, form.bitis, r.baslangic, r.bitis)
    );
  }, [form.baslangic, form.bitis, rezervasyonlar, arac?.id]);

  if (!arac) return null;

  const degistir = (alan, deger) => setForm((onceki) => ({ ...onceki, [alan]: deger }));

  const submit = async (e) => {
    e.preventDefault();
    setHata("");
    if (!kullanici) return setHata("Rezervasyon yapabilmek için önce kullanıcı hesabınızla giriş yapın.");
    if (!musaitMi) return setHata("Seçtiğiniz tarihlerde bu araç dolu. Lütfen farklı tarih seçin.");
    if (new Date(form.bitis) <= new Date(form.baslangic)) return setHata("Bitiş tarihi alış tarihinden sonra olmalıdır.");
    if (gonderiliyor) return;
    setGonderiliyor(true);
    const sonuc = await rezervasyonEkle({
      id: crypto.randomUUID(),
      aracId: arac.id,
      kullaniciId: kullanici?.id || null,
      arac: `${arac.marka} ${arac.model}`,
      tarih: new Date().toISOString(),
      baslangic: form.baslangic,
      bitis: form.bitis,
      gun,
      tutar: gun * arac.gunlukFiyat,
      durum: "bekliyor",
      odemeYontemi,
      odemeDurumu: odemeYontemi === "kart" ? "demo-onaylandi" : "teslimatta-odenecek",
      musteri: { adSoyad: form.adSoyad.trim(), telefon: form.telefon.trim(), email: form.email.trim(), lokasyon: form.lokasyon.trim() },
    });
    setGonderiliyor(false);
    if (!sonuc?.basarili) return setHata(sonuc?.mesaj || "Rezervasyon kaydedilemedi. Tekrar deneyin.");
    setTamam(true);
  };

  return (
    <div className="min-h-screen bg-asfalt">
      <Navbar git={git} kullanici={kullanici} cikisYap={cikisYap} />
      <main className="pt-20">
        <section className="mx-auto max-w-6xl px-4 py-16">
          {tamam ? (
            <div className="rounded-3xl border border-teal/30 bg-panel p-10 text-center">
              <CheckCircle2 size={60} className="mx-auto text-teal" />
              <h1 className="mt-5 text-3xl font-extrabold text-white">Rezervasyon talebiniz alındı</h1>
              <p className="mt-3 text-metinSoft">{odemeYontemi === "kart" ? "Kart tercihiniz kaydedildi; gerçek kart tahsilatı yapılmadı." : "Nakit ödeme seçiminiz kaydedildi; ücret araç tesliminde alınacaktır."} Rezervasyonunuzu hesabınızdan takip edebilirsiniz.</p>
              <button onClick={() => git(kullanici ? "/hesabim" : "/")} className="mt-7 rounded-xl bg-amber px-6 py-3 font-bold text-asfalt">{kullanici ? "Hesabımdan Takip Et" : "Ana Sayfaya Dön"}</button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
              <aside className="h-fit overflow-hidden rounded-3xl border border-white/10 bg-panel lg:sticky lg:top-28">
                <img src={arac.resimUrl} alt={`${arac.marka} ${arac.model}`} className="h-56 w-full object-cover" />
                <div className="p-6">
                  <p className="text-xs text-amber">{arac.sinif}</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">{arac.marka} {arac.model}</h2>
                  <p className="mt-4 text-3xl font-extrabold text-amber">₺{Number(arac.gunlukFiyat).toLocaleString("tr-TR")}<span className="text-sm font-normal text-metinSoft">/gün</span></p>
                  <div className="mt-5 rounded-2xl bg-white/[.04] p-4 text-sm text-metinSoft"><ShieldCheck className="mb-2 text-teal" size={20}/> Seçtiğiniz tarihler mevcut rezervasyonlarla otomatik karşılaştırılır.</div>
                </div>
              </aside>

              <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-panel p-7">
                <h1 className="font-display text-3xl font-extrabold text-white">Rezervasyon Bilgileri</h1>
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <Alan label="Ad Soyad"><input required value={form.adSoyad} onChange={(e) => degistir("adSoyad", e.target.value)} className="contact-input" /></Alan>
                  <Alan label="Telefon"><input required value={form.telefon} onChange={(e) => degistir("telefon", e.target.value)} className="contact-input" /></Alan>
                  <Alan label="E-posta (isteğe bağlı)"><input type="email" value={form.email} onChange={(e) => degistir("email", e.target.value)} className="contact-input" /></Alan>
                  <Alan label="Teslim Lokasyonu"><div className="relative"><MapPin className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-amber" size={18}/><input required value={form.lokasyon} onChange={(e) => degistir("lokasyon", e.target.value)} className="contact-input contact-input-icon" placeholder="Örn. Şanlıurfa Havalimanı" /></div></Alan>
                  <Alan label="Alış Tarihi"><input required type="date" min={new Date().toISOString().slice(0,10)} value={form.baslangic} onChange={(e) => degistir("baslangic", e.target.value)} className="contact-input" /></Alan>
                  <Alan label="Bitiş Tarihi"><input required type="date" min={form.baslangic || new Date().toISOString().slice(0,10)} value={form.bitis} onChange={(e) => degistir("bitis", e.target.value)} className="contact-input" /></Alan>
                </div>

                <div className={`mt-4 rounded-xl border p-3 text-sm ${musaitMi ? "border-teal/25 bg-teal/10 text-teal" : "border-tehlike/30 bg-tehlike/10 text-tehlike"}`}>
                  {musaitMi ? "Seçilen tarihler şu anda uygun." : "Bu tarihler başka bir rezervasyonla çakışıyor."}
                </div>

                <div className="mt-7 border-t border-white/10 pt-7">
                  <div>
                    <h2 className="font-bold text-white">Ödeme Yöntemi</h2>
                    <p className="mt-1 text-xs text-metinSoft">Demo kart tercihi veya araç tesliminde nakit ödeme seçebilirsiniz. Gerçek online tahsilat yapılmaz.</p>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => { setOdemeYontemi("kart"); setHata(""); }}
                      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${odemeYontemi === "kart" ? "border-amber bg-amber/10 shadow-[0_0_0_3px_rgba(255,182,39,.08)]" : "border-white/10 bg-white/[.03] hover:border-white/20"}`}
                    >
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${odemeYontemi === "kart" ? "bg-amber text-asfalt" : "bg-white/[.06] text-metinSoft"}`}><CreditCard size={21}/></span>
                      <span><strong className="block text-sm text-white">Kartla Ödeme</strong><small className="text-xs text-metinSoft">Demo: kart bilgisi girilmez</small></span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setOdemeYontemi("nakit"); setHata(""); }}
                      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${odemeYontemi === "nakit" ? "border-amber bg-amber/10 shadow-[0_0_0_3px_rgba(255,182,39,.08)]" : "border-white/10 bg-white/[.03] hover:border-white/20"}`}
                    >
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${odemeYontemi === "nakit" ? "bg-amber text-asfalt" : "bg-white/[.06] text-metinSoft"}`}><Banknote size={21}/></span>
                      <span><strong className="block text-sm text-white">Nakit Ödeme</strong><small className="text-xs text-metinSoft">Ücreti araç tesliminde öde</small></span>
                    </button>
                  </div>

                  {odemeYontemi === "kart" ? (
                    <div className="mt-5 rounded-2xl border border-amber/25 bg-amber/10 p-4 text-sm text-amber">
                      Bu bir demo ödeme tercihidir. Kart numarası, CVV veya son kullanma tarihi istenmez; ödeme alınmaz.
                    </div>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-teal/25 bg-teal/10 p-4 text-sm text-teal">
                      Kart bilgisi girmeniz gerekmez. Toplam ücret aracı teslim alırken nakit olarak tahsil edilecektir.
                    </div>
                  )}
                </div>

                {hata && <p className="mt-5 rounded-xl border border-tehlike/30 bg-tehlike/10 p-3 text-sm text-tehlike">{hata}</p>}
                <div className="mt-6 rounded-2xl bg-white/[.04] p-5">
                  <div className="flex justify-between text-sm text-metinSoft"><span>{gun} gün x ₺{Number(arac.gunlukFiyat).toLocaleString("tr-TR")}</span><CalendarDays size={18}/></div>
                  <div className="mt-3 flex justify-between text-xl font-bold text-white"><span>Toplam</span><span className="text-amber">₺{Number(gun * arac.gunlukFiyat).toLocaleString("tr-TR")}</span></div>
                </div>
                <button disabled={gonderiliyor} className="mt-6 w-full rounded-xl bg-amber py-4 font-extrabold text-asfalt transition hover:brightness-110 disabled:opacity-50">{gonderiliyor ? "Rezervasyon kaydediliyor..." : odemeYontemi === "kart" ? "Demo Kart Tercihiyle Talep Oluştur" : "Nakit Ödemeyle Rezervasyonu Tamamla"}</button>
              </form>
            </div>
          )}
        </section>
      </main>
      <Footer git={git} />
    </div>
  );
}

function Alan({ label, children }) {
  return <label><span className="mb-2 block text-xs font-bold text-metinSoft">{label}</span>{children}</label>;
}
