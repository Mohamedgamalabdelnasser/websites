"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AppliedOffer, CartLine } from "@/lib/types";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  discount: number;
  total: number;
  appliedOffer: AppliedOffer | null;
  addLine: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  setQty: (variantId: number, quantity: number) => void;
  removeLine: (variantId: number) => void;
  clear: () => void;
  refreshOffers: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bigramy-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [appliedOffer, setAppliedOffer] = useState<AppliedOffer | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const refreshOffers = useCallback(async () => {
    if (lines.length === 0) {
      setAppliedOffer(null);
      return;
    }
    try {
      const res = await fetch("/api/cart/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = (await res.json()) as { appliedOffer: AppliedOffer | null };
      setAppliedOffer(data.appliedOffer);
    } catch {
      setAppliedOffer(null);
    }
  }, [lines]);

  useEffect(() => {
    void refreshOffers();
  }, [refreshOffers]);

  const addLine = useCallback(
    (line: Omit<CartLine, "quantity"> & { quantity?: number }) => {
      setLines((prev) => {
        const qty = line.quantity ?? 1;
        const idx = prev.findIndex((l) => l.variantId === line.variantId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
          return next;
        }
        return [...prev, { ...line, quantity: qty }];
      });
    },
    [],
  );

  const setQty = useCallback((variantId: number, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          l.variantId === variantId ? { ...l, quantity: Math.max(0, quantity) } : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const removeLine = useCallback((variantId: number) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.price * l.quantity, 0),
    [lines],
  );
  const discount = appliedOffer?.discount ?? 0;
  const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100);
  const count = lines.reduce((s, l) => s + l.quantity, 0);

  const value = useMemo(
    () => ({
      lines,
      count,
      subtotal,
      discount,
      total,
      appliedOffer,
      addLine,
      setQty,
      removeLine,
      clear,
      refreshOffers,
    }),
    [
      lines,
      count,
      subtotal,
      discount,
      total,
      appliedOffer,
      addLine,
      setQty,
      removeLine,
      clear,
      refreshOffers,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
