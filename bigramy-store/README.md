# BIG RAMY LABS Store + Admin

A self-hosted clone of [eg.bigramylabs.com](https://eg.bigramylabs.com/en) with a Shopify-style admin portal for products, orders, and **unrestricted bundle offers**.

## Why

Qikify Multibuy / volume discounts treat “buy 2 for 2000” as *any* 2 items from a product list, so 2× All-In or 2× Creatine also got the deal.

This admin supports **`specific_mix`** offers: every required product must be in the cart (e.g. All-In **and** Creatine for a fixed total of EGP 2000).

## Stack

- Next.js App Router + Tailwind
- Postgres (Cursor Apps database) / PGlite locally
- Catalog seeded from the live Shopify store JSON API

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Routes

| Path | Purpose |
|------|---------|
| `/` | Storefront home |
| `/collections/[handle]` | Collections |
| `/products/[handle]` | Product detail |
| `/cart` · `/checkout` | Cart & demo checkout |
| `/admin` | Dashboard |
| `/admin/products` | Manage products |
| `/admin/offers` | Create specific-mix / volume offers |
| `/admin/orders` | View orders |

Publish as a **private** or **team** Cursor app so admin write APIs are gated by Cursor identity.
