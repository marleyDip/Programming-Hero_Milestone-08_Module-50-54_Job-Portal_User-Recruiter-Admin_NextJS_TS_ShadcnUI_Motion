"use client"

import {
  MotionConfig,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const EASE = [0.22, 1, 0.36, 1] as const
const SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}

const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

const QUICK_LINKS = [
  { label: "Companies", href: "/company" },
  { label: "Pricing", href: "/pricing" },
  { label: "Career advice", href: "/advice" },
]

export function NotFoundView() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  // Pointer position, normalised to -0.5..0.5, drives parallax + spotlight.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useMotionValue(-999)
  const sy = useMotionValue(-999)
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, rgba(92,83,254,0.16), transparent 70%)`

  return (
    <MotionConfig reducedMotion="user">
      <main
        className="relative isolate flex min-h-[calc(100dvh-4.25rem)] flex-col items-center justify-center overflow-hidden px-6 py-20 font-sans"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          px.set((e.clientX - r.left) / r.width - 0.5)
          py.set((e.clientY - r.top) / r.height - 0.5)
          sx.set(e.clientX - r.left)
          sy.set(e.clientY - r.top)
        }}
      >
        <Backdrop spotlight={spotlight} />

        {/* Floating "filled" job cards (desktop only) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden md:block"
        >
          <FloatingCard
            className="top-[22%] left-[7%]"
            depth={26}
            delay={0}
            px={px}
            py={py}
            title="Senior product designer"
            meta="Remote"
          />

          <FloatingCard
            className="top-[28%] right-[8%]"
            depth={38}
            delay={0.8}
            px={px}
            py={py}
            title="Frontend engineer"
            meta="Hybrid · $95k"
          />

          <FloatingCard
            className="bottom-[16%] left-[13%]"
            depth={46}
            delay={1.4}
            px={px}
            py={py}
            title="Marketing manager"
            meta="On-site"
          />

          <FloatingCard
            className="right-[11%] bottom-[20%]"
            depth={20}
            delay={0.4}
            px={px}
            py={py}
            title="Data analyst"
            meta="Remote"
          />
        </div>

        <motion.div
          className="relative z-10 flex max-w-xl flex-col items-center text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={rise}>
            <FourOhFour />
          </motion.div>

          <motion.span
            variants={rise}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3.5 py-1.5 text-[13px] text-[#c4c4cc] backdrop-blur-md"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400/70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-amber-400" />
            </span>
            Error 404 · Page not found
          </motion.span>

          <motion.h1
            variants={rise}
            className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            This position has been filled
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-3 max-w-md text-[15px] leading-relaxed text-[#a0a0ab] sm:text-base"
          >
            The page you&apos;re looking for doesn&apos;t exist or has moved.
            Search for something else, or head back and keep looking.
          </motion.p>

          {/* Search */}
          <motion.form
            variants={rise}
            role="search"
            className="mt-8 w-full"
            onSubmit={(e) => {
              e.preventDefault()
              const q = query.trim()

              router.push(q ? `/jobs?q=${encodeURIComponent(q)}` : "/jobs")
            }}
          >
            <label htmlFor="nf-search" className="sr-only">
              Search jobs
            </label>

            <div className="group relative flex items-center rounded-2xl border border-white/10 bg-white/4 p-1.5 pl-4 backdrop-blur-md transition-all duration-300 focus-within:border-[#5c53fe]/60 focus-within:bg-white/6 focus-within:shadow-[0_0_0_4px_rgba(92,83,254,0.15),0_10px_40px_-10px_rgba(92,83,254,0.5)]">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="size-5 shrink-0 text-[#828997] transition-colors group-focus-within:text-[#8f88ff]"
                aria-hidden
              >
                <circle
                  cx="9"
                  cy="9"
                  r="5.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="m13.5 13.5 3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>

              <input
                id="nf-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs, skills or companies"
                autoComplete="off"
                className="h-11 min-w-0 flex-1 bg-transparent px-3 text-[15px] text-white placeholder:text-[#6b6b75] focus:outline-none"
              />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                className="h-11 shrink-0 rounded-xl bg-[#5c53fe] px-5 text-[15px] font-medium text-[#ededef] shadow-[inset_0_3px_10px_rgba(255,255,255,0.22)] transition-colors outline-none hover:bg-[#6a62ff] focus-visible:ring-2 focus-visible:ring-[#c9c5ff]"
              >
                Search
              </motion.button>
            </div>
          </motion.form>

          {/* Actions */}
          <motion.div
            variants={rise}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
            >
              <Link
                href="/"
                className="group relative isolate grid h-11 place-items-center overflow-hidden rounded-xl bg-white px-5 text-[15px] font-medium text-[#0c0c0f] outline-none focus-visible:ring-2 focus-visible:ring-[#c9c5ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0f]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-[#5c53fe]/25 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100"
                />
                Back to home
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
            >
              <Link
                href="/jobs"
                className="grid h-11 place-items-center rounded-xl border border-white/10 bg-white/3 px-5 text-[15px] font-medium text-white transition-colors outline-none hover:border-white/20 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
              >
                Browse jobs
              </Link>
            </motion.div>
          </motion.div>

          <motion.ul
            variants={rise}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-sm text-[#828997]"
          >
            <li className="mr-1">Or try:</li>
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-md px-2 py-1 text-[#a0a0ab] transition-colors outline-none hover:bg-white/6 hover:text-white focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </main>
    </MotionConfig>
  )
}

/** Ambient background: aurora, masked grid, cursor spotlight. */
function Backdrop({ spotlight }: { spotlight: MotionValue<string> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        className="absolute top-[8%] left-1/2 h-90 w-155 -translate-x-1/2 rounded-full bg-[#5c53fe]/30 blur-[120px]"
        animate={{ x: [-60, 60, -60], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[6%] -left-24 h-75 w-105 rounded-full bg-[#0ea5e9]/20 blur-[110px]"
        animate={{ x: [0, 80, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -right-24 bottom-[10%] h-75 w-105 rounded-full bg-[#f97316]/15 blur-[110px]"
        animate={{ x: [0, -80, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 60% 55% at 50% 45%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 55% at 50% 45%, black, transparent 75%)",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{ background: spotlight }}
      />
    </div>
  )
}

/** A big 404 whose zero is a glowing loop that draws itself, with a dot orbiting it. */
function FourOhFour() {
  const digit =
    "bg-gradient-to-b from-white via-white/80 to-white/20 bg-clip-text text-transparent"
  return (
    <div
      role="img"
      aria-label="404"
      className="flex items-center justify-center gap-[0.04em] text-[clamp(96px,22vw,200px)] leading-none font-bold tracking-tighter select-none"
    >
      <span aria-hidden className={digit}>
        4
      </span>

      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="size-[0.74em] overflow-visible"
      >
        <defs>
          <linearGradient id="nf-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="55%" stopColor="#5c53fe" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* soft glow */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="url(#nf-ring)"
          strokeWidth="14"
          opacity="0.35"
          style={{ filter: "blur(10px)" }}
        />

        {/* ring draws itself */}
        <motion.circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="url(#nf-ring)"
          strokeWidth="11"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
        />

        {/* orbiting dot */}
        <motion.g
          style={{ originX: "50px", originY: "50px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="50" cy="12" r="5.5" fill="#fff" />
          <circle cx="50" cy="12" r="10" fill="#fff" opacity="0.25" />
        </motion.g>
      </svg>

      <span aria-hidden className={digit}>
        4
      </span>
    </div>
  )
}

/** Small "position filled" card that floats and drifts with the pointer. */
function FloatingCard({
  className,
  depth,
  delay,
  px,
  py,
  title,
  meta,
}: {
  className: string
  depth: number
  delay: number
  px: MotionValue<number>
  py: MotionValue<number>
  title: string
  meta: string
}) {
  const cfg = { stiffness: 90, damping: 18, mass: 0.8 }

  const x = useSpring(useTransform(px, [-0.5, 0.5], [-depth, depth]), cfg)

  const y = useSpring(useTransform(py, [-0.5, 0.5], [-depth, depth]), cfg)

  return (
    <motion.div className={`absolute ${className}`} style={{ x, y }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.5 + delay * 0.2 },
          scale: { duration: 0.6, delay: 0.5 + delay * 0.2, ease: EASE },
          y: {
            duration: 5 + delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          },
        }}
        className="w-48 rounded-2xl border border-white/10 bg-white/4 p-3.5 backdrop-blur-md"
      >
        <div className="flex items-center justify-between">
          <span className="size-7 rounded-lg bg-linear-to-br from-[#5c53fe] to-[#0ea5e9] opacity-70" />
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] tracking-wide text-[#a0a0ab] uppercase">
            Filled
          </span>
        </div>

        <p className="mt-3 text-sm text-[#c4c4cc] line-through decoration-[#5c53fe]/70 decoration-2">
          {title}
        </p>
        <p className="mt-0.5 text-xs text-[#6b6b75]">{meta}</p>
      </motion.div>
    </motion.div>
  )
}
