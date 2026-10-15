import { supabase, supabaseHazir } from "./supabaseClient";
import { useEffect, useState } from "react";
import Anasayfa from "./pages/Anasayfa";
import Araclar from "./pages/Araclar";
import Hakkimizda from "./pages/Hakkimizda";
import Hizmetler from "./pages/Hizmetler";
import Iletisim from "./pages/Iletisim";
import Kampanyalar from "./pages/Kampanyalar";
import SSS from "./pages/SSS";
import AracDetay from "./pages/AracDetay";
import Rezervasyon from "./pages/Rezervasyon";
import Giris, { Kayit } from "./pages/Giris";
import Favoriler from "./pages/Favoriler";
import Admin from "./pages/Admin";
import SplashScreen from "./components/SplashScreen";
import Hesabim from "./pages/Hesabim";
import Bildirimler from "./pages/Bildirimler";

// Kullanıcı adları Supabase Auth içinde dahili, teslim edilmeyen e-posta kimliğine çevrilir.
// Gerçek e-posta istenmez; parola doğrulaması Supabase Auth tarafından yapılır.
const kullaniciAdiKontrol = (value) => /^[a-z0-9_]{3,24}$/.test(String(value || '').trim().toLowerCase());
const dahiliEmail = (value) => `${String(value).trim().toLowerCase()}@users.rentcar.example.com`;
const musteriHesabi = (email) => String(email || '').toLowerCase().endsWith('@users.rentcar.example.com');
const FILO = "arac-kiralama-filosu";
const FAV = "rentcar-favoriler";
const USERS = "rentcar-kullanicilar";
const USER = "rentcar-aktif-kullanici";
const REZ = "rentcar-rezervasyonlar";
const YORUMLAR = "rentcar-yorumlar";

// Demo modu (Supabase bağlantısı kurulana kadar yerel test içindir).
const ADMIN_HESABI = {
  ad: "RentCar Yöneticisi",
  email: "admin@rentcar.com",
  sifre: "Admin123",
  rol: "admin",
};

const ORNEK_FILO = [
  {
    id: "golf",
    marka: "Volkswagen",
    model: "Golf",
    yil: 2023,
    plaka: "34 ABC 123",
    sinif: "Ekonomi",
    gunlukFiyat: 1450,
    kilometre: 42000,
    yakit: "Benzin",
    vites: "Otomatik",
    kisiSayisi: 5,
    kapiSayisi: 5,
    bagaj: "Orta",
    klima: true,
    resimler: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop",
    ],
    durum: "musait",
    resimUrl:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "bmw-x5",
    marka: "BMW",
    model: "X5",
    yil: 2024,
    plaka: "06 XYZ 456",
    sinif: "SUV",
    gunlukFiyat: 3200,
    kilometre: 18000,
    yakit: "Dizel",
    vites: "Otomatik",
    kisiSayisi: 5,
    kapiSayisi: 5,
    bagaj: "Büyük",
    klima: true,
    resimler: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?q=80&w=1200&auto=format&fit=crop",
    ],
    durum: "musait",
    resimUrl:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "mercedes-c200",
    marka: "Mercedes-Benz",
    model: "C200",
    yil: 2022,
    plaka: "35 DEF 789",
    sinif: "Lüks",
    gunlukFiyat: 2650,
    kilometre: 36000,
    yakit: "Benzin",
    vites: "Otomatik",
    kisiSayisi: 5,
    kapiSayisi: 4,
    bagaj: "Orta",
    klima: true,
    resimler: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
    ],
    durum: "musait",
    resimUrl:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop",
  },
];

const oku = (anahtar, varsayilan) => {
  try {
    return JSON.parse(localStorage.getItem(anahtar)) ?? varsayilan;
  } catch {
    return varsayilan;
  }
};

