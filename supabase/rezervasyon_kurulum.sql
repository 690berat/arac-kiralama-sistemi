-- Mevcut filo ve admin tablolarını SİLMEZ. SQL Editor'de çalıştırın.
create table if not exists public.site_rezervasyonlar (
 id uuid primary key default gen_random_uuid(),
 kullanici_id uuid references auth.users(id) on delete set null,
 arac_id text not null,
 baslangic date not null,
 bitis date not null,
 durum text not null default 'bekliyor' check (durum in ('bekliyor','onaylandi','tamamlandi','iptal')),
 veri jsonb not null,
 created_at timestamptz not null default now(),
 check (bitis > baslangic)
);
create index if not exists site_rezervasyonlar_arac_tarih_idx on public.site_rezervasyonlar(arac_id,baslangic,bitis) where durum <> 'iptal';
create index if not exists site_rezervasyonlar_kullanici_idx on public.site_rezervasyonlar(kullanici_id);
alter table public.site_rezervasyonlar enable row level security;
-- Kişisel bilgiler halka açık SELECT ile görüntülenemez.
drop policy if exists "Rezervasyon okuyabilenler" on public.site_rezervasyonlar;
create policy "Rezervasyon okuyabilenler" on public.site_rezervasyonlar for select to authenticated using (
 kullanici_id = (select auth.uid()) or exists (select 1 from public.site_admins a where a.user_id = (select auth.uid()))
);
-- API'den doğrudan INSERT/UPDATE/DELETE yasak: işlemler doğrulamalı RPC üzerinden yapılır.
revoke insert, update, delete on public.site_rezervasyonlar from anon, authenticated;
grant select on public.site_rezervasyonlar to authenticated;

-- Kişisel bilgi sızdırmadan yalnızca tarih aralıklarını döndürür.
create or replace function public.rezervasyon_dolu_tarihler()
returns table("aracId" text, baslangic date, bitis date, durum text)
language sql security definer set search_path = '' as $$
 select r.arac_id, r.baslangic, r.bitis, r.durum from public.site_rezervasyonlar r
 where r.durum <> 'iptal' and r.bitis >= current_date;
$$;
revoke all on function public.rezervasyon_dolu_tarihler() from public;
grant execute on function public.rezervasyon_dolu_tarihler() to anon, authenticated;

