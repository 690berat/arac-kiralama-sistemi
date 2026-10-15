# Supabase Rezervasyon Entegrasyonu

Bu sürüm, çalışan `site_filo` ve `site_admins` tablolarını değiştirmeden rezervasyonları Supabase'e taşır.

## Adım 1 — SQL
Supabase Dashboard → `arac-kiralama` → SQL Editor → New query.
`supabase/rezervasyon_kurulum.sql` içeriğinin tamamını yapıştırıp Run çalıştır.
**Önceden çalıştırdığın `supabase/kurulum.sql` dosyasını tekrar çalıştırmana gerek yok.**

## Adım 2 — Kod
ZIP'teki `arac-kiralama` klasöründe `src/App.jsx` ve `src/pages/Rezervasyon.jsx` güncellendi.
Mevcut `.env` dosyanı sakla; ZIP'te gerçek API anahtarı bulunmuyor.
`VITE_SUPABASE_URL` kök proje adresi olmalı; `/rest/v1/` ekleme.

## Adım 3 — Yerel test
```
npm install
npm run dev
```
1. Normal veya gizli sekmede bir araç seçip **Nakit** ödeme tercihiyle talep oluştur.
2. Admin hesabıyla başka sekmede oturum aç; **Rezervasyonlar** ekranından kaydı gör.
3. `Bekliyor` → `Onaylandı` gibi bir durum değiştir; hesaptaki güncellemeyi kontrol et.
4. Aynı araç ve aynı tarih aralığı için ikinci rezervasyon dene; sunucu çakışmayı engeller.
5. Supabase Table Editor'de `site_rezervasyonlar` tablosunu kontrol et.

## Güvenlik ve işleyiş
- Ziyaretçi, kimlik doğrulamadan rezervasyon talebinde bulunabilir; kayıt admin panelinde görünür.
- Hesabına giriş yapan müşteri yalnızca **kendi oturumuyla oluşturduğu** rezervasyonları görür. Misafir rezervasyonları hesapla otomatik eşleştirilmez; admin görür.
- Diğer ziyaretçiler müşteri adı/telefon/e-posta bilgilerine erişemez. Tarih müsaitliği ayrı, kişisel bilgi içermeyen RPC üzerinden gösterilir.
- Supabase sunucusu araç fiyatını yeniden hesaplar ve tarih çakışmasını denetler.
- **Kartla ödeme yalnızca demo tercihtir; gerçek para tahsil edilmez. Kart numarası veya CVV toplanmaz.** Gerçek kart tahsilatı için lisanslı ödeme sağlayıcısı gerekir.
- Üretimde anonim taleplere CAPTCHA / rate limiting ve KVKK aydınlatma/izin akışları eklenmelidir. Bu sürümde bunlar yoktur.
- Önce yerelde test et; Netlify'a kodları yayınlamak için mevcut GitHub depona git push yap ve Netlify build'i kontrol et.

## Sorun olursa
`function public.rezervasyon_olustur does not exist` → SQL dosyası çalıştırılmamış.
`permission denied` → SQL yetkilerini ve Supabase Authentication'daki admin `site_admins` kaydını kontrol et.
`Failed to fetch` → `.env` içindeki Project URL'nin gerçek ve `/rest/v1/` olmadan yazıldığını kontrol et.
