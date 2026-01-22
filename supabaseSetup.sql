create table retailers (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size text,
  category text
);

create table deals (
  id uuid primary key default gen_random_uuid(),
  retailer_id uuid references retailers(id),
  product_id uuid references products(id),
  price numeric not null,
  start_date date not null,
  end_date date not null,
  created_at timestamp default now(),
  unique (retailer_id, product_id, start_date)
);

create table users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  preferred_retailers text[]
);
