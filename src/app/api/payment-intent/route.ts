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

  const amount = 2400 * quantity; // $24.00 per unit

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: {
      product: "Ethiopia Yirgacheffe",
      quantity: String(quantity),
    },
  });

  return Response.json({ clientSecret: paymentIntent.client_secret });
}
