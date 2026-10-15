import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarCheck,
  CarFront,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import AracForm from "../components/AracForm";
import AracListesi from "../components/AracListesi";

const MENULER = [
  { id: "ozet", ad: "Genel Bakış", icon: LayoutDashboard },
  { id: "araclar", ad: "Araç Yönetimi", icon: CarFront },
  { id: "rezervasyonlar", ad: "Rezervasyonlar", icon: CalendarCheck },
  { id: "musteriler", ad: "Müşteriler", icon: Users },
  { id: "istatistikler", ad: "İstatistikler", icon: BarChart3 },
  { id: "bildirimler", ad: "Bildirimler", icon: Bell },
  { id: "ayarlar", ad: "Ayarlar", icon: Settings },
];

export default function Admin({
  git,
  araclar,
  bulutAktif = false,
  bulutHata = "",
  rezervasyonlar,
  kullanici,
  cikisYap,
  aracKaydet,
  aracSil,
  aracDurumDegistir,
  rezervasyonDurumDegistir,
  rezervasyonSil,
}) {
  const [sekme, setSekme] = useState("ozet");
  const [duzenlenenArac, setDuzenlenenArac] = useState(null);
  const [mobilMenuAcik, setMobilMenuAcik] = useState(false);
  const [arama, setArama] = useState("");
  const [aracDurumFiltresi, setAracDurumFiltresi] = useState("hepsi");
  const [rezervasyonFiltresi, setRezervasyonFiltresi] = useState("hepsi");

  if (!kullanici) {
    return (
      <YetkiEkrani
        git={git}
        baslik="Admin paneli için giriş yapmalısınız"
        aciklama="Yönetim paneline ulaşmak için yetkili admin hesabıyla giriş yapın."
        buton="Admin Girişi"
        ikon={ShieldCheck}
      />
    );
  }

  if (kullanici.rol !== "admin") {
    return (
      <YetkiEkrani
        git={git}
        baslik="Bu sayfaya erişim yetkiniz yok"
        aciklama="Admin paneli yalnızca yönetici rolüne sahip hesaplar tarafından görüntülenebilir."
        buton="Ana Sayfaya Dön"
        hedef="/"
        ikon={AlertTriangle}
      />
    );
  }

  const toplamCiro = useMemo(
    () =>
      rezervasyonlar
        .filter((r) => r.durum !== "iptal")
        .reduce((toplam, r) => toplam + Number(r.tutar || 0), 0),
    [rezervasyonlar],
  );

  const onayliCiro = useMemo(
    () =>
      rezervasyonlar
        .filter((r) => ["onaylandi", "tamamlandi"].includes(r.durum))
        .reduce((toplam, r) => toplam + Number(r.tutar || 0), 0),
    [rezervasyonlar],
  );

  const musteriler = useMemo(() => {
    const harita = new Map();

    rezervasyonlar.forEach((rezervasyon) => {
      const musteri = rezervasyon.musteri || {};
      const anahtar =
        musteri.email ||
        musteri.telefon ||
        musteri.adSoyad ||
        rezervasyon.id;

      if (!harita.has(anahtar)) {
        harita.set(anahtar, {
          id: anahtar,
          adSoyad: musteri.adSoyad || "Bilgi yok",
          email: musteri.email || "-",
          telefon: musteri.telefon || "-",
          lokasyon: musteri.lokasyon || "-",
          rezervasyonSayisi: 0,
          toplamHarcama: 0,
        });
      }

      const kayit = harita.get(anahtar);
      kayit.rezervasyonSayisi += 1;

      if (rezervasyon.durum !== "iptal") {
        kayit.toplamHarcama += Number(rezervasyon.tutar || 0);
      }
    });

    return [...harita.values()];
  }, [rezervasyonlar]);

  const filtrelenmisAraclar = useMemo(() => {
    const metin = arama.trim().toLowerCase();

    return araclar.filter((arac) => {
      const aramaUyumu =
        !metin ||
        `${arac.marka} ${arac.model} ${arac.plaka} ${arac.sinif}`
          .toLowerCase()
          .includes(metin);

      const durumUyumu =
        aracDurumFiltresi === "hepsi" ||
        arac.durum === aracDurumFiltresi;

      return aramaUyumu && durumUyumu;
    });
  }, [araclar, arama, aracDurumFiltresi]);

  const filtrelenmisRezervasyonlar = useMemo(() => {
    if (rezervasyonFiltresi === "hepsi") {
      return rezervasyonlar;
    }

    return rezervasyonlar.filter(
      (rezervasyon) =>
        (rezervasyon.durum || "bekliyor") === rezervasyonFiltresi,
    );
  }, [rezervasyonlar, rezervasyonFiltresi]);

  const aktifMenu = MENULER.find((menu) => menu.id === sekme);

  const sekmeDegistir = (id) => {
    setSekme(id);
    setMobilMenuAcik(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const aracKaydetVeKapat = (arac) => {
    aracKaydet(arac);
    setDuzenlenenArac(null);
  };

  return (
    <div className="min-h-screen bg-[#0d1016] text-metin">
      {mobilMenuAcik && (
        <button
          type="button"
          aria-label="Menüyü kapat"
          onClick={() => setMobilMenuAcik(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <AdminSidebar
        sekme={sekme}
        sekmeDegistir={sekmeDegistir}
        kullanici={kullanici}
        git={git}
        cikisYap={cikisYap}
        mobilMenuAcik={mobilMenuAcik}
        setMobilMenuAcik={setMobilMenuAcik}
      />

      <div className="min-h-screen lg:pl-[280px]">
        <AdminUstBar
          baslik={aktifMenu?.ad || "Yönetim Paneli"}
          kullanici={kullanici}
          bildirimSayisi={
            rezervasyonlar.filter((r) => r.durum === "bekliyor").length
          }
          menuAc={() => setMobilMenuAcik(true)}
          sekmeDegistir={sekmeDegistir}
        />

        <main className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-amber/5 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-teal/5 blur-[120px]" />

          <div className="relative mx-auto max-w-[1600px]">
            {sekme === "ozet" && (
              <GenelBakis
                araclar={araclar}
                rezervasyonlar={rezervasyonlar}
                toplamCiro={toplamCiro}
                onayliCiro={onayliCiro}
                sekmeDegistir={sekmeDegistir}
                rezervasyonDurumDegistir={rezervasyonDurumDegistir}
                rezervasyonSil={rezervasyonSil}
              />
            )}

            {bulutHata && <div role="alert" className="mb-5 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{bulutHata}</div>}
            {!bulutAktif && <div className="mb-5 rounded-2xl border border-amber/30 bg-amber/10 p-4 text-sm text-amber">Demo modu: araç değişiklikleri bu tarayıcıda görünür. Tüm ziyaretçilere yayınlamak için KURULUM_SUPABASE.md içindeki Supabase kurulumunu tamamlayın.</div>}
            {bulutAktif && <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">Canlı filo bağlantısı aktif • Araç değişiklikleri tüm ziyaretçilere otomatik yansır.</div>}
            {sekme === "araclar" && (
              <AracYonetimi
                araclar={filtrelenmisAraclar}
                tumAracSayisi={araclar.length}
                arama={arama}
                setArama={setArama}
                durumFiltresi={aracDurumFiltresi}
                setDurumFiltresi={setAracDurumFiltresi}
                duzenlenenArac={duzenlenenArac}
                setDuzenlenenArac={setDuzenlenenArac}
                aracKaydetVeKapat={aracKaydetVeKapat}
                aracDurumDegistir={aracDurumDegistir}
                aracSil={aracSil}
              />
            )}

            {sekme === "rezervasyonlar" && (
              <RezervasyonlarBolumu
                rezervasyonlar={filtrelenmisRezervasyonlar}
                toplamRezervasyon={rezervasyonlar.length}
                filtre={rezervasyonFiltresi}
                setFiltre={setRezervasyonFiltresi}
                rezervasyonDurumDegistir={rezervasyonDurumDegistir}
                rezervasyonSil={rezervasyonSil}
              />
            )}

            {sekme === "musteriler" && (
              <MusterilerBolumu musteriler={musteriler} />
            )}

            {sekme === "istatistikler" && (
              <IstatistiklerBolumu
                araclar={araclar}
                rezervasyonlar={rezervasyonlar}
                toplamCiro={toplamCiro}
                onayliCiro={onayliCiro}
              />
            )}

            {sekme === "bildirimler" && (
              <BildirimlerBolumu rezervasyonlar={rezervasyonlar} />
            )}

            {sekme === "ayarlar" && (
              <AyarlarBolumu kullanici={kullanici} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({
  sekme,
  sekmeDegistir,
  kullanici,
  git,
  cikisYap,
  mobilMenuAcik,
  setMobilMenuAcik,
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/[0.07] bg-[#11151d]/95 shadow-2xl shadow-black/30 backdrop-blur-2xl transition-transform duration-300 ${
        mobilMenuAcik ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="flex h-20 items-center justify-between border-b border-white/[0.07] px-5">
        <button
          type="button"
          onClick={() => git("/")}
          className="flex items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber text-asfalt shadow-[0_12px_35px_rgba(255,182,39,0.2)]">
            <CarFront size={22} />
          </span>

          <div className="text-left">
            <p className="font-display text-xl font-extrabold text-white">
              Rent<span className="text-amber">Car</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-metinSoft">
              Yönetim Paneli
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setMobilMenuAcik(false)}
          className="rounded-xl border border-white/10 p-2 text-metinSoft lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-5">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-metinSoft/55">
          Ana Menü
        </p>

        <nav className="mt-3 space-y-1.5">
          {MENULER.map(({ id, ad, icon: Icon }) => {
            const aktif = sekme === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => sekmeDegistir(id)}
                className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${
                  aktif
                    ? "bg-amber text-asfalt shadow-[0_10px_30px_rgba(255,182,39,0.13)]"
                    : "text-metinSoft hover:bg-white/[0.045] hover:text-white"
                }`}
              >
                <Icon
                  size={18}
                  className={aktif ? "text-asfalt" : "text-amber"}
                />

                <span className="flex-1">{ad}</span>

                <ChevronRight
                  size={15}
                  className={`transition ${
                    aktif
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="my-5 h-px bg-white/[0.07]" />

        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-metinSoft/55">
          Hızlı İşlemler
        </p>

        <div className="mt-3 space-y-1.5">
          <button
            type="button"
            onClick={() => git("/")}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold text-metinSoft transition hover:bg-white/[0.045] hover:text-white"
          >
            <Home size={18} className="text-teal" />
            Siteye Dön
          </button>

          <button
            type="button"
            onClick={cikisYap}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold text-tehlike/80 transition hover:bg-tehlike/10 hover:text-tehlike"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="border-t border-white/[0.07] p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 font-bold text-amber">
            {String(kullanici.ad || "A")
              .split(" ")
              .map((kelime) => kelime[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {kullanici.ad}
            </p>
            <p className="truncate text-[11px] text-metinSoft">
              Süper Yönetici
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function AdminUstBar({
  baslik,
  kullanici,
  bildirimSayisi,
  menuAc,
  sekmeDegistir,
}) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.07] bg-[#0d1016]/85 px-4 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={menuAc}
          className="rounded-xl border border-white/10 bg-white/[0.035] p-2.5 text-white lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate font-display text-xl font-bold text-white sm:text-2xl">
            {baslik}
          </h1>
          <p className="mt-0.5 hidden text-xs text-metinSoft sm:block">
            RentCar Yönetim Paneli / {baslik}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => sekmeDegistir("bildirimler")}
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-metinSoft transition hover:border-amber/30 hover:text-amber"
        >
          <Bell size={19} />

          {bildirimSayisi > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-tehlike px-1 text-[10px] font-bold text-white">
              {bildirimSayisi}
            </span>
          )}
        </button>

        <div className="hidden items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 sm:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber text-xs font-bold text-asfalt">
            {String(kullanici.ad || "A").charAt(0).toUpperCase()}
          </span>

          <div className="max-w-36">
            <p className="truncate text-xs font-bold text-white">
              {kullanici.ad}
            </p>
            <p className="truncate text-[10px] text-metinSoft">
              Yönetici
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function GenelBakis({
  araclar,
  rezervasyonlar,
  toplamCiro,
  onayliCiro,
  sekmeDegistir,
  rezervasyonDurumDegistir,
  rezervasyonSil,
}) {
  const bekleyen = rezervasyonlar.filter(
    (r) => r.durum === "bekliyor",
  ).length;

  const aktifKiralama = rezervasyonlar.filter((r) =>
    ["onaylandi"].includes(r.durum),
  ).length;

  return (
    <>
      <BolumBasligi
        ustBaslik="Yönetim Paneli"
        baslik="Genel Bakış"
        aciklama="Araçlarınızı, rezervasyonlarınızı ve gelirlerinizi tek ekrandan takip edin."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OzetKarti
          icon={CarFront}
          baslik="Toplam Araç"
          deger={araclar.length}
          altMetin={`${araclar.filter((a) => a.durum === "musait").length} araç müsait`}
          vurgu="amber"
        />

        <OzetKarti
          icon={CalendarCheck}
          baslik="Toplam Rezervasyon"
          deger={rezervasyonlar.length}
          altMetin={`${bekleyen} yeni talep bekliyor`}
          vurgu="teal"
        />

        <OzetKarti
          icon={WalletCards}
          baslik="Toplam Ciro"
          deger={`₺${toplamCiro.toLocaleString("tr-TR")}`}
          altMetin={`₺${onayliCiro.toLocaleString("tr-TR")} onaylı gelir`}
          vurgu="mor"
        />

        <OzetKarti
          icon={Clock3}
          baslik="Aktif Kiralama"
          deger={aktifKiralama}
          altMetin={`${bekleyen} bekleyen rezervasyon`}
          vurgu="mavi"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <Panel
          baslik="Son Rezervasyonlar"
          aciklama="En güncel kiralama talepleri"
          sagIcerik={
            <button
              type="button"
              onClick={() => sekmeDegistir("rezervasyonlar")}
              className="text-xs font-bold text-amber hover:brightness-125"
            >
              Tümünü Gör
            </button>
          }
        >
          <RezervasyonTablosu
            rezervasyonlar={rezervasyonlar.slice(0, 5)}
            rezervasyonDurumDegistir={rezervasyonDurumDegistir}
            rezervasyonSil={rezervasyonSil}
            kompakt
          />
        </Panel>

        <div className="space-y-6">
          <Panel
            baslik="Filo Durumu"
            aciklama="Anlık araç kullanılabilirliği"
          >
            <div className="grid grid-cols-3 gap-3 p-5">
              {[
                [
                  "Müsait",
                  araclar.filter((a) => a.durum === "musait").length,
                  "text-teal",
                ],
                [
                  "Kirada",
                  araclar.filter((a) => a.durum === "kirada").length,
                  "text-amber",
                ],
                [
                  "Bakımda",
                  araclar.filter((a) => a.durum === "bakimda").length,
                  "text-tehlike",
                ],
              ].map(([ad, sayi, renk]) => (
                <div
                  key={ad}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 text-center"
                >
                  <p className={`text-2xl font-extrabold ${renk}`}>
                    {sayi}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wide text-metinSoft">
                    {ad}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            baslik="Rezervasyon Durumları"
            aciklama="Talep dağılımı"
          >
            <div className="p-5">
              <MiniGrafik
                veriler={[
                  [
                    "Bekleyen",
                    rezervasyonlar.filter((r) => r.durum === "bekliyor")
                      .length,
                    "bg-amber",
                  ],
                  [
                    "Onaylanan",
                    rezervasyonlar.filter((r) => r.durum === "onaylandi")
                      .length,
                    "bg-teal",
                  ],
                  [
                    "Tamamlanan",
                    rezervasyonlar.filter((r) => r.durum === "tamamlandi")
                      .length,
                    "bg-white",
                  ],
                  [
                    "İptal",
                    rezervasyonlar.filter((r) => r.durum === "iptal")
                      .length,
                    "bg-tehlike",
                  ],
                ]}
              />
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

function AracYonetimi({
  araclar,
  tumAracSayisi,
  arama,
  setArama,
  durumFiltresi,
  setDurumFiltresi,
  duzenlenenArac,
  setDuzenlenenArac,
  aracKaydetVeKapat,
  aracDurumDegistir,
  aracSil,
}) {
  return (
    <>
      <BolumBasligi
        ustBaslik="Filo Yönetimi"
        baslik="Araç Yönetimi"
        aciklama={`${tumAracSayisi} araç içinden filonuzu yönetin, düzenleyin ve yeni araç ekleyin.`}
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[390px_1fr]">
        <div className="xl:sticky xl:top-28 xl:self-start">
          <AracForm
            onKaydet={aracKaydetVeKapat}
            duzenlenenArac={duzenlenenArac}
            onIptal={() => setDuzenlenenArac(null)}
          />
        </div>

        <div>
          <div className="mb-5 rounded-3xl border border-white/[0.08] bg-[#151a23] p-4 shadow-xl shadow-black/10">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-metinSoft"
                />

                <input
                  value={arama}
                  onChange={(e) => setArama(e.target.value)}
                  placeholder="Marka, model, plaka veya sınıf ara..."
                  className="h-11 w-full rounded-xl border border-white/10 bg-black/15 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-metinSoft/45 focus:border-amber/40 focus:ring-4 focus:ring-amber/10"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {[
                  ["hepsi", "Tümü"],
                  ["musait", "Müsait"],
                  ["kirada", "Kirada"],
                  ["bakimda", "Bakımda"],
                ].map(([id, ad]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setDurumFiltresi(id)}
                    className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                      durumFiltresi === id
                        ? "border-amber bg-amber text-asfalt"
                        : "border-white/10 bg-white/[0.025] text-metinSoft hover:border-amber/25 hover:text-white"
                    }`}
                  >
                    {ad}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <AracListesi
            araclar={araclar}
            onDurumDegistir={aracDurumDegistir}
            onDuzenle={(arac) => {
              setDuzenlenenArac(arac);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onSil={(id) =>
              window.confirm("Bu aracı silmek istediğinize emin misiniz?") &&
              aracSil(id)
            }
          />
        </div>
      </div>
    </>
  );
}

function RezervasyonlarBolumu({
  rezervasyonlar,
  toplamRezervasyon,
  filtre,
  setFiltre,
  rezervasyonDurumDegistir,
  rezervasyonSil,
}) {
  return (
    <>
      <BolumBasligi
        ustBaslik="Kiralama Yönetimi"
        baslik="Rezervasyonlar"
        aciklama={`${toplamRezervasyon} rezervasyon kaydını görüntüleyin ve durumlarını yönetin.`}
      />

      <div className="mt-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#151a23] p-2">
        {[
          ["hepsi", "Tümü"],
          ["bekliyor", "Bekleyen"],
          ["onaylandi", "Onaylanan"],
          ["tamamlandi", "Tamamlanan"],
          ["iptal", "İptal"],
        ].map(([id, ad]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFiltre(id)}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              filtre === id
                ? "bg-amber text-asfalt"
                : "text-metinSoft hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            {ad}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#151a23]">
        <RezervasyonTablosu
          rezervasyonlar={rezervasyonlar}
          rezervasyonDurumDegistir={rezervasyonDurumDegistir}
          rezervasyonSil={rezervasyonSil}
        />
      </div>
    </>
  );
}

function MusterilerBolumu({ musteriler }) {
  return (
    <>
      <BolumBasligi
        ustBaslik="Kullanıcı Yönetimi"
        baslik="Müşteriler"
        aciklama="Rezervasyon yapan müşterilerin iletişim ve harcama bilgilerini inceleyin."
      />

      {musteriler.length ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {musteriler.map((musteri) => (
            <article
              key={musteri.id}
              className="rounded-3xl border border-white/[0.08] bg-[#151a23] p-5 transition hover:-translate-y-1 hover:border-amber/25"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber/10 font-bold text-amber">
                  {musteri.adSoyad
                    .split(" ")
                    .map((kelime) => kelime[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>

                <span className="rounded-full border border-teal/20 bg-teal/10 px-3 py-1 text-[10px] font-bold text-teal">
                  Aktif Müşteri
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-white">
                {musteri.adSoyad}
              </h3>

              <div className="mt-4 space-y-2.5 text-xs text-metinSoft">
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-amber" />
                  {musteri.email}
                </p>

                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-amber" />
                  {musteri.telefon}
                </p>

                <p className="flex items-center gap-2">
                  <MapPin size={14} className="text-amber" />
                  {musteri.lokasyon}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-metinSoft">
                    Rezervasyon
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-white">
                    {musteri.rezervasyonSayisi}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-metinSoft">
                    Toplam Harcama
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-amber">
                    ₺{musteri.toplamHarcama.toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <BosDurum
          icon={Users}
          baslik="Henüz müşteri bulunmuyor"
          aciklama="Rezervasyon yapan müşteriler burada listelenecek."
        />
      )}
    </>
  );
}

function IstatistiklerBolumu({
  araclar,
  rezervasyonlar,
  toplamCiro,
  onayliCiro,
}) {
  const enPahali = [...araclar].sort(
    (a, b) => Number(b.gunlukFiyat || 0) - Number(a.gunlukFiyat || 0),
  )[0];

  const enUcuz = [...araclar].sort(
    (a, b) => Number(a.gunlukFiyat || 0) - Number(b.gunlukFiyat || 0),
  )[0];

  const yakitSayilari = ["Benzin", "Dizel", "Hibrit", "Elektrik"].map(
    (yakit) => [
      yakit,
      araclar.filter((arac) => arac.yakit === yakit).length,
      yakit === "Dizel"
        ? "bg-blue-500"
        : yakit === "Elektrik"
          ? "bg-teal"
          : yakit === "Hibrit"
            ? "bg-purple-500"
            : "bg-amber",
    ],
  );

  const vitesSayilari = ["Manuel", "Otomatik", "Yarı Otomatik"].map(
    (vites) => [
      vites,
      araclar.filter((arac) => arac.vites === vites).length,
      vites === "Otomatik"
        ? "bg-amber"
        : vites === "Yarı Otomatik"
          ? "bg-purple-500"
          : "bg-teal",
    ],
  );

  return (
    <>
      <BolumBasligi
        ustBaslik="Analiz Raporları"
        baslik="İstatistikler"
        aciklama="Filonuzun, rezervasyonların ve gelirlerin performansını inceleyin."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OzetKarti
          icon={WalletCards}
          baslik="Toplam Ciro"
          deger={`₺${toplamCiro.toLocaleString("tr-TR")}`}
          altMetin="İptal dışındaki rezervasyonlar"
          vurgu="amber"
        />

        <OzetKarti
          icon={CheckCircle2}
          baslik="Onaylı Ciro"
          deger={`₺${onayliCiro.toLocaleString("tr-TR")}`}
          altMetin="Onaylanan ve tamamlanan"
          vurgu="teal"
        />

        <OzetKarti
          icon={CarFront}
          baslik="En Pahalı Araç"
          deger={
            enPahali
              ? `${enPahali.marka} ${enPahali.model}`
              : "-"
          }
          altMetin={
            enPahali
              ? `₺${Number(enPahali.gunlukFiyat).toLocaleString("tr-TR")} / gün`
              : "Araç bulunmuyor"
          }
          vurgu="mor"
        />

        <OzetKarti
          icon={Clock3}
          baslik="En Uygun Araç"
          deger={
            enUcuz ? `${enUcuz.marka} ${enUcuz.model}` : "-"
          }
          altMetin={
            enUcuz
              ? `₺${Number(enUcuz.gunlukFiyat).toLocaleString("tr-TR")} / gün`
              : "Araç bulunmuyor"
          }
          vurgu="mavi"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          baslik="Yakıt Türü Dağılımı"
          aciklama={`${araclar.length} araç üzerinden hesaplandı`}
        >
          <div className="p-6">
            <MiniGrafik veriler={yakitSayilari} />
          </div>
        </Panel>

        <Panel
          baslik="Vites Türü Dağılımı"
          aciklama="Filo vites dağılımı"
        >
          <div className="p-6">
            <MiniGrafik veriler={vitesSayilari} />
          </div>
        </Panel>

        <Panel
          baslik="Rezervasyon Durumları"
          aciklama={`${rezervasyonlar.length} toplam kayıt`}
        >
          <div className="p-6">
            <MiniGrafik
              veriler={[
                [
                  "Bekleyen",
                  rezervasyonlar.filter((r) => r.durum === "bekliyor")
                    .length,
                  "bg-amber",
                ],
                [
                  "Onaylanan",
                  rezervasyonlar.filter((r) => r.durum === "onaylandi")
                    .length,
                  "bg-teal",
                ],
                [
                  "Tamamlanan",
                  rezervasyonlar.filter((r) => r.durum === "tamamlandi")
                    .length,
                  "bg-white",
                ],
                [
                  "İptal",
                  rezervasyonlar.filter((r) => r.durum === "iptal")
                    .length,
                  "bg-tehlike",
                ],
              ]}
            />
          </div>
        </Panel>

        <Panel
          baslik="Filo Durumu"
          aciklama="Araçların anlık dağılımı"
        >
          <div className="p-6">
            <MiniGrafik
              veriler={[
                [
                  "Müsait",
                  araclar.filter((a) => a.durum === "musait").length,
                  "bg-teal",
                ],
                [
                  "Kirada",
                  araclar.filter((a) => a.durum === "kirada").length,
                  "bg-amber",
                ],
                [
                  "Bakımda",
                  araclar.filter((a) => a.durum === "bakimda").length,
                  "bg-tehlike",
                ],
              ]}
            />
          </div>
        </Panel>
      </div>
    </>
  );
}

function BildirimlerBolumu({ rezervasyonlar }) {
  const bildirimler = [
    ...rezervasyonlar
      .filter((r) => r.durum === "bekliyor")
      .map((r) => ({
        id: `bekleyen-${r.id}`,
        baslik: "Yeni rezervasyon talebi",
        aciklama: `${r.musteri?.adSoyad || "Bir müşteri"} ${
          r.arac || "bir araç"
        } için rezervasyon oluşturdu.`,
        zaman: r.baslangic || "Yeni",
        renk: "amber",
      })),
    ...rezervasyonlar
      .filter((r) => r.durum === "onaylandi")
      .map((r) => ({
        id: `onay-${r.id}`,
        baslik: "Onaylanan rezervasyon",
        aciklama: `${r.arac || "Araç"} rezervasyonu onaylandı.`,
        zaman: r.bitis || "Yaklaşan",
        renk: "teal",
      })),
  ];

  return (
    <>
      <BolumBasligi
        ustBaslik="Bildirim Merkezi"
        baslik="Bildirimler"
        aciklama="Yeni rezervasyonları ve yaklaşan kiralama işlemlerini takip edin."
      />

      {bildirimler.length ? (
        <div className="mt-6 space-y-3">
          {bildirimler.map((bildirim) => (
            <article
              key={bildirim.id}
              className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#151a23] p-5"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  bildirim.renk === "teal"
                    ? "bg-teal/10 text-teal"
                    : "bg-amber/10 text-amber"
                }`}
              >
                <Bell size={19} />
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white">
                  {bildirim.baslik}
                </h3>
                <p className="mt-1 text-sm leading-6 text-metinSoft">
                  {bildirim.aciklama}
                </p>
              </div>

              <span className="shrink-0 text-[10px] text-metinSoft">
                {bildirim.zaman}
              </span>
            </article>
          ))}
        </div>
      ) : (
        <BosDurum
          icon={Bell}
          baslik="Yeni bildirim bulunmuyor"
          aciklama="Yeni rezervasyon ve güncellemeler burada görünecek."
        />
      )}
    </>
  );
}

function AyarlarBolumu({ kullanici }) {
  const [kaydedildi, setKaydedildi] = useState(false);
  const [form, setForm] = useState({
    firmaAdi: "RentCar",
    telefon: "0 (850) 123 45 67",
    email: "info@rentcar.com",
    adres: "Şanlıurfa, Türkiye",
    yonetici: kullanici.ad || "RentCar Yöneticisi",
  });

  const kaydet = (e) => {
    e.preventDefault();
    localStorage.setItem("rentcar-admin-ayarlari", JSON.stringify(form));
    setKaydedildi(true);
    window.setTimeout(() => setKaydedildi(false), 2500);
  };

  return (
    <>
      <BolumBasligi
        ustBaslik="Sistem Ayarları"
        baslik="Ayarlar"
        aciklama="Firma ve yönetici bilgilerini düzenleyin."
      />

      <form
        onSubmit={kaydet}
        className="mt-6 max-w-3xl rounded-3xl border border-white/[0.08] bg-[#151a23] p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ["firmaAdi", "Firma Adı"],
            ["telefon", "Telefon"],
            ["email", "E-posta"],
            ["adres", "Adres"],
            ["yonetici", "Yönetici Adı"],
          ].map(([alan, etiket]) => (
            <label
              key={alan}
              className={alan === "adres" ? "sm:col-span-2" : ""}
            >
              <span className="mb-2 block text-xs font-semibold text-metinSoft">
                {etiket}
              </span>

              <input
                value={form[alan]}
                onChange={(e) =>
                  setForm((onceki) => ({
                    ...onceki,
                    [alan]: e.target.value,
                  }))
                }
                className="h-12 w-full rounded-xl border border-white/10 bg-black/15 px-4 text-sm text-white outline-none transition focus:border-amber/40 focus:ring-4 focus:ring-amber/10"
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 rounded-xl bg-amber px-6 py-3 font-bold text-asfalt transition hover:brightness-110"
        >
          {kaydedildi ? "Ayarlar Kaydedildi" : "Ayarları Kaydet"}
        </button>
      </form>
    </>
  );
}

function BolumBasligi({ ustBaslik, baslik, aciklama }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber">
        {ustBaslik}
      </p>
      <h2 className="mt-2 font-display text-3xl font-extrabold text-white">
        {baslik}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-metinSoft">
        {aciklama}
      </p>
    </div>
  );
}

function OzetKarti({
  icon: Icon,
  baslik,
  deger,
  altMetin,
  vurgu = "amber",
}) {
  const renkler = {
    amber: "bg-amber/10 text-amber border-amber/15",
    teal: "bg-teal/10 text-teal border-teal/15",
    mor: "bg-purple-500/10 text-purple-400 border-purple-500/15",
    mavi: "bg-blue-500/10 text-blue-400 border-blue-500/15",
  };

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#151a23] p-5 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-amber/25">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${renkler[vurgu]}`}
      >
        <Icon size={20} />
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.13em] text-metinSoft">
        {baslik}
      </p>

      <p className="mt-2 break-words font-display text-2xl font-extrabold text-white">
        {deger}
      </p>

      <p className="mt-2 text-xs text-metinSoft">
        {altMetin}
      </p>

      <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-amber/5 blur-3xl transition group-hover:bg-amber/10" />
    </article>
  );
}

function Panel({ baslik, aciklama, sagIcerik, children }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#151a23] shadow-xl shadow-black/10">
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-4 sm:px-6">
        <div>
          <h3 className="font-display text-lg font-bold text-white">
            {baslik}
          </h3>
          {aciklama && (
            <p className="mt-1 text-xs text-metinSoft">{aciklama}</p>
          )}
        </div>

        {sagIcerik}
      </div>

      {children}
    </section>
  );
}

function RezervasyonTablosu({
  rezervasyonlar,
  rezervasyonDurumDegistir,
  rezervasyonSil,
  kompakt = false,
}) {
  if (!rezervasyonlar.length) {
    return (
      <p className="p-10 text-center text-sm text-metinSoft">
        Henüz rezervasyon bulunmuyor.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full text-left text-sm ${
          kompakt ? "min-w-[760px]" : "min-w-[1100px]"
        }`}
      >
        <thead className="bg-white/[0.025] text-[10px] uppercase tracking-wider text-metinSoft">
          <tr>
            <th className="px-5 py-4">Müşteri</th>
            {!kompakt && <th className="px-5 py-4">İletişim</th>}
            <th className="px-5 py-4">Araç</th>
            <th className="px-5 py-4">Tarih</th>
            {!kompakt && <th className="px-5 py-4">Lokasyon</th>}
            <th className="px-5 py-4">Tutar</th>
            <th className="px-5 py-4">Durum</th>
            {!kompakt && <th className="px-5 py-4">İşlem</th>}
          </tr>
        </thead>

        <tbody>
          {rezervasyonlar.map((rezervasyon) => (
            <tr
              key={rezervasyon.id}
              className="border-t border-white/[0.055] align-middle text-white transition hover:bg-white/[0.02]"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-xs font-bold text-amber">
                    {(rezervasyon.musteri?.adSoyad || "M")
                      .split(" ")
                      .map((kelime) => kelime[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>

                  <div>
                    <p className="font-semibold">
                      {rezervasyon.musteri?.adSoyad || "Bilgi yok"}
                    </p>
                    <p className="mt-0.5 text-[10px] text-metinSoft">
                      {rezervasyon.musteri?.email || "-"}
                    </p>
                  </div>
                </div>
              </td>

              {!kompakt && (
                <td className="px-5 py-4 text-xs text-metinSoft">
                  <p className="flex items-center gap-2">
                    <Phone size={13} />
                    {rezervasyon.musteri?.telefon || "-"}
                  </p>
                </td>
              )}

              <td className="px-5 py-4">
                <p className="font-semibold">
                  {rezervasyon.arac || "Araç bilgisi yok"}
                </p>
                <p className="mt-1 text-[10px] text-metinSoft">
                  {rezervasyon.gun || 0} gün
                </p>
              </td>

              <td className="px-5 py-4 text-xs text-metinSoft">
                <p>{rezervasyon.baslangic || "-"}</p>
                <p className="mt-1 text-amber">
                  {rezervasyon.bitis || "-"}
                </p>
              </td>

              {!kompakt && (
                <td className="px-5 py-4 text-xs text-metinSoft">
                  <p className="flex items-center gap-2">
                    <MapPin size={13} />
                    {rezervasyon.musteri?.lokasyon || "-"}
                  </p>
                </td>
              )}

              <td className="px-5 py-4 font-bold text-amber">
                ₺
                {Number(rezervasyon.tutar || 0).toLocaleString(
                  "tr-TR",
                )}
              </td>

              <td className="px-5 py-4">
                <select
                  value={rezervasyon.durum || "bekliyor"}
                  onChange={(e) =>
                    rezervasyonDurumDegistir(
                      rezervasyon.id,
                      e.target.value,
                    )
                  }
                  className="rounded-xl border border-white/10 bg-[#0d1016] px-3 py-2 text-xs font-semibold text-white outline-none transition focus:border-amber/40"
                >
                  <option value="bekliyor">Bekliyor</option>
                  <option value="onaylandi">Onaylandı</option>
                  <option value="tamamlandi">Tamamlandı</option>
                  <option value="iptal">İptal</option>
                </select>
              </td>

              {!kompakt && (
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      window.confirm(
                        "Rezervasyon silinsin mi?",
                      ) && rezervasyonSil(rezervasyon.id)
                    }
                    className="rounded-xl border border-tehlike/20 bg-tehlike/10 p-2.5 text-tehlike transition hover:bg-tehlike/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniGrafik({ veriler }) {
  const max = Math.max(
    1,
    ...veriler.map(([, sayi]) => sayi),
  );

  return (
    <div className="space-y-5">
      {veriler.map(([ad, sayi, renk]) => (
        <div key={ad}>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-metinSoft">{ad}</span>
            <b className="text-white">{sayi}</b>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${renk}`}
              style={{ width: `${(sayi / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function BosDurum({ icon: Icon, baslik, aciklama }) {
  return (
    <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-[#151a23] px-6 py-16 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber/15 bg-amber/10 text-amber">
        <Icon size={28} />
      </span>

      <h3 className="mt-5 text-xl font-bold text-white">
        {baslik}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-metinSoft">
        {aciklama}
      </p>
    </div>
  );
}

function YetkiEkrani({
  git,
  baslik,
  aciklama,
  buton,
  hedef = "/giris",
  ikon: Icon,
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1016] px-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#151a23] p-8 text-center shadow-2xl shadow-black/30">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber/25 bg-amber/10 text-amber">
          <Icon size={30} />
        </span>

        <h1 className="mt-6 font-display text-3xl font-extrabold text-white">
          {baslik}
        </h1>

        <p className="mx-auto mt-3 max-w-md leading-7 text-metinSoft">
          {aciklama}
        </p>

        <button
          type="button"
          onClick={() => git(hedef)}
          className="mt-7 rounded-xl bg-amber px-7 py-3.5 font-bold text-asfalt transition hover:brightness-110"
        >
          {buton}
        </button>
      </div>
    </div>
  );
}
