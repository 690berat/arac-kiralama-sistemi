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

const FILO = "arac-kiralama-filosu";
const FAV = "rentcar-favoriler";
const USERS = "rentcar-kullanicilar";
const USER = "rentcar-aktif-kullanici";
const REZ = "rentcar-rezervasyonlar";
const YORUMLAR = "rentcar-yorumlar";

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
  const [splashGoster, setSplashGoster] = useState(true);
  const [yol, setYol] = useState(location.pathname);
  const [araclar, setAraclar] = useState(() => oku(FILO, ORNEK_FILO));
  const [favoriler, setFavoriler] = useState(() => oku(FAV, []));
  const [kullanici, setKullanici] = useState(() => oku(USER, null));
  const [rezervasyonlar, setRezervasyonlar] = useState(() => oku(REZ, []));
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

  useEffect(() => localStorage.setItem(FILO, JSON.stringify(araclar)), [araclar]);
  useEffect(() => localStorage.setItem(FAV, JSON.stringify(favoriler)), [favoriler]);
  useEffect(() => localStorage.setItem(USER, JSON.stringify(kullanici)), [kullanici]);
  useEffect(
    () => localStorage.setItem(REZ, JSON.stringify(rezervasyonlar)),
    [rezervasyonlar],
  );
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

  const kayitOl = (yeniKullanici) => {
    const ad = String(yeniKullanici.ad || "").trim();
    const email = String(yeniKullanici.email || "").trim().toLowerCase();
    const sifre = String(yeniKullanici.sifre || "");

    if (!ad || !email || sifre.length < 6 || email === ADMIN_HESABI.email) {
      return { basarili: false, mesaj: "Bilgileri kontrol ederek tekrar deneyin." };
    }

    const kullanicilar = oku(USERS, []);
    const emailKayitli = kullanicilar.some(
      (kisi) => String(kisi.email || "").trim().toLowerCase() === email,
    );

    if (emailKayitli) {
      return { basarili: false, mesaj: "Bu e-posta adresiyle daha önce hesap oluşturulmuş." };
    }

    const kayit = {
      id: crypto.randomUUID(),
      ad,
      email,
      sifre,
      rol: "kullanici",
      kayitTarihi: new Date().toISOString(),
    };

    localStorage.setItem(USERS, JSON.stringify([...kullanicilar, kayit]));
    setKullanici({ id: kayit.id, ad, email, rol: "kullanici" });
    return { basarili: true, rol: "kullanici" };
  };

  const girisYap = (email, sifre) => {
    const temizEmail = String(email || "").trim().toLowerCase();
    const temizSifre = String(sifre || "");

    if (temizEmail === ADMIN_HESABI.email && temizSifre === ADMIN_HESABI.sifre) {
      const admin = {
        ad: ADMIN_HESABI.ad,
        email: ADMIN_HESABI.email,
        rol: "admin",
      };
      setKullanici(admin);
      return { basarili: true, rol: "admin" };
    }

    const bulunanKullanici = oku(USERS, []).find((kisi) => {
      const kayitliEmail = String(kisi.email || "").trim().toLowerCase();
      const kayitliSifre = String(kisi.sifre ?? kisi.password ?? "");
      return kayitliEmail === temizEmail && kayitliSifre === temizSifre;
    });

    if (!bulunanKullanici) {
      return { basarili: false, rol: null };
    }

    setKullanici({
      id: bulunanKullanici.id,
      ad: bulunanKullanici.ad || bulunanKullanici.adSoyad || "Müşteri",
      email: String(bulunanKullanici.email).trim().toLowerCase(),
      rol: "kullanici",
    });
    return { basarili: true, rol: "kullanici" };
  };

  const cikisYap = () => {
    setKullanici(null);
    git("/");
  };

  const aracKaydet = (arac) => {
    setAraclar((liste) => {
      const varMi = liste.some((item) => item.id === arac.id);
      return varMi
        ? liste.map((item) => (item.id === arac.id ? arac : item))
        : [arac, ...liste];
    });
  };

  const aracSil = (id) => {
    setAraclar((liste) => liste.filter((arac) => arac.id !== id));
    setFavoriler((liste) => liste.filter((aracId) => aracId !== id));
  };

  const aracDurumDegistir = (id, durum) => {
    setAraclar((liste) =>
      liste.map((arac) => (arac.id === id ? { ...arac, durum } : arac)),
    );
  };

  const rezervasyonDurumDegistir = (id, durum) => {
    setRezervasyonlar((liste) =>
      liste.map((rezervasyon) =>
        rezervasyon.id === id ? { ...rezervasyon, durum } : rezervasyon,
      ),
    );
  };

  const rezervasyonSil = (id) => {
    setRezervasyonlar((liste) => liste.filter((rezervasyon) => rezervasyon.id !== id));
  };

  if (splashGoster) {
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
    return <Giris git={git} girisYap={girisYap} kullanici={kullanici} />;
  }
  if (yol === "/kayit") return <Kayit git={git} kayitOl={kayitOl} />;
  if (yol === "/favoriler") return <Favoriler {...ortak} />;
  if (yol === "/bildirimler") return <Bildirimler {...ortak} rezervasyonlar={rezervasyonlar} />;
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
        rezervasyonEkle={(rezervasyon) =>
          setRezervasyonlar((liste) => [rezervasyon, ...liste])
        }
        kullanici={kullanici}
        cikisYap={cikisYap}
        rezervasyonlar={rezervasyonlar}
      />
    );
  }

  return <Anasayfa {...ortak} />;
}

export default App;
