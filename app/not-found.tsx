import type { Metadata } from "next"

import { NotFoundParticles } from "@/components/not-found-particles"

export const metadata: Metadata = {
  title: "Page not found | Hireloop",
  description: "The page you're looking for doesn't exist or has moved.",
}

// Rendered for every URL that matches no route, and whenever notFound() is called.
// Next.js returns a 404 status and adds noindex automatically.
export default function NotFound() {
  return <NotFoundParticles />
}
