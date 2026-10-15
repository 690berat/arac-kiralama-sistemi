# FiloTak — Araç Kiralama Yönetim Paneli

Web Geliştirme / Yapay Zeka eğitim programı bitirme projesidir. **React (Vite) + Tailwind CSS + localStorage** kullanılarak geliştirilmiştir.

## Konsept

Kurumsal bir araç kiralama şirketi için hem tanıtım (landing) hem de filo yönetim paneli içeren tek sayfalık bir site. Otomotiv temalı görsel kimlik: koyu asfalt arka plan, amber vurgu rengi, plaka rozeti tasarımı, durum etiketleri (Müsait / Kirada / Bakımda) ve `framer-motion` ile zenginleştirilmiş animasyonlar.

## Sayfa Bölümleri

- **Navbar:** Scroll ile saydamdan opak arka plana geçen sabit üst menü.
- **Hero:** Kademeli (staggered) beliren başlık, sayaç animasyonlu istatistikler (araç/şehir/puan), yumuşak hareket eden arka plan lekeleri.
- **Neden FiloTak:** Scroll'da içeri kayan 4 özellik kartı (sigorta, anlık takip, şehirler arası teslim, şeffaf fiyat).
- **Filo Yönetimi (#filo):** CRUD panelinin bulunduğu bölüm — asıl uygulama mantığı burada.
- **Footer:** Sade kurumsal alt bilgi.

## Özellikler (CRUD)

- **Ekle:** Formdan marka, model, yıl, plaka, sınıf, günlük fiyat ve görsel girilerek filoya yeni araç eklenir.
- **Listele:** Tüm araçlar kart grid'inde listelenir; durum filtreleri (Hepsi/Müsait/Kirada/Bakımda) ve marka-model-plaka araması yapılabilir. Üstte canlı istatistik rozetleri (toplam/müsait/kirada/bakımda) gösterilir.
- **Güncelle:** "Düzenle" butonuyla araç bilgileri değiştirilebilir; kart üzerindeki açılır menüden durum anında güncellenir.
- **Sil:** "Sil" butonuyla araç filodan kalıcı olarak çıkarılır.

Tüm veriler tarayıcının **localStorage**'ında saklanır; sayfa yenilense de kaybolmaz. İlk açılışta örnek 3 araçla gelir.

## Klasör Yapısı

```
src/
  components/   -> Navbar, Hero, Ozellikler, Footer, AracForm, AracKarti, AracListesi
  pages/        -> Anasayfa (landing + dashboard, filtreler, istatistikler)
  interfaces/   -> Arac.js (JSDoc ile tanımlanmış veri modeli)
  App.jsx       -> localStorage bağlantısı ve CRUD state mantığı
  main.jsx      -> React giriş noktası
```

## Kurulum ve Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini açın.

## Production Build

```bash
npm run build
npm run preview
```

## Netlify ile Yayına Alma

1. Bu klasörü GitHub'a push edin.
2. [Netlify](https://app.netlify.com) üzerinde "Add new site" > "Import an existing project" seçin.
3. GitHub reposunu bağlayın.
4. Build command: `npm run build`, Publish directory: `dist` (proje kökündeki `netlify.toml` bunu otomatik ayarlar).
5. Deploy'a basın.

## Kullanılan Teknolojiler

- React 18 (Vite)
- Tailwind CSS 3
- Framer Motion (animasyonlar)
- Lucide React (ikonlar)
- Browser localStorage API
- Rajdhani + Inter (Google Fonts)

## Son eklenen gelişmiş özellikler
- Çakışan tarihler için araç müsaitlik kontrolü
- Demo kredi kartı ödeme ekranı (gerçek ücret çekmez)
- Müşteri yorum ve 5 yıldız puanlama sistemi
- Hesabım sayfasından yazdırılabilir/PDF olarak kaydedilebilir kiralama sözleşmesi
- Admin panelinde rezervasyon ve filo durum grafikleri
- İkonlu form alanlarında yazı çakışması düzeltmesi

## Firebase notu
Proje varsayılan olarak localStorage ile çalışır. Gerçek Firebase Authentication/Firestore için
`src/firebaseConfig.example.js` dosyasındaki örneği kendi Firebase bilgilerinizle yapılandırmanız gerekir.
Güvenli JWT sistemi için ayrıca bir backend sunucusu gerekir; yalnızca frontend içinde gizli anahtar tutulmamalıdır.


## Supabase (güncel)

Firebase yerine Supabase entegrasyonu kullanılır. Adım adım talimatlar için [KURULUM_SUPABASE.md](KURULUM_SUPABASE.md) dosyasını açın. Yukarıdaki eski Firebase açıklamaları geçerli değildir.
