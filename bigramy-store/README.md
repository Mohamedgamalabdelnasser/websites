# BIG RAMY LABS Store + Admin (local)

Self-hosted clone of [eg.bigramylabs.com](https://eg.bigramylabs.com/en) with a Shopify-style admin for products, orders, and **specific-mix bundles** (All-In + Creatine for a fixed total — not 2× the same product).

## Run on your PC (localhost)

Needs **Node.js 20+** installed.

```bash
git clone https://github.com/Mohamedgamalabdelnasser/websites.git
cd websites/bigramy-store
git checkout cursor/bigramy-store-admin-f929
npm install
npm run dev
```

Open:

- Store: **http://localhost:3000**
- Admin: **http://localhost:3000/admin**
- Offers: **http://localhost:3000/admin/offers**

To use another port:

```bash
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
