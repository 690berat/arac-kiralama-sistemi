import { CarFront, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer id="iletisim" className="mt-20 border-t border-kenar bg-[#101217]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber"><CarFront size={21} className="text-asfalt" /></span><span className="font-display text-xl font-extrabold">Rent<span className="text-amber">Car</span></span></div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-metinSoft">Güvenli, konforlu ve avantajlı araç kiralama deneyimi.</p>
        </div>
        <div><h3 className="font-display font-bold">Hızlı Bağlantılar</h3><div className="mt-4 flex flex-col gap-3 text-sm text-metinSoft"><a href="/" className="hover:text-amber">Ana Sayfa</a><a href="/araclar" className="hover:text-amber">Araçlar</a><a href="/#neden-biz" className="hover:text-amber">Hizmetler</a></div></div>
        <div><h3 className="font-display font-bold">Araç Grupları</h3><div className="mt-4 flex flex-col gap-3 text-sm text-metinSoft"><span>Ekonomi</span><span>SUV</span><span>Lüks Araçlar</span></div></div>
        <div><h3 className="font-display font-bold">İletişim</h3><div className="mt-4 space-y-3 text-sm text-metinSoft"><p className="flex gap-2"><Phone size={16} className="text-amber" />0 (850) 123 45 67</p><p className="flex gap-2"><Mail size={16} className="text-amber" />info@rentcar.com</p><p className="flex gap-2"><MapPin size={16} className="text-amber" />İstanbul, Türkiye</p></div></div>
      </div>
      <div className="border-t border-kenar"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-metinSoft sm:flex-row lg:px-8"><p>© 2026 RentCar. Tüm hakları saklıdır.</p><p className="flex items-center gap-1.5">Tasarlayan ve geliştiren <span className="font-semibold text-amber">Eyyüp Berat Kolsuzoğlu</span></p></div></div>
    </footer>
  );
}
