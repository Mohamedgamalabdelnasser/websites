import { listOffers } from "@/lib/catalog";
import { evaluateOffers } from "@/lib/offers";
import type { CartLine } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as { lines?: CartLine[] };
  const lines = body.lines ?? [];
  const offers = await listOffers(false);
  const appliedOffer = evaluateOffers(lines, offers);
  return Response.json({ appliedOffer });
}
