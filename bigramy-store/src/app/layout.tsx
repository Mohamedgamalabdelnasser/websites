import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BIG RAMY LABS | GO BIG OR GO HOME!",
  description:
    "RED REX supplements storefront with an unrestricted offers & bundles admin portal.",
  openGraph: {
    title: "BIG RAMY LABS | GO BIG OR GO HOME!",
    images: ["/brand/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} font-sans antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
