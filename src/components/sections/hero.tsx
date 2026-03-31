"use client";

import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { CoffeeModel } from "@/components/coffee-model";
import { springs } from "@/lib/motion";

const MotionButton = motion.create(Button);

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

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
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
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
          <div className="order-2 md:order-2 flex flex-col gap-8">
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
              <MotionButton
                size="lg"
                className="cursor-pointer"
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
                Add to Cart
              </MotionButton>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
