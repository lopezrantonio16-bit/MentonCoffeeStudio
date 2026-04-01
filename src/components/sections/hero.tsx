"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { CoffeeModel } from "@/components/coffee-model";
import { springs } from "@/lib/motion";
import ApplePayButton from "apple-pay-button";

const MotionButton = motion.create(Button);

type CartState = "idle" | "quantity" | "ready";

const interactionSpring = { type: "spring" as const, stiffness: 300, damping: 35 };

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [cartState, setCartState] = useState<CartState>("idle");
  const [selectedQty, setSelectedQty] = useState<number | null>(null);
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
    <section className="px-6 pt-6 pb-4 min-h-svh md:min-h-0 md:pt-40 md:pb-2 flex flex-col">
      <div className="mx-auto max-w-4xl w-full flex-1 flex flex-col">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 items-center flex-1 md:-translate-y-[10px]">
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
          <div className="order-2 md:order-2 flex flex-col gap-5 min-w-0 md:self-center">
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
              <p className="text-base leading-relaxed text-muted-foreground">
                Grown at 1,900 meters in the Gedeo zone. Hand-picked,
                washed, and sun-dried on raised beds. Roasted weekly
                in small batches.
              </p>
            </motion.div>

            <motion.div
              initial={initial}
              animate={animate ?? visible}
              transition={{ ...springs.smooth, delay: prefersReducedMotion ? 0 : 0.2 }}
              className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6"
            >
              <span className="text-3xl font-bold tracking-tight">$24</span>
              <div className="flex flex-col gap-3 w-full md:flex-row md:items-center md:w-auto">
                <MotionButton
                  className="cursor-pointer w-full md:flex-none md:w-[8.5rem] h-9 px-6 text-sm"
                  onClick={() => {
                    if (cartState === "idle") setCartState("quantity");
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
                      transition={{ duration: 0.1 }}
                    >
                      {cartState === "ready" ? "Checkout" : "Add to Cart"}
                    </motion.span>
                  </AnimatePresence>
                </MotionButton>
                <AnimatePresence>
                  {cartState !== "idle" && (
                    <motion.div
                      initial={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={interactionSpring}
                      className="relative w-full md:flex-none md:w-[8.5rem] overflow-hidden"
                    >
                      <div className="relative h-9 flex items-center">
                        <AnimatePresence>
                          {cartState === "quantity" && (
                            <motion.div
                              key="qty"
                              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={interactionSpring}
                              className="absolute inset-0"
                            >
                              <span className="absolute -top-4 left-0 text-[10px] text-muted-foreground/40 tracking-wide">
                                Select Quantity
                              </span>
                              <div className="inline-flex h-9 w-full rounded-lg border border-border overflow-hidden">
                                {[1, 2, 3].map((n) => (
                                  <button
                                    key={n}
                                    className={`cursor-pointer h-full flex-1 text-sm font-medium transition-colors ${
                                      selectedQty === n
                                        ? "bg-black text-white"
                                        : "bg-background text-foreground hover:bg-muted"
                                    }`}
                                    onClick={() => {
                                      setSelectedQty(n);
                                      setTimeout(() => setCartState("ready"), 200);
                                    }}
                                  >
                                    {n}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                          {cartState === "ready" && (
                            <motion.div
                              key="applepay"
                              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ ...interactionSpring, delay: 0.4 }}
                              className="absolute inset-0"
                            >
                              <ApplePayButton
                                type="pay"
                                buttonStyle="black"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "0.75rem",
                                }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