function App() {
  const [bulutAktif, setBulutAktif] = useState(false);
  const [bulutHata, setBulutHata] = useState("");
  const [bulutHazir, setBulutHazir] = useState(false);
  const [authHazir, setAuthHazir] = useState(false);
  const [bulut, setBulut] = useState(null);
  const [splashGoster, setSplashGoster] = useState(true);
  const [yol, setYol] = useState(location.pathname);
  const [araclar, setAraclar] = useState(() => oku(FILO, ORNEK_FILO));
  const [favoriler, setFavoriler] = useState(() => oku(FAV, []));
  const [kullanici, setKullanici] = useState(() => supabaseHazir ? null : oku(USER, null));
  const [rezervasyonlar, setRezervasyonlar] = useState(() => supabaseHazir ? [] : oku(REZ, []));
  const [doluTarihler, setDoluTarihler] = useState([]);
  const [yorumlar, setYorumlar] = useState(() => oku(YORUMLAR, []));

  useEffect(() => {
    const splashZamanlayici = window.setTimeout(() => {
      setSplashGoster(false);
    }, 5000);

    return () => window.clearTimeout(splashZamanlayici);
  }, []);

  useEffect(() => {
    const sayfaDegisti = () => {
      setYol(location.pathname);
      scrollTo(0, 0);
    };

    addEventListener("popstate", sayfaDegisti);
    return () => removeEventListener("popstate", sayfaDegisti);
  }, []);

  // Supabase: herkese açık araç okuma, rolü veritabanından doğrulanan admin yazma.
  useEffect(() => {
    if (!supabaseHazir) { setBulutHazir(true); setAuthHazir(true); return; }
    let mounted = true;
    const filoYukle = async () => {
      const { data, error } = await supabase.from("site_filo").select("araclar").eq("id", 1).maybeSingle();
      if (!mounted) return;
      if (error) setBulutHata("Araçlar okunamadı: " + error.message);
      else { setAraclar(data?.araclar ?? []); setBulutHata(""); }
      setBulutHazir(true);
    };
    const kullaniciYukle = async (session) => {
      if (!session?.user) { if (mounted) { setKullanici(null); setAuthHazir(true); } return; }
      const user = session.user;
      const { data, error } = await supabase.from("site_admins").select("user_id").eq("user_id",user.id).maybeSingle();
      if (!mounted) return;
      if (error) setBulutHata("Yetki bilgisi alınamadı: " + error.message);
      setKullanici({ id:user.id, email:user.email, ad:user.user_metadata?.ad || user.user_metadata?.kullaniciAdi || user.email?.split("@")[0] || "Müşteri", kullaniciAdi:user.user_metadata?.kullaniciAdi || (musteriHesabi(user.email) ? user.email.split("@")[0] : null), rol: data ? "admin" : "kullanici" });
      setAuthHazir(true);
    };
    const rezervasyonlariYukle = async (session) => {
      if (!mounted) return;
      const { data: takvim, error: takvimHatasi } = await supabase.rpc("rezervasyon_dolu_tarihler");
      if (mounted && !takvimHatasi) setDoluTarihler(takvim || []);
      if (takvimHatasi && mounted) setBulutHata("Rezervasyon takvimi alınamadı: " + takvimHatasi.message);
      if (!session?.user) { if (mounted) setRezervasyonlar([]); return; }
      const { data, error } = await supabase.from("site_rezervasyonlar")
        .select("id,kullanici_id,created_at,durum,veri").order("created_at", {ascending:false});
      if (!mounted) return;
      if (error) { setBulutHata("Rezervasyonlar okunamadı: " + error.message); return; }
      setRezervasyonlar((data || []).map(r => ({...r.veri, id:r.id,
        kullaniciId:r.kullanici_id, tarih:r.created_at, durum:r.durum})));
    };
    const refreshRezervasyon = () => supabase.auth.getSession()
      .then(({data}) => rezervasyonlariYukle(data.session))
      .catch(err => mounted && setBulutHata(err.message));
    setBulut({ client:supabase });
    setBulutAktif(true);
    filoYukle();
    refreshRezervasyon();
    supabase.auth.getSession().then(({data})=>kullaniciYukle(data.session)).catch(err=>{setBulutHata(err.message);setAuthHazir(true);});
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event,session)=>{
      // Auth callback dışında sorgula: Supabase auth kilitlenmesini önler.
      setTimeout(()=>{kullaniciYukle(session);rezervasyonlariYukle(session);},0);
    });
    const channel = supabase.channel("filo-canli").on("postgres_changes", {event:"*",schema:"public",table:"site_filo",filter:"id=eq.1"}, ()=>filoYukle()).subscribe();
    const rezChannel = supabase.channel("rezervasyon-canli")
      .on("postgres_changes", {event:"*",schema:"public",table:"site_rezervasyonlar"}, refreshRezervasyon)
      .subscribe();
    const sayfaGorunur = () => { if (!document.hidden) refreshRezervasyon(); };
    document.addEventListener("visibilitychange",sayfaGorunur);
    return ()=>{mounted=false;subscription.unsubscribe();supabase.removeChannel(channel);
      supabase.removeChannel(rezChannel);document.removeEventListener("visibilitychange",sayfaGorunur);};
  }, []);

  const filoBulutaKaydet = async (guncelle) => {
    if (!supabaseHazir) { setAraclar(guncelle); return; }
    // Sunucu tarafında işlem atomic yapılır, RLS admin dışındaki yazmaları engeller.
    const { error } = await supabase.rpc("filo_guncelle", { yeni_araclar: guncelle(araclar) });
    if (error) setBulutHata("Kaydedilemedi: " + error.message);
    else {
      const {data, error: readError} = await supabase.from("site_filo").select("araclar").eq("id",1).single();
      if (!readError && data) setAraclar(data.araclar);
      setBulutHata("");
    }
  };
  useEffect(() => { if (!bulutAktif) localStorage.setItem(FILO, JSON.stringify(araclar)); }, [araclar, bulutAktif]);
  useEffect(() => localStorage.setItem(FAV, JSON.stringify(favoriler)), [favoriler]);
  useEffect(() => { if (!bulutAktif) localStorage.setItem(USER, JSON.stringify(kullanici)); }, [kullanici, bulutAktif]);
  useEffect(() => { if (!supabaseHazir) localStorage.setItem(REZ, JSON.stringify(rezervasyonlar)); }, [rezervasyonlar]);
  useEffect(() => localStorage.setItem(YORUMLAR, JSON.stringify(yorumlar)), [yorumlar]);

  const git = (path) => {
    history.pushState({}, "", path);
    setYol(path);
    scrollTo({ top: 0, behavior: "smooth" });
  };

  const favoriDegistir = (id) => {
    setFavoriler((favoriler) =>
      favoriler.includes(id)
        ? favoriler.filter((favoriId) => favoriId !== id)
        : [...favoriler, id],
    );
  };

  const kayitOl = async (yeniKullanici) => {
    const ad = String(yeniKullanici.ad || "").trim();
    const kullaniciAdi = String(yeniKullanici.kullaniciAdi || "").trim().toLowerCase();
    const sifre = String(yeniKullanici.sifre || "");
    if (ad.length < 2 || ad.length > 100 || !kullaniciAdiKontrol(kullaniciAdi) || sifre.length < 8) {
      return { basarili:false, mesaj:"Adınızı, 3-24 karakterlik kullanıcı adını (a-z, 0-9, _) ve en az 8 karakterlik şifrenizi kontrol edin." };
    }
    if (supabaseHazir) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: dahiliEmail(kullaniciAdi), password: sifre,
          options: { data: { ad, kullaniciAdi } }
        });
        if (error) throw error;
        if (!data?.session) return { basarili:false, mesaj:"Hesap açıldı ancak oturum oluşturulamadı. Supabase Authentication → Email ayarından Confirm Email seçeneğini kapatın ve tekrar giriş yapın." };
        setKullanici({id:data.user.id,ad,kullaniciAdi,rol:"kullanici"});
        return {basarili:true,rol:"kullanici"};
      } catch(error) { return {basarili:false,mesaj:error?.message || "Kayıt başarısız."}; }
    }
    return {basarili:false,mesaj:"Kullanıcı adıyla güvenli kayıt için Supabase bağlantısı gereklidir."};
  };

  const girisYap = async (kimlik, sifre) => {
    if (supabaseHazir) {
      const girisKimligi = String(kimlik || "").trim().toLowerCase();
      const temizEmail = girisKimligi.includes("@") ? girisKimligi : (kullaniciAdiKontrol(girisKimligi) ? dahiliEmail(girisKimligi) : "");
      const temizSifre = String(sifre || "");

      if (!temizEmail || !temizSifre) {
        return { basarili: false, mesaj: "Lütfen kullanıcı adınızı (admin için e-posta) ve şifrenizi girin." };
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: temizEmail,
          password: temizSifre,
        });

        if (error) {
          console.error("Supabase giriş hatası:", error);
          return { basarili: false, mesaj: error.message };
        }

        if (!data?.user) {
          return { basarili: false, mesaj: "Oturum açılamadı. Lütfen tekrar deneyin." };
        }

        const { data: admin, error: rolHata } = await supabase
          .from("site_admins")
          .select("user_id")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (rolHata) {
          console.error("Supabase yetki kontrolü hatası:", rolHata);
          return { basarili: false, mesaj: "Yetki kontrolü yapılamadı: " + rolHata.message };
        }

        const rol = admin ? "admin" : "kullanici";
        setKullanici({
          id: data.user.id,
          email: data.user.email,
          ad: data.user.user_metadata?.ad || data.user.email?.split("@")[0] || "Müşteri",
          kullaniciAdi: data.user.user_metadata?.kullaniciAdi || null,
          rol,
        });
        return { basarili: true, rol };
      } catch (error) {
        console.error("Supabase bağlantı hatası:", error);
        return {
          basarili: false,
          mesaj: "Bağlantı hatası: " + (error?.message || "Supabase sunucusuna ulaşılamadı."),
        };
      }
    }
    return {basarili:false,mesaj:"Güvenli giriş için Supabase bağlantısı gereklidir."};
  };

  const cikisYap = () => {
    if (supabaseHazir) supabase.auth.signOut();
    setKullanici(null);
    git("/");
  };

  const aracKaydet = (arac) => filoBulutaKaydet(liste => {
    const varMi = liste.some(item => item.id === arac.id);
    return varMi ? liste.map(item => item.id === arac.id ? arac : item) : [arac, ...liste];
  });

  const aracSil = (id) => {
    filoBulutaKaydet(liste => liste.filter(arac => arac.id !== id));
    setFavoriler(liste => liste.filter(aracId => aracId !== id));
  };

  const aracDurumDegistir = (id, durum) => filoBulutaKaydet(liste =>
    liste.map(arac => arac.id === id ? { ...arac, durum } : arac)
  );

  const rezervasyonEkle = async (rezervasyon) => {
    if (!supabaseHazir) {
      setRezervasyonlar(liste => [rezervasyon, ...liste]);
      return {basarili:true};
    }
    try {
      const {data, error} = await supabase.rpc("rezervasyon_olustur", {p_veri: rezervasyon});
      if (error) throw error;
      const {data:takvim} = await supabase.rpc("rezervasyon_dolu_tarihler");
      if (takvim) setDoluTarihler(takvim);
      const {data:sessionData} = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        const {data:items} = await supabase.from("site_rezervasyonlar")
          .select("id,kullanici_id,created_at,durum,veri").order("created_at",{ascending:false});
        if (items) setRezervasyonlar(items.map(r=>({...r.veri,id:r.id,kullaniciId:r.kullanici_id,tarih:r.created_at,durum:r.durum})));
      }
      return {basarili:true, id:data};
    } catch (error) {
      setBulutHata("Rezervasyon kaydedilemedi: " + error.message);
      return {basarili:false,mesaj:error.message};
    }
  };

  const rezervasyonDurumDegistir = async (id, durum) => {
    if (supabaseHazir) {
      const {error} = await supabase.rpc("rezervasyon_durum_guncelle", {p_id:id,p_durum:durum});
      if (error) return setBulutHata("Durum güncellenemedi: " + error.message);
    }
    setRezervasyonlar(liste => liste.map(r => r.id===id ? {...r,durum} : r));
    if (supabaseHazir) {
      const {data} = await supabase.rpc("rezervasyon_dolu_tarihler");
      if (data) setDoluTarihler(data);
    }
  };

  const rezervasyonSil = async (id) => {
    if (supabaseHazir) {
      const {error} = await supabase.rpc("rezervasyon_sil", {p_id:id});
      if (error) return setBulutHata("Rezervasyon silinemedi: " + error.message);
    }
    setRezervasyonlar(liste => liste.filter(r => r.id !== id));
    if (supabaseHazir) {
      const {data} = await supabase.rpc("rezervasyon_dolu_tarihler");
      if (data) setDoluTarihler(data);
    }
  };

  if (splashGoster || !bulutHazir || (bulutAktif && !authHazir)) {
    return <SplashScreen onTamamla={() => setSplashGoster(false)} />;
  }

  const ortak = {
    git,
    araclar,
    favoriler,
    favoriDegistir,
    kullanici,
    cikisYap,
  };

  if (yol === "/araclar") return <Araclar {...ortak} />;
  if (yol === "/hakkimizda") return <Hakkimizda {...ortak} />;
  if (yol === "/hizmetler") return <Hizmetler {...ortak} />;
  if (yol === "/iletisim") return <Iletisim {...ortak} />;
  if (yol === "/kampanyalar") return <Kampanyalar {...ortak} />;
  if (yol === "/sss") return <SSS {...ortak} />;
  if (yol === "/giris") {
    return <Giris git={git} girisYap={girisYap} kullanici={kullanici} bulutAktif={bulutAktif} />;
  }
  if (yol === "/kayit") return <Kayit git={git} kayitOl={kayitOl} />;
  if (yol === "/favoriler") return <Favoriler {...ortak} />;
  if (yol === "/bildirimler") return <Bildirimler {...ortak} rezervasyonlar={rezervasyonlar} />;
  if (yol === "/rezervasyonlarim") {
    if (!kullanici) return <Giris git={git} girisYap={girisYap} kullanici={kullanici} bulutAktif={bulutAktif} />;
    return <Hesabim {...ortak} rezervasyonlar={rezervasyonlar} />;
  }
  if (yol === "/hesabim") {
    return (
      <Hesabim
        {...ortak}
        rezervasyonlar={rezervasyonlar}
      />
    );
  }
  if (yol === "/admin") {
    return (
      <Admin
        git={git}
        araclar={araclar}
        bulutAktif={bulutAktif}
        bulutHata={bulutHata}
        rezervasyonlar={rezervasyonlar}
        kullanici={kullanici}
        cikisYap={cikisYap}
        aracKaydet={aracKaydet}
        aracSil={aracSil}
        aracDurumDegistir={aracDurumDegistir}
        rezervasyonDurumDegistir={rezervasyonDurumDegistir}
        rezervasyonSil={rezervasyonSil}
      />
    );
  }

  if (yol.startsWith("/arac/")) {
    const id = yol.split("/")[2];
    return (
      <AracDetay
        git={git}
        arac={araclar.find((arac) => arac.id === id)}
        favoriMi={favoriler.includes(id)}
        favoriDegistir={favoriDegistir}
        kullanici={kullanici}
        cikisYap={cikisYap}
        yorumlar={yorumlar.filter((yorum) => yorum.aracId === id)}
        yorumEkle={(yorum) => setYorumlar((liste) => [yorum, ...liste])}
      />
    );
  }

  if (yol.startsWith("/rezervasyon/")) {
    const id = yol.split("/")[2];
    return (
      <Rezervasyon
        git={git}
        arac={araclar.find((arac) => arac.id === id)}
        rezervasyonEkle={rezervasyonEkle}
        kullanici={kullanici}
        cikisYap={cikisYap}
        rezervasyonlar={supabaseHazir ? doluTarihler : rezervasyonlar}
      />
    );
  }

  return <Anasayfa {...ortak} />;
}

export default App;
