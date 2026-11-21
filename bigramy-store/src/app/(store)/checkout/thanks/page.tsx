import Link from "next/link";

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-rex font-bold tracking-widest text-sm">BIG RAMY LABS</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold">Order received</h1>
      <p className="mt-3 text-black/60">
        {order
          ? `Order #${order} is saved in your admin portal.`
          : "Your order is saved in the admin portal."}
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-white"
      >
        Back to store
      </Link>
    </div>
  );
}
