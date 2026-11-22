import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function shot(url, name) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1000);
  const path = `/opt/cursor/artifacts/${name}.png`;
  await page.screenshot({ path, fullPage: false });
  console.log("saved", path);
}

await shot("http://127.0.0.1:3000/", "bigramy-home");
await shot("http://127.0.0.1:3000/admin/offers", "bigramy-admin-offers");
await shot(
  "http://127.0.0.1:3000/products/red-rex-all-in-protein",
  "bigramy-product-allin",
);
await shot(
  "http://127.0.0.1:3000/collections/best-sellers",
  "bigramy-best-sellers",
);

await browser.close();
