import useBildirimler from "../hooks/useBildirimler";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CalendarDays,
  CarFront,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Phone,
  UserRound,
  ChevronDown,
  X,
} from "lucide-react";

export default function Navbar({
  git = (path) => window.location.assign(path),
  kullanici = null,
  cikisYap,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuAcik, setMenuAcik] = useState(false);
  const [hesapMenuAcik, setHesapMenuAcik] = useState(false);
  const aktifYol = window.location.pathname;
  const {okunmamis,okunduIsaretle} = useBildirimler(kullanici);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkler = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/araclar", label: "Araçlar" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/hizmetler", label: "Hizmetler" },
    { href: "/kampanyalar", label: "Kampanyalar" },
    { href: "/rezervasyonlarim", label: "Rezervasyonlarım" },
    { href: "/iletisim", label: "İletişim" },
  ];

  const tikla = (e, href) => {
    if (href.includes("#")) return;
    e.preventDefault();
    setMenuAcik(false);
    if (href === "/bildirimler") okunduIsaretle();
    git(href === "/rezervasyonlarim" && !kullanici ? "/giris" : href);
  };

  const cikis = () => {
    setMenuAcik(false);
    cikisYap?.();
  };

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled || aktifYol !== "/"
          ? "border-b border-white/10 bg-asfalt/92 shadow-xl backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1680px] items-center gap-4 px-4 xl:px-6 2xl:px-8">
        <a
          href="/"
          onClick={(e) => tikla(e, "/")}
          className="group flex shrink-0 items-center gap-2 2xl:gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber shadow-lg shadow-amber/20">
            <CarFront size={22} className="text-asfalt" />
          </span>
          <span className="font-display text-xl font-extrabold text-metin">
            Rent<span className="text-amber">Car</span>
          </span>
        </a>

        <nav className="ml-5 hidden min-w-0 flex-1 items-center justify-center gap-3 xl:flex 2xl:gap-5">
          {linkler.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => tikla(e, link.href)}
              className={`whitespace-nowrap text-[13px] font-medium transition hover:text-amber 2xl:text-sm ${
                aktifYol === link.href ? "text-amber" : "text-metinSoft"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-2 xl:flex 2xl:gap-3">
          <a
            href="tel:08501234567"
            className="hidden shrink-0 items-center gap-2 whitespace-nowrap text-xs font-semibold text-metin 2xl:flex"
          >
            <Phone size={17} className="text-amber" />0 (850) 123 45 67
          </a>

          {kullanici?.rol === "admin" && (
            <a
              href="/admin"
              onClick={(e) => tikla(e, "/admin")}
              title="Admin Paneli"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber/25 bg-amber/10 text-amber transition hover:bg-amber hover:text-asfalt"
            >
              <LayoutDashboard size={18} />
            </a>
          )}

          {kullanici?.rol === "kullanici" && (
            <a
              href="/bildirimler"
              onClick={(e) => tikla(e, "/bildirimler")}
              title="Bildirimler"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-metinSoft transition hover:border-amber/30 hover:text-amber"
            >
              <Bell size={18} />
              {okunmamis > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber px-1 text-[9px] font-extrabold text-asfalt">{okunmamis > 99 ? "99+" : okunmamis}</span>}
            </a>
          )}

          <a
            href="/favoriler"
            onClick={(e) => tikla(e, "/favoriler")}
            title="Favoriler"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-metinSoft hover:text-amber"
          >
            <Heart size={18} />
          </a>

          {kullanici ? (
            <>
              {kullanici.rol === "kullanici" && (
                <div className="relative hidden xl:block">
                  <button
                    type="button"
                    onClick={() => setHesapMenuAcik((acik) => !acik)}
                    className="flex max-w-[155px] items-center gap-2 rounded-xl border border-amber/20 bg-amber/[.07] px-2.5 py-2 text-left transition hover:border-amber/40 2xl:max-w-[180px]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber font-extrabold text-asfalt">
                      {String(kullanici.ad || "M").charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-white">{kullanici.ad}</span>
                    </span>
                    <ChevronDown size={15} className={`text-metinSoft transition ${hesapMenuAcik ? "rotate-180" : ""}`} />
                  </button>
                  {hesapMenuAcik && (
                    <div className="absolute right-0 top-[calc(100%+10px)] w-52 rounded-2xl border border-white/10 bg-panel p-2 shadow-2xl shadow-black/40">
                      <button onClick={() => { setHesapMenuAcik(false); git("/hesabim"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white hover:bg-white/5 hover:text-amber"><UserRound size={17}/> Hesabım</button>
                      <button onClick={() => { setHesapMenuAcik(false); git("/rezervasyonlarim"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white hover:bg-white/5 hover:text-amber"><CalendarDays size={17}/> Rezervasyonlarım</button>
                      <button onClick={() => { setHesapMenuAcik(false); git("/favoriler"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white hover:bg-white/5 hover:text-amber"><Heart size={17}/> Favorilerim</button>
                      <button onClick={() => { setHesapMenuAcik(false); okunduIsaretle(); git("/bildirimler"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white hover:bg-white/5 hover:text-amber"><Bell size={17}/> Bildirimler</button>
                      <div className="my-1 border-t border-white/10" />
                      <button onClick={() => { setHesapMenuAcik(false); cikis(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-tehlike hover:bg-tehlike/10"><LogOut size={17}/> Çıkış Yap</button>
                    </div>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={cikis}
                title="Çıkış Yap"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-metinSoft transition hover:border-tehlike/30 hover:text-tehlike"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <a
              href="/giris"
              onClick={(e) => tikla(e, "/giris")}
              title="Giriş"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-metinSoft hover:text-amber"
            >
              <LogIn size={18} />
            </a>
          )}

          <a
            href="/araclar"
            onClick={(e) => tikla(e, "/araclar")}
            className="shrink-0 whitespace-nowrap rounded-xl bg-amber px-3 py-2.5 text-sm font-bold text-asfalt 2xl:px-5"
          >
            Araç Kirala
          </a>
        </div>

        <button
          onClick={() => setMenuAcik((acik) => !acik)}
          className="ml-auto rounded-lg border border-white/10 p-2 text-metin xl:hidden"
        >
          {menuAcik ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {menuAcik && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-asfalt/95 px-4 xl:hidden"
          >
            <div className="py-4">
              {linkler.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => tikla(e, link.href)}
                  className="block rounded-lg px-3 py-3 text-sm text-metinSoft hover:bg-white/5 hover:text-amber"
                >
                  {link.label}
                </a>
              ))}

              {kullanici?.rol === "admin" && (
                <a
                  href="/admin"
                  onClick={(e) => tikla(e, "/admin")}
                  className="mt-2 block rounded-lg bg-amber/10 px-3 py-3 text-sm font-bold text-amber"
                >
                  Admin Paneli
                </a>
              )}

              {kullanici ? (
                <div className="mt-2">
                  {kullanici.rol === "kullanici" && (
                    <button onClick={() => { setMenuAcik(false); git("/hesabim"); }} className="flex w-full items-center gap-3 rounded-xl border border-amber/20 bg-amber/[.07] px-3 py-3 text-left">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber font-extrabold text-asfalt">{String(kullanici.ad || "M").charAt(0).toUpperCase()}</span>
                      <span className="block truncate text-sm font-bold text-white">{kullanici.ad}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={cikis}
                    className="mt-2 block w-full rounded-lg px-3 py-3 text-left text-sm text-tehlike hover:bg-white/5"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <a
                  href="/giris"
                  onClick={(e) => tikla(e, "/giris")}
                  className="mt-2 block rounded-lg px-3 py-3 text-sm text-metinSoft hover:bg-white/5 hover:text-amber"
                >
                  Giriş Yap
                </a>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
