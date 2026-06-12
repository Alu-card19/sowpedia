-- Sections table
create table sections (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  order_index int not null,
  created_at timestamptz default now()
);

-- Insert sections
insert into sections (name, order_index) values 
('Little Sprouts', 1), 
('Rising Explorers', 2), 
('Builders League', 3), 
('Champions Circle', 4), 
('Elite Masters', 5), 
('Grand Legends', 6);

-- Contestants table
create table contestants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  section text not null,
  youtube_url text,
  picture_url text,
  score int default 0,
  position int default 0,
  created_at timestamptz default now()
);

-- Sponsors table
create table sponsors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  logo_url text,
  order_index int default 0,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table sections enable row level security;
alter table contestants enable row level security;
alter table sponsors enable row level security;

-- Create RLS policies for public read access
drop policy if exists "public_sections" on sections;
create policy "public_sections" on sections for select using (true);

drop policy if exists "public_contestants" on contestants;
create policy "public_contestants" on contestants for select using (true);

drop policy if exists "public_sponsors" on sponsors;
create policy "public_sponsors" on sponsors for select using (true);

-- Storage bucket for sponsor logos
insert into storage.buckets (id, name, public) values ('sponsor-logos', 'sponsor-logos', true) on conflict (id) do nothing;

-- Storage bucket for contestant pictures
insert into storage.buckets (id, name, public) values ('contestant-pictures', 'contestant-pictures', true) on conflict (id) do nothing;

-- Storage policies
drop policy if exists "Public can read sponsor logos" on storage.objects;
create policy "Public can read sponsor logos" on storage.objects for select using (bucket_id = 'sponsor-logos');

drop policy if exists "Public can read contestant pictures" on storage.objects;
create policy "Public can read contestant pictures" on storage.objects for select using (bucket_id = 'contestant-pictures');

drop policy if exists "Admin can upload sponsor logos" on storage.objects;
create policy "Admin can upload sponsor logos" on storage.objects for insert with check (bucket_id = 'sponsor-logos');

drop policy if exists "Admin can upload contestant pictures" on storage.objects;
create policy "Admin can upload contestant pictures" on storage.objects for insert with check (bucket_id = 'contestant-pictures');

drop policy if exists "Admin can delete sponsor logos" on storage.objects;
create policy "Admin can delete sponsor logos" on storage.objects for delete using (bucket_id = 'sponsor-logos');

drop policy if exists "Admin can delete contestant pictures" on storage.objects;
create policy "Admin can delete contestant pictures" on storage.objects for delete using (bucket_id = 'contestant-pictures');
