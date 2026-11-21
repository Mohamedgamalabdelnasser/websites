import { listOffers } from "@/lib/catalog";
import { sql } from "@/lib/db";
import { evaluateOffers } from "@/lib/offers";
import { toNumber } from "@/lib/money";
import { requireAdmin } from "@/lib/admin";
import type { CartLine } from "@/lib/types";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;
  const rows = await sql(
    `select id, customer_name, customer_phone, customer_address, notes,
            subtotal::float as subtotal, discount::float as discount,
            total::float as total, currency, offer_name, items, status,
            created_at::text as created_at
     from orders order by id desc limit 100`,
  );
  return Response.json({ orders: rows });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    customer_name?: string;
    customer_phone?: string;
    customer_address?: string;
    notes?: string;
    lines?: CartLine[];
  };
  const lines = body.lines ?? [];
  if (!lines.length) {
    return Response.json({ error: "Cart is empty" }, { status: 400 });
  }
  const name = String(body.customer_name ?? "").trim();
  const phone = String(body.customer_phone ?? "").trim();
  const address = String(body.customer_address ?? "").trim();
  if (!name || !phone || !address) {
    return Response.json({ error: "Missing customer fields" }, { status: 400 });
  }

  const subtotal = toNumber(
    lines.reduce((s, l) => s + Number(l.price) * Number(l.quantity), 0),
  );
  const offers = await listOffers(false);
  const applied = evaluateOffers(lines, offers);
  const discount = applied?.discount ?? 0;
  const total = toNumber(Math.max(0, subtotal - discount));

  const rows = await sql<{ id: number }>(
    `insert into orders(
       customer_name, customer_phone, customer_address, notes,
       subtotal, discount, total, currency, offer_id, offer_name, items, status
     ) values ($1,$2,$3,$4,$5,$6,$7,'EGP',$8,$9,$10::jsonb,'pending')
     returning id`,
    [
      name,
      phone,
      address,
      String(body.notes ?? ""),
      subtotal,
      discount,
      total,
      applied?.offer.id ?? null,
      applied?.offer.name ?? null,
      JSON.stringify(lines),
    ],
  );

  return Response.json({ id: rows[0].id, total, discount });
}
