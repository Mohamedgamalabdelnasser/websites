import { requireAdmin } from "@/lib/admin";
import { ensureSeeded, listOffers } from "@/lib/catalog";
import { sql } from "@/lib/db";

export async function GET() {
  const offers = await listOffers(true);
  return Response.json({ offers });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;
  await ensureSeeded();
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const offer_type = String(body.offer_type ?? "specific_mix");
  if (!name) return Response.json({ error: "name required" }, { status: 400 });

  const items = Array.isArray(body.items) ? body.items : [];
  if (offer_type === "specific_mix" && items.length < 2) {
    return Response.json(
      {
        error:
          "specific_mix requires at least 2 different products (e.g. All-In + Creatine)",
      },
      { status: 400 },
    );
  }

  const rows = await sql<{ id: number }>(
    `insert into offers(
       name, description, offer_type, status, fixed_total,
       discount_amount, discount_percent, min_quantity
     ) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id`,
    [
      name,
      String(body.description ?? ""),
      offer_type,
      String(body.status ?? "active"),
      body.fixed_total != null ? Number(body.fixed_total) : null,
      body.discount_amount != null ? Number(body.discount_amount) : null,
      body.discount_percent != null ? Number(body.discount_percent) : null,
      body.min_quantity != null ? Number(body.min_quantity) : null,
    ],
  );
  const offerId = rows[0].id;
  for (const item of items) {
    await sql(
      `insert into offer_items(offer_id, product_id, quantity) values ($1,$2,$3)`,
      [offerId, Number(item.product_id), Number(item.quantity ?? 1)],
    );
  }
  return Response.json({ id: offerId });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;
  const body = await request.json();
  const id = Number(body.id);
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  await sql(
    `update offers set
       name = coalesce($2, name),
       description = coalesce($3, description),
       status = coalesce($4, status),
       fixed_total = coalesce($5, fixed_total),
       discount_amount = coalesce($6, discount_amount),
       discount_percent = coalesce($7, discount_percent),
       min_quantity = coalesce($8, min_quantity),
       updated_at = now()
     where id = $1`,
    [
      id,
      body.name ?? null,
      body.description ?? null,
      body.status ?? null,
      body.fixed_total != null ? Number(body.fixed_total) : null,
      body.discount_amount != null ? Number(body.discount_amount) : null,
      body.discount_percent != null ? Number(body.discount_percent) : null,
      body.min_quantity != null ? Number(body.min_quantity) : null,
    ],
  );
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;
  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  await sql(`delete from offers where id = $1`, [id]);
  return Response.json({ ok: true });
}
