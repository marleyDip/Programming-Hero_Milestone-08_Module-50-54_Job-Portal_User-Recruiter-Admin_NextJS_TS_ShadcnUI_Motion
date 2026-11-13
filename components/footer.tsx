"use client"

import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  type Variants,
} from "framer-motion"
import { ArrowUp, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import {
  EASE,
  SPRING,
  VIEWPORT,
  inter,
  manrope,
} from "@/components/home/shared"

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Job discovery", href: "/jobs" },
      { label: "Worker AI", href: "/worker-ai" },
      { label: "Companies", href: "/company" },
      { label: "Salary data", href: "/salary" },
    ],
  },
  {
    title: "Navigations",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Career library", href: "/library" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Brand Guideline", href: "/brand" },
      { label: "Newsroom", href: "/newsroom" },
    ],
  },
]

// Replace with your real profiles
const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "Pinterest", href: "https://pinterest.com", Icon: PinterestIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedInIcon },
]

const YEAR = new Date().getFullYear()

const colV: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

export function Footer() {
  const reduce = useReducedMotion()
  const wordRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  // Light inside the giant wordmark: follows the cursor, drifts on its own otherwise
  const lx = useMotionValue(0)
  const ly = useMotionValue(0)
  const mask = useMotionTemplate`radial-gradient(280px circle at ${lx}px ${ly}px, black 10%, transparent 75%)`

  useEffect(() => {
    const el = wordRef.current
    if (!el) return
    const w = el.offsetWidth
    ly.set(el.offsetHeight * 0.45)
    if (hovering || reduce) {
      if (reduce) lx.set(w / 2)
      return
    }
    const controls = animate(lx, [w * 0.12, w * 0.88], {
      duration: 7,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    })
    return () => controls.stop()
  }, [hovering, reduce, lx, ly])

  return (
    <footer
      className={`${manrope.className} relative bg-[#010103] px-5 pt-4 pb-8 text-white sm:px-8`}
    >
      <div
        className="relative mx-auto max-w-[1320px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.045] to-transparent"
        onMouseMove={(e) => {
          const r = wordRef.current?.getBoundingClientRect()
          if (!r) return
          lx.set(e.clientX - r.left)
          ly.set(e.clientY - r.top)
        }}
      >
        {/* top glow + hairline */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0"
        >
          <div className="mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-[#8f88ff]/60 to-transparent" />
          <div className="mx-auto -mt-px h-40 w-2/3 bg-[radial-gradient(closest-side,rgba(92,83,254,0.22),transparent)]" />
        </div>

        <div className="relative px-6 pt-12 sm:px-10 lg:px-14 lg:pt-16">
          <div className="flex flex-col gap-14 lg:flex-row lg:justify-between">
            {/* brand */}
            <motion.div
              className="max-w-[300px]"
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={colV}
            >
              <Link
                href="/"
                aria-label="Hireloop home"
                className="inline-block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
              >
                <motion.span
                  className="block"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={SPRING}
                >
                  <Image
                    src="/hireloop-logo.png"
                    alt="Hireloop"
                    width={300}
                    height={84}
                    className="h-11 w-auto"
                  />
                </motion.span>
              </Link>
              <p className="mt-6 text-base leading-relaxed text-white/80">
                The AI-native career platform. Built for people who take their
                work seriously.
              </p>
            </motion.div>

            {/* link columns */}
            <motion.nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-x-10 gap-y-12 sm:grid-cols-3 lg:gap-x-[72px]"
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={{
                show: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.1 },
                },
              }}
            >
              {COLUMNS.map((col) => (
                <motion.div key={col.title} variants={colV}>
                  <h3
                    className={`${inter.className} text-lg font-medium text-[#5c53fe]`}
                  >
                    {col.title}
                  </h3>
                  <ul className="mt-5 space-y-2">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="group/link inline-flex items-center gap-1 rounded py-1 text-base text-[#d0d5dd] transition-colors duration-200 outline-none hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
                        >
                          <span className="relative">
                            {l.label}
                            <span
                              aria-hidden
                              className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[#8f88ff] to-[#38bdf8] transition-transform duration-300 ease-out group-hover/link:scale-x-100"
                            />
                          </span>
                          <ArrowUpRight
                            className="size-3.5 -translate-x-1 translate-y-1 text-[#8f88ff] opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:translate-y-0 group-hover/link:opacity-100"
                            aria-hidden
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.nav>
          </div>

          {/* bottom bar */}
          <motion.div
            className="mt-14 flex flex-col items-start gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ul className="flex items-center gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ y: -4, scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    transition={SPRING}
                    className="grid size-10 place-items-center rounded-lg bg-white/5 text-white/80 transition-colors duration-200 outline-none hover:bg-[#5c53fe] hover:text-white hover:shadow-[0_10px_30px_-8px_rgba(92,83,254,0.9)] focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
                  >
                    <Icon className="size-5" />
                  </motion.a>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px] text-[#acabb2]">
              <p>© {YEAR} HireLoop. All rights reserved.</p>
              <div className="flex items-center gap-5">
                {[
                  { label: "Terms & Policy", href: "/terms" },
                  { label: "Privacy Guideline", href: "/privacy" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
              <BackToTop />
            </div>
          </motion.div>
        </div>

        {/* giant wordmark that lights up under the cursor */}
        <motion.div
          aria-hidden
          className="pointer-events-auto relative mt-10 overflow-hidden text-center select-none"
          initial={{ y: 70, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.1, ease: EASE }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div
            ref={wordRef}
            className="relative translate-y-[10%] text-[clamp(72px,21vw,300px)] leading-[0.8] font-extrabold tracking-[-0.05em]"
          >
            <span className="block bg-gradient-to-b from-white/[0.16] to-white/0 bg-clip-text text-transparent">
              hireloop
            </span>
            <motion.span
              className="absolute inset-0 block bg-gradient-to-r from-[#8f88ff] via-[#38bdf8] to-[#fdba74] bg-clip-text text-transparent"
              style={{ maskImage: mask, WebkitMaskImage: mask }}
            >
              hireloop
            </motion.span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

/* -------------------------------------------------------------------------- */
/*  Back to top, with a ring that fills as you scroll                         */
/* -------------------------------------------------------------------------- */

function BackToTop() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      whileHover="hover"
      whileTap={{ scale: 0.9 }}
      className="group relative grid size-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition-colors outline-none hover:bg-[#5c53fe]/25 focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
    >
      <svg
        viewBox="0 0 44 44"
        className="absolute inset-0 size-full -rotate-90"
        aria-hidden
      >
        <motion.circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          stroke="#8f88ff"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
      <motion.span
        variants={{
          hover: {
            y: [0, -3, 0],
            transition: { duration: 0.7, repeat: Infinity },
          },
        }}
      >
        <ArrowUp className="size-[18px]" aria-hidden />
      </motion.span>
    </motion.button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Brand marks (Lucide v1 no longer ships brand logos)                       */
/* -------------------------------------------------------------------------- */

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  )
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
