"use client";

import { useState } from "react";

export function SeedButton() {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(force: boolean) {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(`/api/seed${force ? "?force=1" : ""}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failed");
      setMsg(`Seeded ${data.products} products${force ? " (reset)" : ""}.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Seed failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => void run(false)}
        className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold disabled:opacity-50"
      >
        Re-import catalog if empty
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          if (
            confirm(
              "Reset all products, offers, and orders, then re-import from seed?",
            )
          ) {
            void run(true);
          }
        }}
        className="rounded-full border border-sale/50 text-sale px-4 py-2 text-xs font-semibold disabled:opacity-50"
      >
        Force reset &amp; re-import
      </button>
      {msg && <span className="text-xs text-white/60">{msg}</span>}
    </div>
  );
}
