
import { useCallback, useEffect, useState } from "react";
import { supabase, supabaseHazir } from "../supabaseClient";

export default function useBildirimler(kullanici) {
  const [bildirimler, setBildirimler] = useState([]);

  const uid =
    kullanici?.rol === "kullanici"
      ? kullanici?.id
      : null;

  // Supabase üzerinden bildirimleri getir
  const yenile = useCallback(async () => {
    if (!uid || !supabaseHazir || !supabase) {
      setBildirimler([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("site_bildirimler")
        .select(
          "id,baslik,mesaj,okundu,created_at,rezervasyon_id"
        )
        .eq("kullanici_id", uid)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      setBildirimler(data || []);
    } catch (error) {
      console.error(
        "Bildirimler yüklenemedi:",
        error.message
      );
    }
  }, [uid]);

  // Bildirimleri yükle ve canlı bağlantıyı kur
  useEffect(() => {
    if (!uid || !supabaseHazir || !supabase) {
      setBildirimler([]);
      return;
    }

    let aktif = true;

    const bildirimYenile = () => {
      if (aktif) {
        yenile();
      }
    };

    bildirimYenile();

    // Her bağlantıda benzersiz kanal oluştur.
    // Önce dinleyiciyi ekle, sonra subscribe çağır.
    const kanalAdi =
      `bildirim-${uid}-${crypto.randomUUID()}`;

    const channel = supabase
      .channel(kanalAdi)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_bildirimler",
          filter: `kullanici_id=eq.${uid}`,
        },
        bildirimYenile
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.warn(
            "Bildirim canlı bağlantısında hata oluştu."
          );
        }
      });

    // Sekmeye geri dönülünce güncelle
    const sayfaGorunurluk = () => {
      if (!document.hidden) {
        bildirimYenile();
      }
    };

    document.addEventListener(
      "visibilitychange",
      sayfaGorunurluk
    );

    // Realtime bağlantısına ek olarak periyodik kontrol
    const interval = window.setInterval(
      bildirimYenile,
      20000
    );

    return () => {
      aktif = false;

      document.removeEventListener(
        "visibilitychange",
        sayfaGorunurluk
      );

      window.clearInterval(interval);

      // Eski kanalı temizle
      supabase.removeChannel(channel);
    };
  }, [uid, yenile]);

  // Bildirimleri okundu olarak işaretle
  const okunduIsaretle = useCallback(async () => {
    if (!uid || !supabaseHazir || !supabase) return;

    const eskiler = bildirimler;

    // Kullanıcı zile bastığında sayaç hemen kaybolsun
    setBildirimler((items) =>
      items.map((bildirim) => ({
        ...bildirim,
        okundu: true,
      }))
    );

    try {
      const { error } = await supabase
        .from("site_bildirimler")
        .update({ okundu: true })
        .eq("kullanici_id", uid)
        .eq("okundu", false);

      if (error) throw error;

      // Sunucudaki güncel verileri tekrar getir
      await yenile();
    } catch (error) {
      console.error(
        "Bildirimler okundu olarak kaydedilemedi:",
        error.message
      );

      setBildirimler(eskiler);
    }
  }, [uid, bildirimler, yenile]);

  const okunmamis = bildirimler.filter(
    (bildirim) => !bildirim.okundu
  ).length;

  return {
    bildirimler,
    okunmamis,
    okunduIsaretle,
    yenile,
  };
}
