# RentCar – Kullanıcı adıyla giriş ve Supabase rezervasyon kurulumu

## Önemli
Bu sürüm, müşteriden gerçek e-posta istemeden kullanıcı adı + şifreyle kayıt yapar. Müşteri kullanıcı adı dahili olarak `kullaniciadi@users.rentcar.example.com` kimliğine dönüştürülür; parolalar uygulamanın tablosunda değil Supabase Auth'ta tutulur. Bu adres gerçek e-posta değildir ve posta gönderimi/kurtarma için kullanılmaz.

**Bu yöntem demo/MVP yaklaşımıdır.** Supabase Auth yönetiminde e-posta doğrulamasını kapatmak gerekir; e-posta ile şifre sıfırlama kullanılamaz. Canlı ticari kullanımdan önce doğrulanmış iletişim kanalıyla hesap kurtarma, bot/kötüye kullanım önlemleri ve uyumlu kimlik mekanizması tasarlanmalıdır. Yönetici, Supabase'de açtığı gerçek e-posta hesabıyla eski usulde giriş yapmaya devam eder.

## 1. Supabase
1. `arac-kiralama` Supabase projesine gir.
2. Authentication → Providers → Email menüsünde **Confirm email** özelliğini **kapat**; bu, e-postasız sentetik hesapların oturum açabilmesi içindir. Mevcut admin hesabı korunur. Kullanıcıların başkasının e-posta adresiyle hesap açmasını kısıtlamak istersen gelecekte ayrı backend/Edge Function akışı kur.
3. SQL Editor → New query ekranında `supabase/rezervasyon_kurulum.sql` dosyasını çalıştır. Önceki `site_filo` ve `site_admins` tablolarını silmez. Aynı SQL daha önce çalıştırılmışsa yeni fonksiyon tanımı için tekrar çalıştırabilirsin.
4. Kayıt yaptığında yeni kullanıcı Authentication → Users listesinde görünür. Dahili e-posta adresi kullanıcı adından türetilir. Admin yetkileri `site_admins` ile belirlenir.

## 2. Yerel proje
1. Mevcut `.env` dosyanı yedekle. ZIP içinde gerçek `.env` **bilerek yoktur**. `.env.example` üzerinden yenisini oluştur veya var olan `.env` dosyanı koru.
2. `VITE_SUPABASE_URL=https://GERCEK_ID.supabase.co` ve `VITE_SUPABASE_ANON_KEY=sb_publishable_...` alanlarını doldur. URL sonuna `/rest/v1` ekleme.
3. PowerShell: `npm install` ve `npm run dev`.
4. Kayıt ekranında `berat123` benzeri kullanıcı adı ve yeni şifreyle hesap aç, çıkış yapıp aynı kullanıcı adıyla tekrar giriş yap.
5. Araç seç → rezervasyon formu → telefon/tarih gir → gönder. E-posta isteğe bağlı. Admin hesabında Rezervasyonlar bölümünden talebi kontrol et.
6. Test için aynı araç/tarihlere ikinci rezervasyon oluşturmayı dene; sunucu işlemi engellemelidir.

## 3. Netlify
Yeni kodu mevcut GitHub reposuna gönderirken `.env` dosyasını commit etme. Netlify'da `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` gerçek değerlerle tanımlı olmalı. Build/deploy sonrası e-posta doğrulama ayarının bu Supabase projesine ait olduğundan emin ol. Eski `arac-kiralama2` klasörünü sakla.

## Sınırlar
- Kart seçeneği bir ödeme simülasyonudur; gerçek ödeme ve kart numarası kaydı yoktur.
- Rezervasyon oluşturmak için müşteri girişi gerekir. Filo ziyaretçilere açıktır.
- Gerçek e-posta kullanılmadığı için şifre sıfırlama e-postası alınamaz. Kullanıcıya bu durum kayıt ekranında da bildirilir.
- Canlı veritabanına burada erişilemediği için uçtan uca test yapılmadı. Dosyaların JSX sözdizimi denetlendi. Windows node_modules içermez; kendi bilgisayarında `npm install` yap.
