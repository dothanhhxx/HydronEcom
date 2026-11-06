-- Lam Trà: lược đồ Supabase. Dán toàn bộ vào Supabase → SQL Editor → Run (chạy lại nhiều lần vẫn an toàn).

-- Mỗi file .json cũ (vd. products.json) là 1 dòng
create table if not exists public.documents (
  name       text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- Mỗi dòng của file .jsonl cũ (đơn hàng, tin nhắn, lịch sử trạng thái…) là 1 dòng; id giữ thứ tự thêm vào
create table if not exists public.records (
  id         bigint generated always as identity primary key,
  stream     text not null,          -- tên file cũ, vd. 'orders.jsonl'
  data       jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists records_stream_id_idx on public.records (stream, id);

-- Bật RLS và KHÔNG tạo policy nào: khoá anon/public không đọc ghi được gì.
-- Backend dùng khoá service_role nên vẫn truy cập bình thường.
alter table public.documents enable row level security;
alter table public.records   enable row level security;

-- Chỉ cấp quyền cho service_role (khoá backend). Cần khi tắt "Automatically expose new tables";
-- anon/authenticated không được cấp gì nên khoá công khai không chạm được vào dữ liệu.
grant usage on schema public to service_role;
grant select, insert, update, delete on public.documents, public.records to service_role;
grant usage, select on all sequences in schema public to service_role;
revoke all on public.documents, public.records from anon, authenticated;

-- Bucket ảnh sản phẩm, công khai để hiển thị trên web (chỉ backend được tải lên)
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;
