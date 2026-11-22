# BIG RAMY LABS Store + Admin (local)

Self-hosted clone of [eg.bigramylabs.com](https://eg.bigramylabs.com/en) with a Shopify-style admin for products, orders, and **specific-mix bundles** (All-In + Creatine for a fixed total — not 2× the same product).

## Run on your PC (localhost)

Needs **Node.js 20+** installed.

### Windows (Command Prompt / PowerShell)

1. Install [Node.js LTS](https://nodejs.org) and reopen the terminal.
2. Open the `bigramy-store` folder (the one with `package.json`).
3. Run:

```bat
npm install
npm run dev
```

### Mac / Linux

```bash
cd bigramy-store
npm install
npm run dev
```

Open:

- Store: **http://localhost:3000**
- Admin: **http://localhost:3000/admin**
- Offers: **http://localhost:3000/admin/offers**

To use another port:

```bat
npx next dev -p 4000
```

Then open `http://localhost:4000`.

Data is stored in-memory locally (PGlite). Restarting `npm run dev` re-seeds from `data/seed.json` when the DB is empty.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Storefront home |
| `/collections/[handle]` | Collections |
| `/products/[handle]` | Product detail |
| `/cart` · `/checkout` | Cart & checkout |
| `/admin` | Dashboard |
| `/admin/products` | Manage products |
| `/admin/offers` | Create specific-mix / volume offers |
| `/admin/orders` | View orders |
