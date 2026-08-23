import { motion } from "framer-motion";
import { BadgeCheck, Clock3, MapPinned, WalletCards } from "lucide-react";

const ozellikler = [
  { icon: BadgeCheck, title: "Tam Güvence", text: "Bakımlı ve sigortalı araçlarla güvenli yolculuk." },
  { icon: WalletCards, title: "Şeffaf Fiyat", text: "Gizli ücret olmadan net ve avantajlı fiyatlar." },
  { icon: MapPinned, title: "Esnek Teslimat", text: "Birden fazla noktadan kolay teslim alma seçeneği." },
  { icon: Clock3, title: "7/24 Destek", text: "Yolculuğunuz boyunca kesintisiz müşteri desteği." },
];

export default function Ozellikler() {
  return (
    <section id="neden-biz" className="border-b border-kenar bg-panel/35 py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber">Neden Bizi Seçmelisiniz?</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-metin sm:text-4xl">Konforlu yolculuğunuz burada başlar</h2>
          <p className="mt-4 text-sm leading-6 text-metinSoft">Kiralama sürecinin her adımını hızlı, güvenli ve anlaşılır hale getiriyoruz.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ozellikler.map(({ icon: Icon, title, text }, index) => (
            <motion.article key={title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -6 }} className="rounded-2xl border border-kenar bg-panel p-6 shadow-lg shadow-black/5 transition hover:border-amber/40">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/10 text-amber"><Icon size={23} /></span>
              <h3 className="mt-5 font-display text-lg font-bold text-metin">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-metinSoft">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
