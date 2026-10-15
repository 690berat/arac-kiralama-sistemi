-- Supabase SQL Editor'de tek sefer çalıştırın.
create table if not exists public.site_filo (
  id integer primary key check (id = 1),
  araclar jsonb not null default '[]'::jsonb check (jsonb_typeof(araclar) = 'array'),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.site_filo enable row level security;
alter table public.site_admins enable row level security;

-- Her ziyaretçi filoyu görebilir.
drop policy if exists "Ziyaretciler filoyu okuyabilir" on public.site_filo;
create policy "Ziyaretciler filoyu okuyabilir" on public.site_filo
for select to anon, authenticated using (true);

-- Kullanıcı yalnızca kendi admin üyeliğini görebilir.
drop policy if exists "Kendi admin yetkisini okuyabilir" on public.site_admins;
create policy "Kendi admin yetkisini okuyabilir" on public.site_admins
for select to authenticated using (auth.uid() = user_id);

-- Normal kullanıcıların ve anonimlerin yazma izni yoktur.
-- Yalnızca sunucuda admin tablosu kontrolünden geçen bir RPC yazabilir.
create or replace function public.filo_guncelle(yeni_araclar jsonb)
returns void language plpgsql security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.site_admins where user_id = auth.uid()
  ) then
    raise exception 'Bu işlem için admin yetkisi gerekli';
  end if;
  if jsonb_typeof(yeni_araclar) is distinct from 'array' then
    raise exception 'Araç listesi dizi olmalıdır';
  end if;
  insert into public.site_filo(id, araclar, updated_at)
  values (1, yeni_araclar, now())
  on conflict(id) do update set araclar=excluded.araclar, updated_at=now();
end;
$$;
revoke all on function public.filo_guncelle(jsonb) from public;
revoke all on function public.filo_guncelle(jsonb) from anon;
grant execute on function public.filo_guncelle(jsonb) to authenticated;

insert into public.site_filo (id,araclar) values (1,
'[{"id":"golf","marka":"Volkswagen","model":"Golf","yil":2023,"plaka":"34 ABC 123","sinif":"Ekonomi","gunlukFiyat":1450,"kilometre":42000,"yakit":"Benzin","vites":"Otomatik","kisiSayisi":5,"kapiSayisi":5,"bagaj":"Orta","klima":true,"resimler":["https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop"],"durum":"musait","resimUrl":"https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop"},{"id":"bmw-x5","marka":"BMW","model":"X5","yil":2024,"plaka":"06 XYZ 456","sinif":"SUV","gunlukFiyat":3200,"kilometre":18000,"yakit":"Dizel","vites":"Otomatik","kisiSayisi":5,"kapiSayisi":5,"bagaj":"Büyük","klima":true,"resimler":["https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop"],"durum":"musait","resimUrl":"https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop"}]'::jsonb)
on conflict (id) do nothing;

-- Admin atama (Auth > Users ekranından kullanıcının UUID'sini aldıktan sonra):
-- insert into public.site_admins(user_id) values ('BURAYA_ADMIN_UUID');

-- Realtime özelliği için tablo publication'a eklensin (zaten ekliyse atla).
do $$ begin
  alter publication supabase_realtime add table public.site_filo;
exception when duplicate_object then null;
end $$;
