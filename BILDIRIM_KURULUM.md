# Bildirim sistemi kurulumu

1. Mevcut Supabase projenizde **SQL Editor > New query** açın.
2. `supabase/bildirim_kurulum.sql` içeriğini çalıştırın. Daha önce oluşturulan rezervasyon ve araç verilerini silmez.
3. Mevcut `.env` dosyanızı koruyun, yeni projede `npm install` ve `npm run dev` çalıştırın.
4. Müşteri hesabıyla bir rezervasyon oluşturun: yeni bildirim gelmeli. Zile basınca sayı hemen sıfırlanmalı ve bildirim listede kalmalı.
5. Admin hesabıyla rezervasyonu onaylayın: müşteride yeni onay bildirimi oluşmalı. İptal için de test edin.
6. Bildirimleri site içinden görebilmek için oturum açık olmalıdır. Yeni mesajın sayaca yansıması canlı abonelik yanında 20 saniyelik yedek yenilemeyle de desteklenir.

**Notlar:** `Rezervasyonlarım` üst menüde yer alır ve `Hesabım` sayfasındaki rezervasyon listesine gider. Henüz hiç rezervasyonu olmayan müşterinin listesi boş olabilir. `Confirm email` ayarının kapalı olması gerçek e-postaya ihtiyaç duymayan mevcut müşteri hesabı yönteminden kaynaklanmaktadır; üretime çıkmadan hesap kurtarma ve suistimal kontrollerini değerlendirin.
