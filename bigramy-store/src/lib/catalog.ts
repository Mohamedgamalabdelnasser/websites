import { readFile } from "node:fs/promises";
import path from "node:path";
import { sql } from "./db";
import type { Collection, Offer, OfferItem, Product, Variant } from "./types";

type Seed = {
  brand: Record<string, string>;
  nav: { label: string; href: string }[];
  categories: {
    handle: string;
    title: string;
    count: number;
    image: string | null;
  }[];
  reviews: { author: string; date: string; text: string; rating: number }[];
  frontpage_handles: string[];
  products: {
    shopify_id: number;
    handle: string;
    title: string;
    vendor: string;
    product_type: string;
    tags: string[];
    body_html: string;
    body_text: string;
    images: string[];
    options: { name: string; values: string[] }[];
    variants: {
      shopify_variant_id: number;
      title: string;
      price: number;
      compare_at_price: number | null;
      sku: string;
      available: boolean;
      option1: string | null;
      option2: string | null;
      option3: string | null;
    }[];
    status: string;
  }[];
  collections: {
    handle: string;
    title: string;
    description: string;
    image: string | null;
    products: string[];
  }[];
  offers: {
    name: string;
    type: string;
    status: string;
    fixed_total: number | null;
    discount_amount: number | null;
    discount_percent: number | null;
    items: { product_handle: string; quantity: number }[];
    description: string;
  }[];
};

let seeded = false;

export async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  const rows = await sql<{ c: string }>("select count(*)::text as c from products");
  if (Number(rows[0]?.c ?? 0) > 0) {
    seeded = true;
    return;
  }
  await seedFromFile();
  seeded = true;
}

