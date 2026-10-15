import { useState } from "react";
import {
  ArrowRight,
  CarFront,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Giris({ git, girisYap, bulutAktif }) {
  const [hata, setHata] = useState("");
  const [sifreGoster, setSifreGoster] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setHata("");

    const fd = new FormData(e.currentTarget);
    const sonuc = await girisYap(fd.get("kimlik"), fd.get("sifre"));

    if (!sonuc.basarili) {
      setHata(sonuc.mesaj || "Kullanıcı adı veya şifre hatalı.");
      return;
    }

    git(sonuc.rol === "admin" ? "/admin" : "/");
  };

  return (
    <HesapSayfasi
      git={git}
      rozet="RentCar • Hesap Girişi"
      baslik="Tekrar hoş geldiniz."
      aciklama="Rezervasyonlarınızı, favorilerinizi ve hesap bilgilerinizi tek ekrandan yönetin."
    >
      <form onSubmit={submit} className="space-y-5">
        <FormAlan
          label="Kullanıcı adı (admin için e-posta)"
          icon={UserRound}
          input={
            <input
              name="kimlik"
              type="text"
              autoComplete="username"
              required
              placeholder="berat123"
              className="auth-input"
            />
          }
        />

        <FormAlan
          label="Şifre"
          icon={LockKeyhole}
          input={
            <input
              name="sifre"
              type={sifreGoster ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Şifrenizi girin"
              className="auth-input auth-input-password"
            />
          }
          right={
            <button
              type="button"
              onClick={() => setSifreGoster((deger) => !deger)}
              className="auth-password-button"
              aria-label={sifreGoster ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {sifreGoster ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          }
        />

        {hata && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {hata}
          </div>
        )}

        <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-amber py-4 font-extrabold text-asfalt shadow-[0_14px_35px_rgba(255,182,39,.2)] transition hover:-translate-y-0.5 hover:brightness-110">
          Hesabıma Giriş Yap
          <ArrowRight size={18} className="transition group-hover:translate-x-1" />
        </button>

        <div className="rounded-2xl border border-amber/20 bg-amber/5 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-amber">
            <ShieldCheck size={17} /> Güvenli giriş
          </div>
          <p className="mt-2 text-xs leading-5 text-metinSoft">
            {bulutAktif ? "Girişiniz Supabase Auth ile doğrulanır." : "Demo modu: hesaplar yalnızca bu tarayıcıda saklanır. Canlı yayın için Supabase ayarlayın."}
          </p>
        </div>

        <p className="text-center text-sm text-metinSoft">
          Henüz hesabınız yok mu?{" "}
          <button
            type="button"
            onClick={() => git("/kayit")}
            className="font-bold text-amber transition hover:text-white"
          >
            Ücretsiz hesap oluşturun
          </button>
        </p>
      </form>
    </HesapSayfasi>
  );
}

export function Kayit({ git, kayitOl }) {
  const [hata, setHata] = useState("");
  const [sifreGoster, setSifreGoster] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setHata("");

    const fd = new FormData(e.currentTarget);
    if (fd.get("sifre") !== fd.get("sifreTekrar")) { setHata("Şifreler eşleşmiyor."); return; }
    const sonuc = await kayitOl({
      ad: fd.get("ad"),
      kullaniciAdi: fd.get("kullaniciAdi"),
      sifre: fd.get("sifre"),
    });

    if (!sonuc.basarili) {
      setHata(sonuc.mesaj || "Kayıt oluşturulamadı.");
      return;
    }

    git("/");
  };

  return (
    <HesapSayfasi
      git={git}
      rozet="Yeni RentCar Üyeliği"
      baslik="Dakikalar içinde hesabınızı oluşturun"
      aciklama="Favori araçlarınızı kaydedin, rezervasyonlarınızı takip edin ve size özel fırsatları kaçırmayın."
    >
      <form onSubmit={submit} className="space-y-5">
        <FormAlan
          label="Ad soyad"
          icon={UserRound}
          input={
            <input
              name="ad"
              required
              autoComplete="name"
              placeholder="Adınız ve soyadınız"
              className="auth-input"
            />
          }
        />

        <FormAlan
          label="Kullanıcı adı"
          icon={UserRound}
          input={<input name="kullaniciAdi" type="text" required minLength={3} maxLength={24}
            pattern="[a-zA-Z0-9_]{3,24}" autoComplete="username" placeholder="Örn: berat123" className="auth-input" />}
        />
        <FormAlan
          label="Şifre"
          icon={LockKeyhole}
          input={
            <input
              name="sifre"
              type={sifreGoster ? "text" : "password"}
              required
              minLength="8"
              autoComplete="new-password"
              placeholder="En az 8 karakter"
              className="auth-input auth-input-password"
            />
          }
          right={
            <button
              type="button"
              onClick={() => setSifreGoster((deger) => !deger)}
              className="auth-password-button"
              aria-label={sifreGoster ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {sifreGoster ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          }
        />

        <FormAlan label="Şifre tekrar" icon={LockKeyhole}
          input={<input name="sifreTekrar" type={sifreGoster ? "text" : "password"} required minLength={8} autoComplete="new-password" placeholder="Şifrenizi tekrar girin" className="auth-input" />}
        />
        <p className="text-xs text-metinSoft">Gerçek e-posta gerekmez. Şifrenizi unutursanız otomatik e-posta ile sıfırlayamazsınız.</p>
        {hata && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {hata}
          </div>
        )}

        <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-amber py-4 font-extrabold text-asfalt shadow-[0_14px_35px_rgba(255,182,39,.2)] transition hover:-translate-y-0.5 hover:brightness-110">
          Hesabımı Oluştur
          <ArrowRight size={18} className="transition group-hover:translate-x-1" />
        </button>

        <p className="text-center text-sm text-metinSoft">
          Zaten hesabınız var mı?{" "}
          <button
            type="button"
            onClick={() => git("/giris")}
            className="font-bold text-amber transition hover:text-white"
          >
            Giriş yapın
          </button>
        </p>
      </form>
    </HesapSayfasi>
  );
}

function HesapSayfasi({ git, rozet, baslik, aciklama, children }) {
  return (
    <div className="min-h-screen bg-asfalt">
      <Navbar git={git} />

      <main className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-40 top-28 h-96 w-96 rounded-full bg-amber/10 blur-[130px]" />
        <div className="pointer-events-none absolute -right-48 bottom-20 h-96 w-96 rounded-full bg-teal/10 blur-[140px]" />

        <div className="relative mx-auto grid min-h-[720px] max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-[#101319] shadow-[0_35px_100px_rgba(0,0,0,.45)] lg:grid-cols-[1.08fr_.92fr]">
          <section className="relative hidden min-h-full overflow-hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?q=85&w=1600&auto=format&fit=crop"
              alt="RentCar premium araç"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/20 to-[#101319]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

            <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
              <button
                type="button"
                onClick={() => git("/")}
                className="flex w-fit items-center gap-3 text-left"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber text-asfalt shadow-lg shadow-amber/20">
                  <CarFront size={25} />
                </span>
                <span className="font-display text-2xl font-extrabold text-white">
                  Rent<span className="text-amber">Car</span>
                </span>
              </button>

              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
                  <ShieldCheck size={15} className="text-amber" /> Güvenli ve kolay kiralama
                </span>
                <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                  Aracınızı seçin,
                  <span className="block text-amber">özgürce yola çıkın.</span>
                </h2>
                <p className="mt-5 max-w-lg leading-7 text-white/65">
                  Tek hesabınızla rezervasyonlarınızı yönetin, favori araçlarınızı saklayın ve fırsatlardan haberdar olun.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {["Hızlı rezervasyon", "Kolay rezervasyon", "7/24 müşteri desteği", "Şeffaf fiyatlandırma"].map((ozellik) => (
                    <div key={ozellik} className="flex items-center gap-2 text-sm font-semibold text-white/85">
                      <CheckCircle2 size={17} className="text-amber" /> {ozellik}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16">
            <div className="w-full max-w-md">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber/20 bg-amber/5 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.13em] text-amber">
                <ShieldCheck size={14} /> {rozet}
              </span>

              <h1 className="mt-6 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                {baslik}
              </h1>
              <p className="mt-3 text-sm leading-6 text-metinSoft">{aciklama}</p>

              <div className="mt-8">{children}</div>
            </div>
          </section>
        </div>
      </main>

      <Footer git={git} />
    </div>
  );
}

function FormAlan({ label, icon: Icon, input, right }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[.08em] text-white/65">
        {label}
      </span>
      <span className="relative block">
        <Icon
          size={19}
          className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-amber"
        />
        {input}
        {right}
      </span>
    </label>
  );
}
