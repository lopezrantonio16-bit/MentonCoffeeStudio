import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Order Confirmed — Menton Coffee Studio",
};

export default function CheckoutSuccess() {
  return (
    <main className="min-h-svh flex flex-col items-center justify-center px-6 text-center">
      <Image
        src="/logo.svg"
        alt="Menton Coffee Studio"
        width={96}
        height={96}
        className="mb-8 w-16 h-auto md:w-24"
        priority
      />
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Thank you for your order
      </h1>
      <p className="mt-3 text-base text-muted-foreground max-w-sm">
        We&apos;ll roast your beans fresh and ship within 48 hours. A
        confirmation email is on its way.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      >
        Back to shop
      </Link>
    </main>
  );
}
