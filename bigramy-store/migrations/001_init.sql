CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  shopify_id BIGINT,
  handle TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  vendor TEXT NOT NULL DEFAULT 'RED REX',
  product_type TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  body_html TEXT NOT NULL DEFAULT '',
  body_text TEXT NOT NULL DEFAULT '',
  images JSONB NOT NULL DEFAULT '[]',
  options JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  shopify_variant_id BIGINT,
  title TEXT NOT NULL DEFAULT 'Default',
  price NUMERIC(12,2) NOT NULL,
  compare_at_price NUMERIC(12,2),
  sku TEXT NOT NULL DEFAULT '',
  available BOOLEAN NOT NULL DEFAULT TRUE,
  option1 TEXT,
  option2 TEXT,
  option3 TEXT
);

CREATE INDEX IF NOT EXISTS variants_product_id_idx ON variants(product_id);

CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  handle TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_products (
  collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);

CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  -- specific_mix | any_quantity | percent_off | fixed_amount_off
  offer_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  fixed_total NUMERIC(12,2),
  discount_amount NUMERIC(12,2),
  discount_percent NUMERIC(8,2),
  min_quantity INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offer_items (
  id SERIAL PRIMARY KEY,
  offer_id INTEGER NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS offer_items_offer_id_idx ON offer_items(offer_id);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL DEFAULT '',
  customer_phone TEXT NOT NULL DEFAULT '',
  customer_address TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  subtotal NUMERIC(12,2) NOT NULL,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EGP',
  offer_id INTEGER REFERENCES offers(id) ON DELETE SET NULL,
  offer_name TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  review_date DATE,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5
);
