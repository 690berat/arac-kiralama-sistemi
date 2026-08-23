import { AnimatePresence, motion } from "framer-motion";
import { CarFront } from "lucide-react";
import AracKarti from "./AracKarti";

export default function AracListesi({ araclar, onDurumDegistir, onDuzenle, onSil }) {
  if (araclar.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[360px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-white/[0.025] px-6 text-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber/20 bg-amber/10 text-amber">
          <CarFront size={30} />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold text-metin">
          Araç bulunamadı
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-metinSoft">
          Arama kelimesini veya durum filtresini değiştirerek tekrar deneyin.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {araclar.map((arac) => (
          <AracKarti
            key={arac.id}
            arac={arac}
            onDurumDegistir={onDurumDegistir}
            onDuzenle={onDuzenle}
            onSil={onSil}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
