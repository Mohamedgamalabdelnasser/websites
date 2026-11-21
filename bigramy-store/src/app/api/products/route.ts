import { requireAdmin } from "@/lib/admin";
import { ensureSeeded, listProducts } from "@/lib/catalog";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const all = url.searchParams.get("all") === "1";
  if (all) {
    const admin = await requireAdmin(request);
    if (admin instanceof Response) return admin;
    const products = await listProducts({ status: "active" });
    const draft = await listProducts({ status: "draft" });
    return Response.json({ products: [...products, ...draft] });
  }
  const products = await listProducts();
  return Response.json({ products });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;
  await ensureSeeded();
  const body = await request.json();
  const handle = String(body.handle ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");
  const title = String(body.title ?? "").trim();
  if (!handle || !title) {
    return Response.json({ error: "title and handle required" }, { status: 400 });
  }
  const images = Array.isArray(body.images) ? body.images : [];
  const price = Number(body.price ?? 0);
  const compare = body.compare_at_price != null ? Number(body.compare_at_price) : null;
  const rows = await sql<{ id: number }>(
    `insert into products(handle, title, vendor, product_type, tags, body_html, body_text, images, options, status)
     values ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,'[]'::jsonb,$9)
     returning id`,
    [
      handle,
      title,
      String(body.vendor ?? "RED REX"),
      String(body.product_type ?? ""),
      Array.isArray(body.tags) ? body.tags : [],
      String(body.body_html ?? ""),
      String(body.body_text ?? body.body_html ?? ""),
      JSON.stringify(images),
      String(body.status ?? "active"),
    ],
  );
  await sql(
    `insert into variants(product_id, title, price, compare_at_price, sku, available)
     values ($1,'Default',$2,$3,$4,true)`,
    [rows[0].id, price, compare, String(body.sku ?? "")],
  );
  return Response.json({ id: rows[0].id, handle });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;
  const body = await request.json();
  const id = Number(body.id);
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  await sql(
    `update products set
       title = coalesce($2, title),
       status = coalesce($3, status),
       body_text = coalesce($4, body_text),
       images = coalesce($5::jsonb, images),
       updated_at = now()
     where id = $1`,
    [
      id,
      body.title ?? null,
      body.status ?? null,
      body.body_text ?? null,
      body.images ? JSON.stringify(body.images) : null,
    ],
  );
  if (body.price != null) {
    await sql(`update variants set price = $2 where product_id = $1`, [
      id,
      Number(body.price),
    ]);
  }
  return Response.json({ ok: true });
}
