# Supabase ile canlı araç kiralama sistemi

## 1. Supabase projesi

1. https://supabase.com/dashboard adresinde yeni bir proje oluşturun.
2. **SQL Editor** bölümüne girin. `supabase/kurulum.sql` dosyasının içeriğini yapıştırın ve **Run** deyin.
3. **Project Settings > API** (veya **Connect**) bölümünden **Project URL** ve **publishable/anon key** bilgilerini alın.
4. `.env.example` dosyasını `.env` olarak kopyalayın ve iki değeri doldurun. **service_role veya secret key koymayın.**
5. PowerShell'de: `npm install` ardından `npm run dev`.

## 2. Admin hesabını tanımlama

1. Supabase **Authentication > Users > Add user** ile kendi e-posta/şifrenizle admin kullanıcısını oluşturun (veya normal kayıt olun).
2. Authentication > Users bölümündeki **User UID** değerini kopyalayın.
3. SQL Editor'de şu sorguyu kendi UID'nizle çalıştırın:

```sql
insert into public.site_admins(user_id)
values ('ADMIN_KULLANICI_UUID_BURAYA')
on conflict do nothing;
```

4. Sitede giriş yapın; admin hesabıyla `/admin` yolundan araç ekleyin, düzenleyin ve silin.
5. Başka bir tarayıcıdan `/araclar` sayfasını açıp değişikliklerin yansıdığını kontrol edin.

**Önemli:** Admin yetkisi tarayıcıdan değiştirilemez. `site_admins` tablosuna yalnızca yetkili sunucu / Supabase SQL Editor müdahale edebilir. `site_filo` okuma herkese açık; yazma `filo_guncelle` aracılığıyla sadece admin kimliğine izin verir.

## 3. E-posta ile kayıt

Supabase **Authentication > Providers > Email** kısmında Email etkin olmalıdır. E-posta doğrulaması açıksa yeni kullanıcı gelen kutusundaki linki onayladıktan sonra giriş yapabilir. Yayına çıkmadan önce **Authentication > URL Configuration** kısmından Site URL ve redirect URL'lerinizi kendi domaininize göre ayarlayın. Oturumlar Supabase Auth ile saklanır.

## 4. Araç fotoğrafları

Mevcut araç formundaki URL/yerel görsel işleyişi korunmuştur. Üretimde fotoğraflar için Supabase Storage kullanılması önerilir; özellikle Base64 görselleri veritabanına büyük boyutta kaydetmeyin. Bu sürüm Supabase Storage yükleme sistemi eklemiyor.

## 5. Notlar

- `.env` olmadan proje yalnızca yerel demo olarak açılır; veriler diğer tarayıcılara gitmez. Demo kullanıcıları ve şifreleri yalnızca tarayıcıda tutulduğundan **demo modunu internete açık canlı uygulama olarak yayınlamayın**.
- Rezervasyonlar, yorumlar ve favoriler bu sürümde hâlâ tarayıcıya özeldir; canlı araç listesi ve kullanıcı kimlik doğrulama Supabase'e geçmiştir.
- Birden fazla yönetici aynı anda araç listesini güncellerse son yazan geçerli olur; üretim ortamında sürümlü/tekil araç satırlarına geçilebilir.
- `.env` ortam değişkenleri değişince Vite sunucusunu yeniden başlatın.