create or replace function public.rezervasyon_olustur(p_veri jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
 v_arac jsonb; v_arac_id text; v_bas date; v_bit date; v_gun int;
 v_fiyat numeric; v_id uuid; v_musteri jsonb; v_yontem text;
begin
 if auth.uid() is null then raise exception 'Rezervasyon için giriş yapın'; end if;
 if p_veri is null or jsonb_typeof(p_veri) <> 'object' then raise exception 'Geçersiz rezervasyon'; end if;
 v_arac_id := nullif(trim(p_veri->>'aracId'),'');
 if v_arac_id is null or length(v_arac_id)>150 then raise exception 'Araç seçilmedi'; end if;
 if p_veri->>'baslangic' !~ '^\d{4}-\d{2}-\d{2}$' or p_veri->>'bitis' !~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'Geçersiz tarih'; end if;
 v_bas := (p_veri->>'baslangic')::date; v_bit := (p_veri->>'bitis')::date;
 if v_bas < current_date or v_bit <= v_bas or v_bit > v_bas + 90 then raise exception 'Tarih aralığı geçersiz (en fazla 90 gün)'; end if;
 v_gun := v_bit-v_bas;
 v_yontem := p_veri->>'odemeYontemi';
 if v_yontem not in ('nakit','kart') then raise exception 'Ödeme yöntemi geçersiz'; end if;
 v_musteri := p_veri->'musteri';
 if jsonb_typeof(v_musteri) is distinct from 'object' or
 length(trim(coalesce(v_musteri->>'adSoyad',''))) not between 2 and 120 or
 length(trim(coalesce(v_musteri->>'telefon',''))) not between 7 and 30 or
 length(trim(coalesce(v_musteri->>'email',''))) > 200 or
 (nullif(trim(coalesce(v_musteri->>'email','')),'') is not null and (v_musteri->>'email') not like '%@%.%') or
 length(trim(coalesce(v_musteri->>'lokasyon',''))) not between 2 and 200
 then raise exception 'Müşteri bilgilerini kontrol edin'; end if;
 -- Birden fazla cihazdan eşzamanlı gelen talepleri aynı araç için sıraya al.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_arac_id));
 select f.value into v_arac from public.site_filo s,
 lateral jsonb_array_elements(s.araclar) f(value)
 where s.id=1 and f.value->>'id'=v_arac_id limit 1;
 if v_arac is null or v_arac->>'durum'<>'musait' then raise exception 'Araç şu anda müsait değil'; end if;
 if exists (select 1 from public.site_rezervasyonlar r where r.arac_id=v_arac_id and r.durum<>'iptal' and r.baslangic<v_bit and r.bitis>v_bas)
 then raise exception 'Bu tarihlerde başka bir rezervasyon bulunmaktadır'; end if;
 v_fiyat := (v_arac->>'gunlukFiyat')::numeric;
 if v_fiyat is null or v_fiyat <= 0 or v_fiyat > 1000000 then raise exception 'Araç fiyatı geçersiz'; end if;
 insert into public.site_rezervasyonlar(kullanici_id,arac_id,baslangic,bitis,veri)
 values (auth.uid(),v_arac_id,v_bas,v_bit,
 jsonb_build_object('aracId',v_arac_id,'arac',concat(v_arac->>'marka',' ',v_arac->>'model'),
 'baslangic',v_bas,'bitis',v_bit,'gun',v_gun,'tutar',v_gun*v_fiyat,'durum','bekliyor',
 'odemeYontemi',v_yontem,'odemeDurumu',case when v_yontem='kart' then 'demo-odeme-alinmadi' else 'teslimatta-odenecek' end,
 'musteri',jsonb_build_object('adSoyad',left(v_musteri->>'adSoyad',120),'telefon',left(v_musteri->>'telefon',30),
 'email',left(v_musteri->>'email',200),'lokasyon',left(v_musteri->>'lokasyon',200))
 )) returning id into v_id;
 return v_id;
end;
$$;
revoke all on function public.rezervasyon_olustur(jsonb) from public;
grant execute on function public.rezervasyon_olustur(jsonb) to authenticated;

create or replace function public.rezervasyon_durum_guncelle(p_id uuid,p_durum text)
returns void language plpgsql security definer set search_path = '' as $$
begin
 if auth.uid() is null or not exists (select 1 from public.site_admins where user_id=auth.uid()) then raise exception 'Admin yetkisi gerekli'; end if;
 if p_durum not in ('bekliyor','onaylandi','tamamlandi','iptal') then raise exception 'Geçersiz durum'; end if;
 update public.site_rezervasyonlar set durum=p_durum,veri=jsonb_set(veri,'{durum}',to_jsonb(p_durum)) where id=p_id;
 if not found then raise exception 'Rezervasyon bulunamadı'; end if;
end;
$$;
revoke all on function public.rezervasyon_durum_guncelle(uuid,text) from public, anon;
grant execute on function public.rezervasyon_durum_guncelle(uuid,text) to authenticated;

create or replace function public.rezervasyon_sil(p_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
 if auth.uid() is null or not exists (select 1 from public.site_admins where user_id=auth.uid()) then raise exception 'Admin yetkisi gerekli'; end if;
 delete from public.site_rezervasyonlar where id=p_id;
end;
$$;
revoke all on function public.rezervasyon_sil(uuid) from public, anon;
grant execute on function public.rezervasyon_sil(uuid) to authenticated;

do $$ begin
 alter publication supabase_realtime add table public.site_rezervasyonlar;
exception when duplicate_object then null;
end $$;
