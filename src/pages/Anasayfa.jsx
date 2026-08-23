import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Ozellikler from "../components/Ozellikler";
import Footer from "../components/Footer";
import AracKarti from "../components/AracKarti";

export default function Anasayfa({ araclar, git, favoriler = [], favoriDegistir, kullanici, cikisYap }) {
  const oneCikanlar = araclar.slice(0, 3);
  return <div className="min-h-screen overflow-hidden bg-asfalt">
    <Navbar git={git} kullanici={kullanici} cikisYap={cikisYap} />
    <Hero git={git} />
    {kullanici?.rol === "kullanici" && (
      <section className="relative z-20 -mt-3 px-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-2xl border border-amber/20 bg-panel/95 px-5 py-4 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold text-white">Hoş geldin, {kullanici.ad} 👋</p>
            <p className="mt-1 text-xs text-metinSoft">Sana uygun araçları keşfetmeye devam edebilir, rezervasyonlarını hesabından takip edebilirsin.</p>
          </div>
          <button onClick={() => git("/hesabim")} className="shrink-0 rounded-xl border border-amber/30 px-4 py-2 text-xs font-bold text-amber transition hover:bg-amber hover:text-asfalt">Hesabıma Git</button>
        </div>
      </section>
    )}
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[.24em] text-amber">Öne Çıkan Araçlar</p><h2 className="mt-3 font-display text-4xl font-extrabold text-metin sm:text-5xl">Yolculuğunuza hazır araçlar</h2><p className="mt-3 max-w-2xl text-metinSoft">En çok tercih edilen araçlarımızdan sizin için seçtiğimiz modeller.</p></div>
          <a href="/araclar" onClick={(e)=>{e.preventDefault();git("/araclar")}} className="group inline-flex items-center gap-2 font-bold text-amber">Tüm Araçları Gör <ArrowRight size={18} className="transition group-hover:translate-x-1" /></a>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{oneCikanlar.map((a)=><AracKarti key={a.id} arac={a} yonetim={false} git={git} favoriMi={favoriler.includes(a.id)} favoriDegistir={favoriDegistir} />)}</div>
      </div>
    </section>
    <Ozellikler />
    <section className="py-20"><div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[.24em] text-amber">RentCar Hakkında</p><h2 className="mt-3 font-display text-4xl font-extrabold text-metin">Sadece araç değil, güvenli bir yolculuk sunuyoruz</h2><p className="mt-5 leading-7 text-metinSoft">Modern filomuz, şeffaf fiyat politikamız ve kesintisiz desteğimizle kiralama sürecini kolaylaştırıyoruz.</p><a href="/hakkimizda" onClick={(e)=>{e.preventDefault();git("/hakkimizda")}} className="mt-7 inline-flex rounded-xl border border-amber/40 px-5 py-3 font-bold text-amber hover:bg-amber hover:text-asfalt">Bizi Daha Yakından Tanıyın</a></div><img className="h-[360px] w-full rounded-[28px] object-cover" src="https://images.unsplash.com/photo-1493238792000-8113da705763?q=85&w=1200&auto=format&fit=crop" alt="RentCar araç filosu" /></div></section>
    <Footer git={git} />
  </div>;
}
