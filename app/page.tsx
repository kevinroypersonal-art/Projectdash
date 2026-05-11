import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Positions } from "@/components/sections/positions";
import { Comparison } from "@/components/sections/comparison";
import { Method } from "@/components/sections/method";
import { Skin } from "@/components/sections/skin";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";

export default function Page() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Positions />
      <Comparison />
      <Method />
      <Skin />
      <FinalCta />
      <Footer />
    </main>
  );
}
