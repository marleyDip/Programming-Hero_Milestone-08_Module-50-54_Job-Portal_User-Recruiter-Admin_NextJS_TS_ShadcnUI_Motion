import { Features } from "@/components/home/features"
import { FinalCta } from "@/components/home/final-cta"
import { Hero } from "@/components/home/hero"
import { Pricing } from "@/components/home/pricing"
import { SmartDiscovery } from "@/components/home/smart-discovery"

export default function HomePage() {
  return (
    <main>
      <Hero />

      {/* Next sections: smart discovery, features, pricing... */}

      <SmartDiscovery />

      <Features />

      <Pricing />

      <FinalCta />
    </main>
  )
}

/* Tip: move <Footer /> into app/layout.tsx to show it on every page */
