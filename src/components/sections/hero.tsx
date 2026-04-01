"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { CoffeeModel } from "@/components/coffee-model";
import { springs } from "@/lib/motion";
import ApplePayButton from "apple-pay-button";
import { Trust } from "@/components/sections/trust";

const MotionButton = motion.create(Button);

type CartState = "idle" | "quantity" | "ready";

const interactionSpring = { type: "spring" as const, stiffness: 300, damping: 30 };

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
              className="flex items-center gap-6"
            >
              <span className="text-3xl font-bold tracking-tight">$24</span>
              <motion.div layout transition={interactionSpring} className="flex items-center gap-3">
                <MotionButton
                  layout
                  size="lg"
                  transition={interactionSpring}
                  className={`cursor-pointer w-[10rem] transition-colors duration-200 ${
                    cartState === "ready"
                      ? "!bg-[#6366f1] hover:!bg-[#4f46e5]"
                      : ""
                  }`}
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
                      transition={{ duration: 0.15 }}
                    >
                      {cartState === "ready" ? "Checkout" : "Add to Cart"}
                    </motion.span>
                  </AnimatePresence>
                </MotionButton>
                <AnimatePresence>
                  {cartState !== "idle" && (
                    <motion.div
                      layout
                      initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95, width: 0 }}
                      animate={{ opacity: 1, scale: 1, width: "auto" }}
                      exit={{ opacity: 0, scale: 0.95, width: 0 }}
                      transition={interactionSpring}
                      className="relative overflow-hidden"
                    >
                      <AnimatePresence mode="wait">
                        {cartState === "quantity" && (
                          <motion.div
                            key="qty"
                            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <span className="absolute -top-4 left-0 text-[10px] text-muted-foreground/40 tracking-wide">
                              Select Quantity
                            </span>
                            <div className="flex h-11 w-[10rem] rounded-xl border border-border overflow-hidden">
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
                        {cartState === "ready" && (
                          <motion.div
                            key="applepay"
                            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                          >
                            <ApplePayButton
                              type="pay"
                              buttonStyle="black"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
