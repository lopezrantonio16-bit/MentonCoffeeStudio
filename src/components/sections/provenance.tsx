"use client";

import { motion, useReducedMotion } from "motion/react";
import { springs } from "@/lib/motion";

const facts = [
  { label: "Region", value: "Gedeo, Yirgacheffe" },
  { label: "Altitude", value: "1,850 – 1,950 m" },
  { label: "Variety", value: "Heirloom Ethiopian" },
  { label: "Process", value: "Fully Washed" },
  { label: "Harvest", value: "November – January" },
];

export function Provenance() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="px-6 pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-sm font-medium text-muted-foreground mb-8">
          Origin
        </h2>

        <div className="grid gap-12 md:grid-cols-3">
          {/* Narrative — wide left, 2/3 */}
          <div className="md:col-span-2">
            <p className="text-base leading-relaxed text-muted-foreground">
              This coffee comes from a cooperative of smallholder farmers
              in the Gedeo zone of southern Ethiopia, where coffee has been
              cultivated for centuries under the shade of native forest canopy.
              The volcanic soil and high altitude produce a dense, complex
              cherry that develops slowly through the dry season. Each lot
              is hand-sorted, fermented for 36 hours, and dried over two weeks
              on raised African beds.
            </p>
          </div>

          {/* Facts — narrow right, 1/3 */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...springs.gentle }}
            className="border-l border-border pl-6"
          >
            <dl className="space-y-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-sm text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="text-sm font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
