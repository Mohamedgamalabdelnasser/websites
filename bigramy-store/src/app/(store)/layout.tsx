import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </>
  );
}
