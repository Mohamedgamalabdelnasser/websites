import { requireAdmin } from "@/lib/admin";
import { seedFromFile } from "@/lib/catalog";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";
  const result = await seedFromFile(force);
  return Response.json({ ok: true, ...result, force });
}
