"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { springs } from "@/lib/motion";
import {
  loadStripe,
  type Stripe,
  type PaymentRequest,
  type PaymentRequestPaymentMethodEvent,
} from "@stripe/stripe-js";
import ApplePayButton from "apple-pay-button";
import { Trust } from "@/components/sections/trust";

const CoffeeModel = dynamic(
  () => import("@/components/coffee-model").then((mod) => mod.CoffeeModel),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-square md:aspect-[6/5] max-w-2xl mx-auto flex items-center justify-center">
        <div className="h-5 w-5 rounded-full border-2 border-foreground/20 border-t-foreground/60 animate-spin" />
      </div>
    ),
  }
);

const MotionButton = motion.create(Button);

type CartState = "idle" | "quantity" | "ready";

const interactionSpring = { type: "spring" as const, stiffness: 300, damping: 30 };

async function redirectToCheckout(quantity: number) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) return;
  const { url } = await res.json();
  if (url) window.location.href = url;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [cartState, setCartState] = useState<CartState>("idle");
  const [selectedQty, setSelectedQty] = useState<number | null>(null);
  const stripeRef = useRef<Stripe | null>(null);
  const paymentRequestRef = useRef<PaymentRequest | null>(null);
  const [applePayAvailable, setApplePayAvailable] = useState(false);

  // Initialize Stripe + check Apple Pay availability
  useEffect(() => {
    stripePromise.then((stripe) => {
      if (!stripe) return;
      stripeRef.current = stripe;
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: { label: "Ethiopia Yirgacheffe", amount: 2400 },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      pr.canMakePayment().then((result) => {
        if (result?.applePay) {
          setApplePayAvailable(true);
          paymentRequestRef.current = pr;
        }
      });
    });
  }, []);

  // Update payment request amount when quantity changes
  useEffect(() => {
    if (paymentRequestRef.current && selectedQty) {
      paymentRequestRef.current.update({
        total: {
          label: `Ethiopia Yirgacheffe × ${selectedQty}`,
          amount: 2400 * selectedQty,
        },
      });
    }
  }, [selectedQty]);

  const handleApplePay = useCallback(async () => {
    const pr = paymentRequestRef.current;
    if (!pr || !selectedQty) return;

    // Listen for the payment method event
    const handler = async (ev: PaymentRequestPaymentMethodEvent) => {
      const res = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: selectedQty }),
      });

      if (!res.ok) {
        ev.complete("fail");
        return;
      }

      const { clientSecret } = await res.json();
      const stripe = stripeRef.current!;
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: ev.paymentMethod.id,
      });

      if (error) {
        ev.complete("fail");
      } else {
        ev.complete("success");
        window.location.href = "/checkout/success";
      }
    };

    pr.on("paymentmethod", handler);
    pr.show();
  }, [selectedQty]);

  // Preload Apple Pay SDK so button renders
  useEffect(() => {
    const scriptId = "apple-pay-sdk-script";
    if (document.getElementById(scriptId)) return;
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const animate = prefersReducedMotion
    ? { opacity: 1, y: 0, scale: 1 }
    : undefined;

  const initial = prefersReducedMotion
    ? undefined
    : { opacity: 0, y: 20 };

  const imageInitial = prefersReducedMotion
    ? undefined
    : { opacity: 0, scale: 0.98 };

  const visible = { opacity: 1, y: 0 };
  const imageVisible = { opacity: 1, scale: 1 };

  return (
    <section className="px-6 pt-6 pb-6 min-h-svh md:min-h-0 md:pt-14 md:pb-6 flex flex-col">
      <div className="mx-auto max-w-4xl flex-1 flex flex-col">
        <div className="grid gap-4 md:grid-cols-2 md:gap-10 items-center flex-1">
          {/* Product image — dominant, left */}
          <motion.div
            initial={imageInitial}
            animate={animate ?? imageVisible}
            transition={{ ...springs.smooth, delay: prefersReducedMotion ? 0 : 0.05 }}
            className="order-1 md:order-1"
          >
            <CoffeeModel />
          </motion.div>

          {/* Text + CTA — subordinate, right */}
          <div className="order-2 md:order-2 flex flex-col gap-5">
            {/* Trust strip — mobile only, above title */}
            <div className="md:hidden">
              <Trust />
            </div>

            <motion.div
              initial={initial}
              animate={animate ?? visible}
              transition={{ ...springs.smooth, delay: prefersReducedMotion ? 0 : 0 }}
            >
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Ethiopia Yirgacheffe
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Single Origin · Washed · 12 oz
              </p>
            </motion.div>

            <motion.div
              initial={initial}
              animate={animate ?? visible}
              transition={{ ...springs.smooth, delay: prefersReducedMotion ? 0 : 0.1 }}
            >
              <p className="text-base leading-relaxed text-muted-foreground max-w-sm">
                Grown at 1,900 meters in the Gedeo zone. Hand-picked,
                washed, and sun-dried on raised beds. Roasted weekly
                in small batches.
              </p>
            </motion.div>

            <motion.div
              initial={initial}
              animate={animate ?? visible}
              transition={{ ...springs.smooth, delay: prefersReducedMotion ? 0 : 0.2 }}
              className="flex items-center gap-5 sm:gap-6"
            >
              <span className="text-3xl font-bold tracking-tight">$24</span>
              <div className="flex items-center gap-2 sm:gap-3">
                <MotionButton
                  size="lg"
                  transition={interactionSpring}
                  className={`cursor-pointer w-32 sm:w-[8.5rem] transition-colors duration-200 ${
                    cartState === "ready"
                      ? "!bg-[#6366f1] hover:!bg-[#4f46e5]"
                      : ""
                  }`}
                  onClick={() => {
                    if (cartState === "idle") setCartState("quantity");
                    if (cartState === "ready" && selectedQty) redirectToCheckout(selectedQty);
                  }}
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : { scale: 1.015, transition: springs.snappy }
                  }
                  whileTap={
                    prefersReducedMotion
                      ? undefined
                      : { scale: 0.985, transition: springs.snappy }
                  }
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={cartState === "ready" ? "checkout" : "add"}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                    >
                      {cartState === "ready" ? "Checkout" : "Add to Cart"}
                    </motion.span>
                  </AnimatePresence>
                </MotionButton>
                <motion.div
                  initial={false}
                  animate={{
                    opacity: cartState === "quantity" || (cartState === "ready" && applePayAvailable) ? 1 : 0,
                  }}
                  transition={interactionSpring}
                  className={`relative h-10 w-36 sm:w-[8.5rem] overflow-visible rounded-lg ${
                    cartState === "idle" || (cartState === "ready" && !applePayAvailable) ? "pointer-events-none" : ""
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {cartState === "quantity" && (
                      <motion.div
                        key="qty"
                        initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={springs.gentle}
                        className="absolute inset-0"
                      >
                        <span className="absolute -top-4 left-0 text-[10px] text-muted-foreground/40 tracking-wide">
                          Select Quantity
                        </span>
                        <div className="flex h-10 w-full rounded-lg border border-border overflow-hidden">
                          {[1, 2, 3].map((n) => (
                            <button
                              key={n}
                              className={`cursor-pointer h-full flex-1 text-sm font-medium transition-colors ${
                                selectedQty === n
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-background text-foreground hover:bg-muted"
                              }`}
                              onClick={() => {
                                setSelectedQty(n);
                                setTimeout(() => setCartState("ready"), 180);
                              }}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    {cartState === "ready" && applePayAvailable && (
                      <motion.div
                        key="applepay"
                        initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={springs.smooth}
                        className="absolute inset-0"
                      >
                        <style>{`apple-pay-button { display: block !important; width: 100% !important; }`}</style>
                        <div
                          onClick={handleApplePay}
                          className="cursor-pointer"
                        >
                          <div className="pointer-events-none">
                            <ApplePayButton
                              type="pay"
                              buttonStyle="black"
                              style={{
                                width: "100%",
                                height: "2.5rem",
                                borderRadius: "0.5rem",
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
