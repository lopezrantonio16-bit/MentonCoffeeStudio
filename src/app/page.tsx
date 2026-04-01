import Image from "next/image";
import { Hero } from "@/components/sections/hero";
import { Trust } from "@/components/sections/trust";
import { Provenance } from "@/components/sections/provenance";
import { TheCup } from "@/components/sections/the-cup";
import { SiteFooter } from "@/components/sections/site-footer";

export default function Home() {
  return (
    <main>
      <div className="fixed top-3 left-3 z-50 md:top-4 md:left-4">
        <Image src="/logo.svg" alt="Menton Coffee Studio" width={128} height={128} className="w-[84px] h-auto md:w-[128px]" priority />
      </div>
      <Hero />
      <Trust />
      <Provenance />
      <TheCup />
      <SiteFooter />
    </main>
  );
}
