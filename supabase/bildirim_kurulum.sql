-- Rezervasyon bildirimleri: mevcut verileri silmez. SQL Editor'de bir defa çalıştırın.
create table if not exists public.site_bildirimler (
 id uuid primary key default gen_random_uuid(),
 kullanici_id uuid not null references auth.users(id) on delete cascade,
 rezervasyon_id uuid references public.site_rezervasyonlar(id) on delete set null,
 baslik text not null, mesaj text not null,
 okundu boolean not null default false,
 created_at timestamptz not null default now()
);
create index if not exists site_bildirimler_user_idx on public.site_bildirimler(kullanici_id,created_at desc);
alter table public.site_bildirimler enable row level security;
drop policy if exists "Kendi bildirimlerini okur" on public.site_bildirimler;
create policy "Kendi bildirimlerini okur" on public.site_bildirimler for select to authenticated using (kullanici_id = (select auth.uid()));
drop policy if exists "Kendi bildirimlerini isaretler" on public.site_bildirimler;
create policy "Kendi bildirimlerini isaretler" on public.site_bildirimler for update to authenticated using (kullanici_id=(select auth.uid())) with check (kullanici_id=(select auth.uid()));
revoke insert, delete on public.site_bildirimler from anon, authenticated;
grant select, update(okundu) on public.site_bildirimler to authenticated;

create or replace function public.rezervasyon_bildirim_tetikle() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_arac text;
begin
 if tg_op = 'INSERT' then
   if new.kullanici_id is not null then
     v_arac := coalesce(new.veri->>'arac','Aracınız');
     insert into public.site_bildirimler(kullanici_id,rezervasyon_id,baslik,mesaj)
     values(new.kullanici_id,new.id,'Rezervasyon talebiniz alındı',v_arac || ' için rezervasyon talebiniz alındı. Yönetici onayı bekleniyor.');
   end if;
 elsif tg_op = 'UPDATE' and new.durum is distinct from old.durum and new.kullanici_id is not null then
   v_arac := coalesce(new.veri->>'arac','Aracınız');
   insert into public.site_bildirimler(kullanici_id,rezervasyon_id,baslik,mesaj)
   values(new.kullanici_id,new.id,
     case new.durum when 'onaylandi' then 'Rezervasyonunuz onaylandı' when 'iptal' then 'Rezervasyonunuz iptal edildi' when 'tamamlandi' then 'Rezervasyonunuz tamamlandı' else 'Rezervasyon durumunuz güncellendi' end,
     case new.durum when 'onaylandi' then v_arac || ' için rezervasyonunuz onaylandı ve oluşturuldu.' when 'iptal' then v_arac || ' için rezervasyonunuz iptal edildi.' when 'tamamlandi' then v_arac || ' için rezervasyonunuz tamamlandı.' else v_arac || ' için rezervasyon talebiniz yeniden beklemeye alındı.' end);
   end if;
 end if;
 return new;
end;
$$;
drop trigger if exists site_rezervasyon_bildirim_trigger on public.site_rezervasyonlar;
create trigger site_rezervasyon_bildirim_trigger after insert or update of durum on public.site_rezervasyonlar
for each row execute function public.rezervasyon_bildirim_tetikle();
do $$ begin
 alter publication supabase_realtime add table public.site_bildirimler;
exception when duplicate_object then null;
end $$;
