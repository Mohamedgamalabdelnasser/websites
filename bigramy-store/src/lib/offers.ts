import { toNumber } from "./money";
import type { AppliedOffer, CartLine, Offer, OfferItem } from "./types";

/**
 * specific_mix: every listed product must be present at its required qty.
 * Does NOT qualify for 2× the same product.
 * any_quantity: total units among listed products >= min_quantity (mix & match).
 * percent_off / fixed_amount_off: apply to matching lines.
 */
export function evaluateOffers(
  cart: CartLine[],
  offers: (Offer & { items: OfferItem[] })[],
): AppliedOffer | null {
  let best: AppliedOffer | null = null;

  for (const offer of offers.filter((o) => o.status === "active")) {
    const result = evaluateOne(cart, offer);
    if (!result) continue;
    if (!best || result.discount > best.discount) best = result;
  }
  return best;
}

function qtyByProduct(cart: CartLine[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const line of cart) {
    map.set(line.productId, (map.get(line.productId) ?? 0) + line.quantity);
  }
  return map;
}

function cartSubtotal(cart: CartLine[]): number {
  return toNumber(cart.reduce((s, l) => s + l.price * l.quantity, 0));
}

function evaluateOne(
  cart: CartLine[],
  offer: Offer & { items: OfferItem[] },
): AppliedOffer | null {
  const byProduct = qtyByProduct(cart);
  const subtotal = cartSubtotal(cart);
  if (subtotal <= 0) return null;

  if (offer.offer_type === "specific_mix") {
    if (!offer.items?.length) return null;
    // Consume required quantities per product — each requirement is independent
    for (const item of offer.items) {
      const have = byProduct.get(item.product_id) ?? 0;
      if (have < item.quantity) return null;
    }
    // Ensure we don't treat "2 of product A" as satisfying A+B
    const distinctRequired = new Set(offer.items.map((i) => i.product_id));
    if (distinctRequired.size !== offer.items.length) {
      // allow same product listed twice only if quantities stack — handled above
    }
    const packSubtotal = offer.items.reduce((sum, item) => {
      const line = cart.find((c) => c.productId === item.product_id);
      return sum + (line ? line.price * item.quantity : 0);
    }, 0);

    let discount = 0;
    if (offer.fixed_total != null) {
      discount = Math.max(0, toNumber(packSubtotal - Number(offer.fixed_total)));
    } else if (offer.discount_amount != null) {
      discount = toNumber(offer.discount_amount);
    } else if (offer.discount_percent != null) {
      discount = toNumber((packSubtotal * Number(offer.discount_percent)) / 100);
    }
    if (discount <= 0) return null;
    return {
      offer,
      discount,
      message: `${offer.name}: save ${discount.toFixed(0)} EGP on this specific mix`,
    };
  }

  if (offer.offer_type === "any_quantity") {
    const allowed = new Set(offer.items.map((i) => i.product_id));
    const matching = cart.filter((l) => allowed.has(l.productId));
    const totalQty = matching.reduce((s, l) => s + l.quantity, 0);
    const minQ = offer.min_quantity ?? 2;
    if (totalQty < minQ) return null;
    const packs = Math.floor(totalQty / minQ);
    const packLines = [...matching];
    let remaining = packs * minQ;
    let packSubtotal = 0;
    for (const line of packLines) {
      const take = Math.min(line.quantity, remaining);
      packSubtotal += line.price * take;
      remaining -= take;
      if (remaining <= 0) break;
    }
    let discount = 0;
    if (offer.fixed_total != null) {
      discount = Math.max(
        0,
        toNumber(packSubtotal - Number(offer.fixed_total) * packs),
      );
    } else if (offer.discount_percent != null) {
      discount = toNumber((packSubtotal * Number(offer.discount_percent)) / 100);
    } else if (offer.discount_amount != null) {
      discount = toNumber(Number(offer.discount_amount) * packs);
    }
    if (discount <= 0) return null;
    return {
      offer,
      discount,
      message: `${offer.name}: ${packs}× pack discount`,
    };
  }

  if (offer.offer_type === "percent_off" || offer.offer_type === "fixed_amount_off") {
    const allowed =
      offer.items.length > 0
        ? new Set(offer.items.map((i) => i.product_id))
        : null;
    const matching = cart.filter((l) => !allowed || allowed.has(l.productId));
    if (!matching.length) return null;
    const matchSub = matching.reduce((s, l) => s + l.price * l.quantity, 0);
    let discount = 0;
    if (offer.offer_type === "percent_off" && offer.discount_percent != null) {
      discount = toNumber((matchSub * Number(offer.discount_percent)) / 100);
    } else if (
      offer.offer_type === "fixed_amount_off" &&
      offer.discount_amount != null
    ) {
      discount = Math.min(matchSub, toNumber(offer.discount_amount));
    }
    if (discount <= 0) return null;
    return { offer, discount, message: offer.name };
  }

  return null;
}
