-- Run this whole file in Supabase: SQL Editor > New query > Run
create table public.profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, id_masked text, dob text, gender text, citizenship text, situation text,
  created_at timestamptz default now());
create table public.applications(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('deed','flisp','tribunal')),
  completed_steps int[] not null default '{}',
  updated_at timestamptz default now(), unique(user_id,type));
create table public.documents(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  filename text not null, storage_path text not null, created_at timestamptz default now());
alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.documents enable row level security;
create policy "own profile" on public.profiles for all using (auth.uid()=id) with check (auth.uid()=id);
create policy "own applications" on public.applications for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own documents" on public.documents for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
-- create the profile automatically from sign-up data
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,full_name,id_masked,dob,gender,citizenship,situation)
  values(new.id,new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'id_masked',new.raw_user_meta_data->>'dob',
         new.raw_user_meta_data->>'gender',new.raw_user_meta_data->>'citizenship',new.raw_user_meta_data->>'situation');
  return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
-- private, encrypted-at-rest file bucket; each user can only touch their own folder
insert into storage.buckets(id,name,public) values('documents','documents',false);
create policy "own files" on storage.objects for all
  using (bucket_id='documents' and (storage.foldername(name))[1]=auth.uid()::text)
  with check (bucket_id='documents' and (storage.foldername(name))[1]=auth.uid()::text);
