import { Bell, CheckCircle2, Info } from "lucide-react";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useBildirimler from "../hooks/useBildirimler";

export default function Bildirimler({git,kullanici,cikisYap}) {
  const {bildirimler,okunduIsaretle}=useBildirimler(kullanici);
  useEffect(()=>{if (kullanici?.rol === "kullanici") okunduIsaretle();},[kullanici?.id]);
  if(!kullanici || kullanici.rol !== "kullanici") {
    return <div className="min-h-screen bg-asfalt pt-40 text-center text-white">Bildirimleri görmek için <button className="text-amber underline" onClick={()=>git('/giris')}>giriş yapın</button>.</div>;
  }
  return <div className="min-h-screen bg-asfalt">
    <Navbar git={git} kullanici={kullanici} cikisYap={cikisYap}/>
    <main className="mx-auto max-w-5xl px-4 pb-20 pt-36 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[.22em] text-amber">Müşteri Hesabı</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold text-white">Bildirimler</h1>
      <p className="mt-3 text-metinSoft">Rezervasyon talepleriniz, onaylarınız ve iptalleriniz burada görünür.</p>
      <div className="mt-10 space-y-4">
        {bildirimler.map(b=><article key={b.id} className="flex gap-4 rounded-2xl border border-white/10 bg-panel p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber">{b.baslik.includes('onaylandı')?<CheckCircle2 size={21}/>:<Bell size={21}/>}</span>
          <div className="min-w-0"><h2 className="font-bold text-white">{b.baslik}</h2>
            <p className="mt-2 text-sm leading-6 text-metinSoft">{b.mesaj}</p>
            <p className="mt-2 text-xs text-metinSoft">{new Date(b.created_at).toLocaleString('tr-TR')} • Okundu</p>
          </div></article>)}
        {!bildirimler.length && <div className="rounded-2xl border border-white/10 bg-panel p-10 text-center text-metinSoft"><Info className="mx-auto mb-3 text-amber"/>Henüz bildiriminiz yok.</div>}
      </div>
    </main><Footer git={git}/>
  </div>;
}
