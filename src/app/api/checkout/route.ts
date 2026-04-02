import Stripe from "stripe";

export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "sk_test_REPLACE_ME") {
    return Response.json(
      { error: "Stripe is not configured yet" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(key);

  const { quantity } = (await request.json()) as { quantity: number };

  if (![1, 2, 3].includes(quantity)) {
    return Response.json({ error: "Invalid quantity" }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 2400, // $24.00
          product_data: {
            name: "Ethiopia Yirgacheffe",
            description: "Single Origin · Washed · 12 oz",
          },
        },
        quantity,
      },
    ],
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: origin,
  });

  return Response.json({ url: session.url });
}