export async function seedFromFile(force = false): Promise<{ products: number }> {
  if (force) {
    await sql("delete from orders");
    await sql("delete from offer_items");
    await sql("delete from offers");
    await sql("delete from collection_products");
    await sql("delete from collections");
    await sql("delete from variants");
    await sql("delete from products");
    await sql("delete from reviews");
    await sql("delete from settings");
  }

  const existing = await sql<{ c: string }>("select count(*)::text as c from products");
  if (!force && Number(existing[0]?.c ?? 0) > 0) {
    return { products: Number(existing[0].c) };
  }

  const raw = await readFile(
    path.join(process.cwd(), "data", "seed.json"),
    "utf8",
  );
  const seed = JSON.parse(raw) as Seed;

  await sql(
    `insert into settings(key, value) values ($1, $2::jsonb)
     on conflict (key) do update set value = excluded.value`,
    ["brand", JSON.stringify(seed.brand)],
  );
  await sql(
    `insert into settings(key, value) values ($1, $2::jsonb)
     on conflict (key) do update set value = excluded.value`,
    ["nav", JSON.stringify(seed.nav)],
  );
  await sql(
    `insert into settings(key, value) values ($1, $2::jsonb)
     on conflict (key) do update set value = excluded.value`,
    ["categories", JSON.stringify(seed.categories)],
  );
  await sql(
    `insert into settings(key, value) values ($1, $2::jsonb)
     on conflict (key) do update set value = excluded.value`,
    ["frontpage_handles", JSON.stringify(seed.frontpage_handles)],
  );

  for (const r of seed.reviews) {
    await sql(
      `insert into reviews(author, review_date, text, rating) values ($1, $2, $3, $4)`,
      [r.author, r.date, r.text, r.rating],
    );
  }

  const handleToId = new Map<string, number>();

  for (const p of seed.products) {
    const inserted = await sql<{ id: number }>(
      `insert into products(
         shopify_id, handle, title, vendor, product_type, tags,
         body_html, body_text, images, options, status
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11)
       returning id`,
      [
        p.shopify_id,
        p.handle,
        p.title,
        p.vendor,
        p.product_type,
        p.tags,
        p.body_html,
        p.body_text,
        JSON.stringify(p.images),
        JSON.stringify(p.options),
        p.status,
      ],
    );
    const productId = inserted[0].id;
    handleToId.set(p.handle, productId);
    for (const v of p.variants) {
      await sql(
        `insert into variants(
           product_id, shopify_variant_id, title, price, compare_at_price,
           sku, available, option1, option2, option3
         ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          productId,
          v.shopify_variant_id,
          v.title,
          v.price,
          v.compare_at_price,
          v.sku,
          v.available,
          v.option1,
          v.option2,
          v.option3,
        ],
      );
    }
  }

  for (const c of seed.collections) {
    const inserted = await sql<{ id: number }>(
      `insert into collections(handle, title, description, image)
       values ($1,$2,$3,$4) returning id`,
      [c.handle, c.title, c.description, c.image],
    );
    const colId = inserted[0].id;
    let pos = 0;
    for (const h of c.products) {
      const pid = handleToId.get(h);
      if (!pid) continue;
      await sql(
        `insert into collection_products(collection_id, product_id, position)
         values ($1,$2,$3) on conflict do nothing`,
        [colId, pid, pos++],
      );
    }
  }

  for (const o of seed.offers) {
    const inserted = await sql<{ id: number }>(
      `insert into offers(
         name, description, offer_type, status, fixed_total,
         discount_amount, discount_percent
       ) values ($1,$2,$3,$4,$5,$6,$7) returning id`,
      [
        o.name,
        o.description,
        o.type,
        o.status,
        o.fixed_total,
        o.discount_amount,
        o.discount_percent,
      ],
    );
    const offerId = inserted[0].id;
    for (const item of o.items) {
      const pid = handleToId.get(item.product_handle);
      if (!pid) continue;
      await sql(
        `insert into offer_items(offer_id, product_id, quantity) values ($1,$2,$3)`,
        [offerId, pid, item.quantity],
      );
    }
  }

  return { products: seed.products.length };
}

function parseImages(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  }
  return [];
}

function parseOptions(raw: unknown): { name: string; values: string[] }[] {
  if (Array.isArray(raw)) return raw as { name: string; values: string[] }[];
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as { name: string; values: string[] }[];
    } catch {
      return [];
    }
  }
  return [];
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: Number(row.id),
    shopify_id: row.shopify_id != null ? Number(row.shopify_id) : null,
    handle: String(row.handle),
    title: String(row.title),
    vendor: String(row.vendor),
    product_type: String(row.product_type),
    tags: (row.tags as string[]) ?? [],
    body_html: String(row.body_html ?? ""),
    body_text: String(row.body_text ?? ""),
    images: parseImages(row.images),
    options: parseOptions(row.options),
    status: String(row.status),
    min_price: row.min_price != null ? Number(row.min_price) : undefined,
    max_price: row.max_price != null ? Number(row.max_price) : undefined,
    compare_at: row.compare_at != null ? Number(row.compare_at) : null,
  };
}

export async function listProducts(opts?: {
  collection?: string;
  q?: string;
  status?: string;
}): Promise<Product[]> {
  await ensureSeeded();
  const params: unknown[] = [];
  let where = "where 1=1";
  if (opts?.status) {
    params.push(opts.status);
    where += ` and p.status = $${params.length}`;
  } else {
    where += ` and p.status = 'active'`;
  }
  if (opts?.q) {
    params.push(`%${opts.q}%`);
    where += ` and (p.title ilike $${params.length} or p.handle ilike $${params.length})`;
  }
  if (opts?.collection && opts.collection !== "all") {
    params.push(opts.collection);
    const rows = await sql(
      `select p.*,
              min(v.price)::float as min_price,
              max(v.price)::float as max_price,
              max(v.compare_at_price)::float as compare_at
       from products p
       join collection_products cp on cp.product_id = p.id
       join collections c on c.id = cp.collection_id
       left join variants v on v.product_id = p.id
       ${where} and c.handle = $${params.length}
       group by p.id
       order by min(cp.position), p.title`,
      params,
    );
    return rows.map((r) => mapProduct(r));
  }

  const rows = await sql(
    `select p.*,
            min(v.price)::float as min_price,
            max(v.price)::float as max_price,
            max(v.compare_at_price)::float as compare_at
     from products p
     left join variants v on v.product_id = p.id
     ${where}
     group by p.id
     order by p.title`,
    params,
  );
  return rows.map((r) => mapProduct(r));
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  await ensureSeeded();
  const rows = await sql(
    `select p.*,
            min(v.price)::float as min_price,
            max(v.price)::float as max_price,
            max(v.compare_at_price)::float as compare_at
     from products p
     left join variants v on v.product_id = p.id
     where p.handle = $1
     group by p.id`,
    [handle],
  );
  if (!rows[0]) return null;
  const product = mapProduct(rows[0]);
  const variants = await sql<Variant>(
    `select id, product_id, shopify_variant_id, title, price::float as price,
            compare_at_price::float as compare_at_price, sku, available,
            option1, option2, option3
     from variants where product_id = $1 order by id`,
    [product.id],
  );
  product.variants = variants.map((v) => ({
    ...v,
    price: Number(v.price),
    compare_at_price: v.compare_at_price != null ? Number(v.compare_at_price) : null,
  }));
  return product;
}

export async function listCollections(): Promise<Collection[]> {
  await ensureSeeded();
  return sql<Collection>(
    `select id, handle, title, description, image from collections order by title`,
  );
}

export async function getCollection(handle: string): Promise<Collection | null> {
  await ensureSeeded();
  const rows = await sql<Collection>(
    `select id, handle, title, description, image from collections where handle = $1`,
    [handle],
  );
  return rows[0] ?? null;
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  await ensureSeeded();
  const rows = await sql<{ value: T }>(
    `select value from settings where key = $1`,
    [key],
  );
  return rows[0]?.value ?? fallback;
}

export async function listReviews() {
  await ensureSeeded();
  return sql<{
    id: number;
    author: string;
    review_date: string;
    text: string;
    rating: number;
  }>(`select id, author, review_date::text, text, rating from reviews order by id desc`);
}

export async function listOffers(includeInactive = false): Promise<
  (Offer & { items: OfferItem[] })[]
> {
  await ensureSeeded();
  const offers = await sql<Offer>(
    includeInactive
      ? `select id, name, description, offer_type, status,
                fixed_total::float as fixed_total,
                discount_amount::float as discount_amount,
                discount_percent::float as discount_percent,
                min_quantity
         from offers order by id desc`
      : `select id, name, description, offer_type, status,
                fixed_total::float as fixed_total,
                discount_amount::float as discount_amount,
                discount_percent::float as discount_percent,
                min_quantity
         from offers where status = 'active' order by id desc`,
  );
  const result: (Offer & { items: OfferItem[] })[] = [];
  for (const offer of offers) {
    const items = await sql<OfferItem>(
      `select oi.id, oi.offer_id, oi.product_id, oi.quantity,
              p.handle as product_handle, p.title as product_title
       from offer_items oi
       join products p on p.id = oi.product_id
       where oi.offer_id = $1
       order by oi.id`,
      [offer.id],
    );
    result.push({
      ...offer,
      fixed_total: offer.fixed_total != null ? Number(offer.fixed_total) : null,
      discount_amount:
        offer.discount_amount != null ? Number(offer.discount_amount) : null,
      discount_percent:
        offer.discount_percent != null ? Number(offer.discount_percent) : null,
      items,
    });
  }
  return result;
}
