-- Run AFTER schema.sql. Adds roles, admin content, audit log, feedback.
alter table public.profiles add column role text not null default 'user' check (role in ('user','admin'));
create function public.is_admin() returns boolean language sql security definer stable set search_path=public as
$$ select exists(select 1 from public.profiles where id=auth.uid() and role='admin') $$;
-- users can never change their own role: only these two columns are updatable
drop policy "own profile" on public.profiles;
create policy "read own or admin" on public.profiles for select using (auth.uid()=id or public.is_admin());
create policy "update own" on public.profiles for update using (auth.uid()=id) with check (auth.uid()=id);
revoke update on public.profiles from authenticated, anon;
grant update (full_name, situation) on public.profiles to authenticated;

create table public.articles(id uuid primary key default gen_random_uuid(), title text not null, keywords text default '', body text not null, published boolean default true, updated_at timestamptz default now());
create table public.settings(key text primary key, value jsonb not null, updated_at timestamptz default now());
create table public.audit_log(id bigint generated always as identity primary key, user_id uuid default auth.uid(), action text not null, detail text, created_at timestamptz default now());
create table public.feedback(id bigint generated always as identity primary key, user_id uuid default auth.uid(), rating int not null check (rating between 1 and 5), comment text, created_at timestamptz default now());
alter table public.articles enable row level security; alter table public.settings enable row level security;
alter table public.audit_log enable row level security; alter table public.feedback enable row level security;
create policy "read published" on public.articles for select using (published or public.is_admin());
create policy "admin write articles" on public.articles for all using (public.is_admin()) with check (public.is_admin());
create policy "read settings" on public.settings for select using (true);
create policy "admin write settings" on public.settings for all using (public.is_admin()) with check (public.is_admin());
create policy "log own action" on public.audit_log for insert with check (auth.uid()=user_id);
create policy "admin read log" on public.audit_log for select using (public.is_admin());
create policy "send feedback" on public.feedback for insert with check (auth.uid()=user_id);
create policy "admin read feedback" on public.feedback for select using (public.is_admin());

insert into public.settings(key,value) values('flisp','{"min":3501,"max":22000,"top":130500,"bottom":27960}');
insert into public.articles(title,keywords,body) values
('Illegal eviction','evict eviction landlord lock out','A landlord may not lock you out, cut services or remove your belongings without a court order. Only a court can order an eviction after hearing both sides.'),
('Deposit disputes','deposit refund return','Your deposit must be held in an interest-bearing account. The landlord must inspect with you at move-in and move-out and refund the deposit plus interest, less proven damage.'),
('Lease obligations','lease contract written rent increase','A lease can be written or oral and is still binding. Landlords must give proper notice and cannot change terms the lease does not allow.'),
('Title deed and RDP houses','title deed rdp ownership registered','A title deed is the legal proof you own a property. Many RDP owners never received one. Check registration status at the Deeds Office and ask for help to register.'),
('Bond and transfer costs','bond transfer costs attorney','Buying costs more than the price: transfer duty above the threshold, conveyancing fees, bond registration fees and deeds office charges.'),
('FLISP subsidy','flisp subsidy first time buyer','The Finance Linked Individual Subsidy helps first-time buyers earning roughly R3 501 to R22 000 a month. You need a bond approval and apply through NHFC.');
-- MAKE YOURSELF ADMIN (after you signed up): put your email below and run this line alone.
-- update public.profiles set role='admin' where id=(select id from auth.users where email='YOUR@EMAIL.com');
