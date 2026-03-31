import { Hero } from "@/components/sections/hero";
import { Provenance } from "@/components/sections/provenance";
import { TheCup } from "@/components/sections/the-cup";
import { SiteFooter } from "@/components/sections/site-footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Provenance />
      <TheCup />
      <SiteFooter />
    </main>
  );
}
