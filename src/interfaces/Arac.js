/**
 * Proje JavaScript ile geliştirildiği için TypeScript "interface" yerine
 * JSDoc @typedef kullanılarak veri modeli tanımlanmıştır.
 *
 * @typedef {Object} Arac
 * @property {string} id - Aracın benzersiz kimliği
 * @property {string} marka - Örn: "Volkswagen"
 * @property {string} model - Örn: "Golf"
 * @property {number} yil - Model yılı
 * @property {string} plaka - Örn: "34 ABC 123"
 * @property {"Ekonomi"|"Orta Sınıf"|"SUV"|"Lüks"} sinif - Araç sınıfı
 * @property {number} gunlukFiyat - TL cinsinden günlük kiralama fiyatı
 * @property {"musait"|"kirada"|"bakimda"} durum - Aracın güncel durumu
 * @property {string} resimUrl - Araç görseli (url)
 */

export const bosArac = {
  id: "",
  marka: "",
  model: "",
  yil: new Date().getFullYear(),
  plaka: "",
  sinif: "Ekonomi",
  gunlukFiyat: 0,
  durum: "musait",
  resimUrl: "",
};

export const DURUM_ETIKETLERI = {
  musait: "Müsait",
  kirada: "Kirada",
  bakimda: "Bakımda",
};
