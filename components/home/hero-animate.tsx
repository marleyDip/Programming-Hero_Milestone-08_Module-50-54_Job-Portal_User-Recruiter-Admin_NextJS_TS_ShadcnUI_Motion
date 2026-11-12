"use client"

import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion"
import {
  Instrument_Sans,
  Manrope,
  Plus_Jakarta_Sans,
  Space_Mono,
} from "next/font/google"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

// Fonts (from the Figma file; Satoshi isn't on Google Fonts, so inputs use Manrope)
const manrope = Manrope({ subsets: ["latin"], display: "swap" })
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" })
const instrument = Instrument_Sans({ subsets: ["latin"], display: "swap" })

// Content (sample data: swap for real data)
const SUGGESTIONS = [
  "Product Designer",
  "AI Engineer",
  "DevOps Engineer",
  "Frontend Developer",
  "Backend Engineer",
  "Data Analyst",
  "Marketing Manager",
  "Customer Success Manager",
]

const TRENDING = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

const HIRES = [
  {
    name: "Amara",
    role: "Product Designer",
    company: "Lumen Labs",
    hue: "#ec4899",
  },
  {
    name: "Daniel",
    role: "AI Engineer",
    company: "Orbit Health",
    hue: "#0ea5e9",
  },
  {
    name: "Priya",
    role: "DevOps Engineer",
    company: "Kitepay",
    hue: "#22c55e",
  },
  {
    name: "Mateo",
    role: "Data Analyst",
    company: "Brightpath",
    hue: "#f97316",
  },
]

const STATS = [
  { to: 50, suffix: "K", label: "Active Jobs" },
  { to: 12, suffix: "K", label: "Companies" },
  { to: 2, suffix: "M", label: "Job Seekers" },
  { to: 97, suffix: "%", label: "Satisfaction Rate" },
]

// Motion
const EASE = [0.22, 1, 0.36, 1] as const
const SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const

// Deterministic "sparks" so server and client render identically
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SPARKS = (() => {
  const r = mulberry32(11)
  const colors = ["#8f88ff", "#38bdf8", "#fdba74", "#ffffff"]

  return Array.from({ length: 24 }, (_, i) => ({
    left: `${(r() * 100).toFixed(2)}%`,
    top: `${(28 + r() * 62).toFixed(2)}%`,
    size: `${(2 + r() * 3).toFixed(1)}px`,
    dur: 9 + r() * 9,
    delay: r() * 9,
    rise: 140 + r() * 240,
    color: colors[i % colors.length],
  }))
})()

const statsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const statItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

// Helpers
/** Number that counts up the first time it scrolls into view. */
function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1.8,
}: {
  to: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" })
  const mv = useMotionValue(0)
  const text = useTransform(
    mv,
    (v) => `${prefix}${Math.round(v).toLocaleString("en-US")}${suffix}`
  )

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, to, { duration, ease: EASE })
    return () => controls.stop()
  }, [inView, mv, to, duration])

  return <motion.span ref={ref}>{text}</motion.span>
}

/** Cursor-following light inside a single element. */
function useSpotlight(color = "rgba(143,136,255,0.16)", size = 260) {
  const x = useMotionValue(-999)
  const y = useMotionValue(-999)
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 70%)`
  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }
  return { background, onMouseMove }
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m13.5 13.5 3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        d="M10 17.5s5.5-4.6 5.5-9A5.5 5.5 0 0 0 4.5 8.5c0 4.4 5.5 9 5.5 9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function TrendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        d="m3 13 4.5-4.5 3 3L17 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 5H17v4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Ping() {
  return (
    <span className="relative flex size-1.5" aria-hidden>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
      <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
    </span>
  )
}

// Hero
export function Hero({ showStats = true }: { showStats?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)

  // Pointer position drives the spotlight and the card parallax
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useMotionValue(-999)
  const sy = useMotionValue(-999)
  const spotlight = useMotionTemplate`radial-gradient(640px circle at ${sx}px ${sy}px, rgba(143,136,255,0.11), transparent 65%)`

  // Scroll parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const horizonY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -48])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.42], [1, 0.15])

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        className={`${manrope.className} relative isolate overflow-hidden bg-[#010103] text-white`}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          px.set((e.clientX - r.left) / r.width - 0.5)
          py.set((e.clientY - r.top) / r.height - 0.5)
          sx.set(e.clientX - r.left)
          sy.set(e.clientY - r.top)
        }}
      >
        <Backdrop horizonY={horizonY} spotlight={spotlight} />

        <div className="relative mx-auto max-w-360 px-5 sm:px-8">
          {/* Floating live cards (wide screens only, purely decorative) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-195 xl:block"
          >
            <FloatingCards px={px} py={py} />
          </div>

          <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="relative mx-auto flex w-full max-w-196 flex-col items-center pt-28 pb-16 text-center sm:pt-32 lg:pt-36"
          >
            <Badge />
            <Headline />

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.85 }}
              className="mt-6 max-w-160 text-base leading-relaxed text-white/70 sm:text-xl sm:leading-[1.55]"
            >
              HireLoop connects top talent with world-class companies. Browse
              thousands of curated opportunities and land your next role,
              faster.
            </motion.p>

            <SearchBar />
            <TrendingRow />
          </motion.div>

          {showStats && <Stats />}
        </div>
      </section>
    </MotionConfig>
  )
}

// Backdrop
function Backdrop({
  horizonY,
  spotlight,
}: {
  horizonY: MotionValue<number>
  spotlight: MotionValue<string>
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* Aurora */}
      <motion.div
        className="absolute -top-48 -right-48 h-140 w-205 rounded-full bg-[#5c53fe]/30 blur-[140px]"
        animate={{ x: [0, -90, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[6%] -left-40 h-105 w-140 rounded-full bg-[#dc02ce]/10 blur-[130px]"
        animate={{ x: [0, 80, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[2%] left-[30%] h-75 w-115 rounded-full bg-[#0ea5e9]/12 blur-[120px]"
        animate={{ x: [0, 120, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[14%] right-[18%] h-60 w-85 rounded-full bg-[#f97316]/9 blur-[120px]"
        animate={{ x: [0, -70, 0], y: [0, 24, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage:
            "radial-gradient(ellipse 65% 50% at 50% 28%, black, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 50% at 50% 28%, black, transparent 78%)",
        }}
      />

      {/* Horizon: a dark planet with a glowing purple rim, as in the Figma */}
      <motion.div
        className="absolute top-[60%] left-1/2 aspect-square w-[170%] rounded-full bg-[#010103]"
        style={{ x: "-50%", y: horizonY }}
        animate={{
          boxShadow: [
            "inset 0 3px 0 rgba(190,185,255,0.55), inset 0 60px 110px -40px rgba(92,83,254,0.45), 0 -30px 120px 0 rgba(92,83,254,0.50), 0 -110px 280px 20px rgba(92,83,254,0.24)",
            "inset 0 3px 0 rgba(210,206,255,0.75), inset 0 70px 130px -40px rgba(120,110,255,0.55), 0 -36px 150px 6px rgba(110,100,255,0.62), 0 -130px 320px 30px rgba(92,83,254,0.32)",
            "inset 0 3px 0 rgba(190,185,255,0.55), inset 0 60px 110px -40px rgba(92,83,254,0.45), 0 -30px 120px 0 rgba(92,83,254,0.50), 0 -110px 280px 20px rgba(92,83,254,0.24)",
          ],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rising sparks */}
      <div className="absolute inset-0 overflow-hidden">
        {SPARKS.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              backgroundColor: s.color,
              boxShadow: `0 0 10px 2px ${s.color}88`,
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.9, 0], y: -s.rise }}
            transition={{
              duration: s.dur,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Cursor spotlight */}
      <motion.div
        className="absolute inset-0"
        style={{ background: spotlight }}
      />
    </div>
  )
}

// Badge
function Badge() {
  return (
    <div className="flex items-center gap-3">
      <motion.span
        aria-hidden
        className="hidden h-px w-14 origin-right bg-linear-to-r from-transparent to-[#8f88ff] sm:block"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
      />

      <motion.span
        className="relative block overflow-hidden rounded-full bg-linear-to-r from-[#5c53fe] via-[#8f88ff]/50 to-[#0ea5e9] p-px"
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      >
        <span className="relative flex items-center gap-3 overflow-hidden rounded-full bg-[#0d0b24] px-4 py-2 shadow-[inset_0_0_26px_rgba(92,83,254,0.4)] sm:px-5 sm:py-2.5">
          <motion.svg
            viewBox="0 0 24 24"
            className="size-5 shrink-0"
            aria-hidden
            animate={{ rotate: [0, 90, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <defs>
              <linearGradient id="hero-spark" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#c9c5ff" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z"
              fill="url(#hero-spark)"
            />
          </motion.svg>

          <span
            className={`${spaceMono.className} text-sm text-white sm:text-lg`}
          >
            <CountUp to={50000} suffix="+" duration={2.2} /> new jobs this month
          </span>

          <motion.span
            aria-hidden
            className="absolute inset-y-0 w-1/4 -skew-x-12 bg-linear-to-r from-transparent via-white/25 to-transparent"
            initial={{ left: "-30%" }}
            animate={{ left: "130%" }}
            transition={{
              duration: 1.6,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 3.4,
              delay: 1.2,
            }}
          />
        </span>
      </motion.span>

      <motion.span
        aria-hidden
        className="hidden h-px w-14 origin-left bg-linear-to-l from-transparent to-[#0ea5e9] sm:block"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
      />
    </div>
  )
}

// Headline
const WORDS = [
  { t: "Find" },
  { t: "Your" },
  { t: "Dream", g: true },
  { t: "Job", g: true },
  { t: "Today" },
]

function Headline() {
  const word = (w: (typeof WORDS)[number], i: number) => (
    <span
      key={w.t}
      className="mb-[-0.14em] inline-block overflow-hidden pb-[0.14em]"
    >
      <motion.span
        className="inline-block"
        style={
          w.g
            ? {
                backgroundImage:
                  "linear-gradient(90deg,#c9c5ff,#6f66ff,#22b8f0,#ffb067,#c9c5ff)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }
            : undefined
        }
        initial={{ y: "110%", opacity: 0, filter: "blur(10px)" }}
        animate={
          w.g
            ? {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                backgroundPosition: ["0% 50%", "100% 50%"],
              }
            : { y: 0, opacity: 1, filter: "blur(0px)" }
        }
        transition={{
          y: { duration: 0.8, ease: EASE, delay: 0.3 + i * 0.09 },
          opacity: { duration: 0.6, delay: 0.3 + i * 0.09 },
          filter: { duration: 0.7, delay: 0.3 + i * 0.09 },
          backgroundPosition: {
            duration: 7,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 1,
          },
        }}
      >
        {w.t}
      </motion.span>
    </span>
  )

  return (
    <h1 className="mt-8 flex flex-wrap justify-center gap-x-[0.28em] text-[clamp(40px,7vw,68px)] leading-[1.08] font-bold tracking-[-0.035em]">
      {word(WORDS[0], 0)}
      {word(WORDS[1], 1)}
      <span className="relative inline-flex gap-x-[0.28em]">
        {word(WORDS[2], 2)}
        {word(WORDS[3], 3)}
        <svg
          aria-hidden
          viewBox="0 0 300 14"
          preserveAspectRatio="none"
          className="pointer-events-none absolute bottom-[-0.18em] left-0 h-[0.2em] w-full overflow-visible"
        >
          <defs>
            <linearGradient id="hero-underline" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8f88ff" />
              <stop offset="55%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#fdba74" />
            </linearGradient>
          </defs>
          <motion.path
            d="M3 9 C 70 2, 190 2, 297 8"
            fill="none"
            stroke="url(#hero-underline)"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.15 }}
          />
        </svg>
      </span>
      {word(WORDS[4], 4)}
    </h1>
  )
}

// Search
function SearchBar() {
  const router = useRouter()
  const [job, setJob] = useState("")
  const [loc, setLoc] = useState("")
  const [remote, setRemote] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  const q = job.trim().toLowerCase()
  const matches = (
    q ? SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)) : SUGGESTIONS
  ).slice(0, 5)

  const submit = () => {
    const params = new URLSearchParams()
    if (job.trim()) params.set("q", job.trim())
    if (remote) params.set("type", "remote")
    else if (loc.trim()) params.set("location", loc.trim())

    const qs = params.toString()
    router.push(qs ? `/jobs?${qs}` : "/jobs")
  }

  const pick = (value: string) => {
    setJob(value)
    setOpen(false)
    setActive(-1)
  }

  return (
    <motion.form
      role="search"
      className="relative z-20 mt-10 w-full"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 1.0 }}
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <div className="group/search relative rounded-2xl bg-white/18 p-px shadow-[0_24px_70px_-24px_rgba(92,83,254,0.6)] transition-colors duration-300 focus-within:bg-transparent">
        {/* rotating light that appears on focus */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl opacity-0 transition-opacity duration-300 group-focus-within/search:opacity-100"
        >
          <motion.span
            className="absolute top-1/2 left-1/2 aspect-square w-[150%]"
            style={{
              x: "-50%",
              y: "-50%",
              background:
                "conic-gradient(from 0deg, #5c53fe, #38bdf8, #fdba74, #dc02ce, #5c53fe)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
        </span>

        <div className="relative flex flex-col rounded-[15px] bg-[#101010] p-2 md:flex-row md:items-center md:pl-6">
          {/* Job field */}
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 md:px-0 md:py-0">
            <SearchIcon className="size-5 shrink-0 text-white/50" />
            <input
              value={job}
              onChange={(e) => {
                setJob(e.target.value)
                setOpen(true)
                setActive(-1)
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault()
                  setOpen(true)
                  setActive((v) => Math.min(v + 1, matches.length - 1))
                } else if (e.key === "ArrowUp") {
                  e.preventDefault()
                  setActive((v) => Math.max(v - 1, 0))
                } else if (
                  e.key === "Enter" &&
                  open &&
                  active >= 0 &&
                  matches[active]
                ) {
                  e.preventDefault()
                  pick(matches[active])
                } else if (e.key === "Escape") {
                  setOpen(false)
                }
              }}
              placeholder="Job title, skill or company"
              aria-label="Job title, skill or company"
              role="combobox"
              aria-expanded={open && matches.length > 0}
              aria-controls="hero-suggestions"
              aria-autocomplete="list"
              autoComplete="off"
              className="h-10 min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-white/45 focus:outline-none"
            />
          </div>

          <span
            aria-hidden
            className="mx-1 h-px bg-white/10 md:mx-5 md:h-6 md:w-px md:bg-white/20"
          />

          {/* Location field */}
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 md:px-0 md:py-0">
            <PinIcon className="size-5 shrink-0 text-white/50" />
            <input
              value={remote ? "" : loc}
              onChange={(e) => setLoc(e.target.value)}
              disabled={remote}
              placeholder={remote ? "Anywhere (remote)" : "Location or Remote"}
              aria-label="Location"
              autoComplete="off"
              className="h-10 min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-white/45 focus:outline-none disabled:cursor-not-allowed"
            />

            <button
              type="button"
              role="switch"
              aria-checked={remote}
              aria-label="Remote only"
              onClick={() => setRemote((v) => !v)}
              className={`relative flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#8f88ff] ${
                remote
                  ? "border-[#5c53fe]/70 bg-[#5c53fe]/25 text-white"
                  : "border-white/10 bg-white/4 text-white/70 hover:border-white/25 hover:text-white"
              }`}
            >
              <AnimatePresence initial={false}>
                {remote && (
                  <motion.svg
                    key="check"
                    viewBox="0 0 16 16"
                    className="size-3.5"
                    fill="none"
                    initial={{ width: 0, opacity: 0, scale: 0.4 }}
                    animate={{ width: 14, opacity: 1, scale: 1 }}
                    exit={{ width: 0, opacity: 0, scale: 0.4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path
                      d="m3.5 8.5 3 3 6-7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
              Remote
            </button>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={SPRING}
            className="group/btn relative isolate mt-1 flex h-12 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#5c53fe] px-6 text-base font-medium text-white shadow-[inset_0_3px_10px_rgba(255,255,255,0.25)] transition-colors outline-none hover:bg-[#6a62ff] focus-visible:ring-2 focus-visible:ring-[#c9c5ff] md:mt-0 md:ml-4"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-700 ease-out group-hover/btn:left-[130%] group-hover/btn:opacity-100"
            />
            <SearchIcon className="size-4.5" />
            Search
          </motion.button>
        </div>
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {open && matches.length > 0 && (
          <motion.ul
            id="hero-suggestions"
            role="listbox"
            className="absolute top-[calc(100%+12px)] right-0 left-0 z-30 overflow-hidden rounded-2xl border border-white/10 bg-[#121216]/95 p-2 text-left shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl md:right-auto md:w-[56%]"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: -6,
              scale: 0.99,
              transition: { duration: 0.12 },
            }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <li
              role="presentation"
              className="px-3 pt-2 pb-1.5 text-[13px] font-medium text-white/45"
            >
              {q ? "Suggestions" : "Trending searches"}
            </li>

            {matches.map((m, i) => (
              <motion.li
                key={m}
                role="option"
                aria-selected={i === active}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.035 }}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    pick(m)
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] transition-colors ${
                    i === active
                      ? "bg-white/[0.07] text-white"
                      : "text-white/75"
                  }`}
                >
                  <SearchIcon className="size-4 shrink-0 text-white/40" />
                  {m}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.form>
  )
}

// Trending
function TrendingRow() {
  return (
    <motion.div
      className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 1.2 }}
    >
      <span className="flex items-center gap-2 text-base text-white/60">
        <TrendIcon className="size-4 text-[#8f88ff]" />
        Trending positions
      </span>

      <ul className="flex flex-wrap items-center justify-center gap-2">
        {TRENDING.map((t, i) => (
          <motion.li
            key={t}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...SPRING, delay: 1.3 + i * 0.08 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={`/jobs?q=${encodeURIComponent(t)}`}
              className="block rounded-full border border-white/10 bg-[#1a1a1b] px-4 py-1.5 text-sm text-white/85 transition-all duration-300 outline-none hover:border-[#5c53fe]/70 hover:bg-[#5c53fe]/15 hover:text-white hover:shadow-[0_8px_30px_-8px_rgba(92,83,254,0.8)] focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
            >
              {t}
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

// Floating live cards
function FloatingCards({
  px,
  py,
}: {
  px: MotionValue<number>
  py: MotionValue<number>
}) {
  return (
    <>
      <Float
        px={px}
        py={py}
        depth={22}
        delay={0}
        enter={1.5}
        className="min-360:left-[2.5%] top-47.5 left-[1.5%]"
      >
        <JobCard />
      </Float>

      <Float
        px={px}
        py={py}
        depth={34}
        delay={1.1}
        enter={1.7}
        className="min-360:left-[4.5%] top-117.5 left-[1.5%]"
      >
        <MatchCard />
      </Float>

      <Float
        px={px}
        py={py}
        depth={28}
        delay={0.6}
        enter={1.6}
        className="min-360:right-[2.5%] top-42.5 right-[1.5%]"
      >
        <HiredCard />
      </Float>

      <Float
        px={px}
        py={py}
        depth={40}
        delay={1.6}
        enter={1.8}
        className="min-360:right-[4.5%] top-107.5 right-[1.5%]"
      >
        <SalaryCard />
      </Float>
    </>
  )
}

function Float({
  children,
  className,
  px,
  py,
  depth,
  delay,
  enter,
}: {
  children: React.ReactNode
  className: string
  px: MotionValue<number>
  py: MotionValue<number>
  depth: number
  delay: number
  enter: number
}) {
  const cfg = { stiffness: 80, damping: 18, mass: 0.9 }

  const x = useSpring(useTransform(px, [-0.5, 0.5], [-depth, depth]), cfg)
  const y = useSpring(useTransform(py, [-0.5, 0.5], [-depth, depth]), cfg)

  return (
    <motion.div
      className={`min-360:w-59 absolute w-52 ${className}`}
      style={{ x, y }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: enter },
          scale: { duration: 0.7, ease: EASE, delay: enter },
          y: {
            duration: 6 + delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: enter + delay,
          },
        }}
        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function JobCard() {
  return (
    <>
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-[#5c53fe] to-[#0ea5e9] text-sm font-bold">
          N
        </span>

        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold">Product Designer</p>
          <p className="text-xs text-white/55">Northwind · Remote</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Full-time", "$90–120k", "Figma"].map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/10 bg-white/4 px-2 py-0.5 text-[11px] text-white/70"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-emerald-300">
          <Ping /> Hiring now
        </span>

        <span className="relative rounded-lg bg-[#5c53fe] px-3 py-1.5 text-xs font-medium">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-lg bg-[#5c53fe]"
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
          <span className="relative">Apply</span>
        </span>
      </div>
    </>
  )
}

function MatchCard() {
  const C = 2 * Math.PI * 24
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative size-15 shrink-0">
          <svg viewBox="0 0 60 60" className="size-full -rotate-90" aria-hidden>
            <defs>
              <linearGradient id="hero-match" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8f88ff" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <circle
              cx="30"
              cy="30"
              r="24"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="5"
            />
            <motion.circle
              cx="30"
              cy="30"
              r="24"
              fill="none"
              stroke="url(#hero-match)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C * 0.04 }}
              transition={{ duration: 1.6, ease: EASE, delay: 2.0 }}
            />
          </svg>

          <span className="absolute inset-0 grid place-items-center text-sm font-bold">
            <CountUp to={96} suffix="%" duration={1.6} />
          </span>
        </div>

        <div>
          <p className="text-[15px] font-semibold">Skill match</p>
          <p className="text-xs text-white/55">Based on your profile</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Research", "Prototyping", "Systems"].map((t) => (
          <span
            key={t}
            className="rounded-full bg-[#5c53fe]/20 px-2 py-0.5 text-[11px] text-[#c9c5ff]"
          >
            {t}
          </span>
        ))}
      </div>
    </>
  )
}

function HiredCard() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % HIRES.length), 3400)
    return () => clearInterval(id)
  }, [])
  const h = HIRES[i]

  return (
    <>
      <div className="flex items-center justify-between text-xs text-white/55">
        <span className="flex items-center gap-1.5">
          <Ping /> Live hires
        </span>
        <span>just now</span>
      </div>
      <div className="relative mt-3 h-13 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={h.name}
            className="absolute inset-0 flex items-center gap-3"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -22 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span
              className="grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold"
              style={{
                backgroundColor: `${h.hue}33`,
                boxShadow: `inset 0 0 0 1px ${h.hue}77`,
              }}
            >
              {h.name[0]}
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {h.name} got hired
              </p>
              <p className="truncate text-xs text-white/55">
                {h.role} · {h.company}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

function SalaryCard() {
  const bars = [38, 50, 44, 62, 56, 76, 92]
  return (
    <>
      <p className="text-xs text-white/55">Median salary · Designer</p>

      <div className="mt-1 flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold tracking-tight">
            <CountUp to={104} prefix="$" suffix="k" duration={1.8} />
          </p>

          <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-emerald-300">
            <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden>
              <path
                d="M6 10V2m0 0L2.5 5.5M6 2l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            12% this year
          </p>
        </div>

        <div className="flex h-12 items-end gap-1">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              className={`w-2 origin-bottom rounded-full ${
                i === bars.length - 1
                  ? "bg-linear-to-t from-[#5c53fe] to-[#38bdf8] shadow-[0_0_14px_rgba(92,83,254,0.8)]"
                  : "bg-white/20"
              }`}
              style={{ height: `${h}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 2.1 + i * 0.07 }}
            />
          ))}
        </div>
      </div>
    </>
  )
}

// Stats
function Stats() {
  return (
    <div className="relative mx-auto max-w-330 pt-10 pb-24 sm:pt-16 lg:pb-32">
      <motion.h2
        className={`${instrument.className} mx-auto max-w-155 text-center text-[clamp(26px,4vw,40px)] leading-[1.3] font-medium text-balance text-white/70`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        Assisting over{" "}
        <span className="bg-linear-to-r from-[#c9c5ff] via-[#7a72ff] to-[#38bdf8] bg-clip-text text-transparent">
          <CountUp to={15000} duration={2.2} />
        </span>{" "}
        job seekers find their dream positions.
      </motion.h2>

      <motion.ul
        className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:mt-16 lg:grid-cols-4"
        variants={statsContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </motion.ul>
    </div>
  )
}

function StatCard({
  to,
  suffix,
  label,
}: {
  to: number
  suffix: string
  label: string
}) {
  const spot = useSpotlight()
  return (
    <motion.li
      variants={statItem}
      whileHover={{ y: -6 }}
      transition={SPRING}
      onMouseMove={spot.onMouseMove}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-[#5c53fe]/40 sm:p-8"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: spot.background }}
      />

      <span
        aria-hidden
        className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-[#8f88ff]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <p
        className={`${jakarta.className} relative text-[clamp(34px,5vw,56px)] leading-none font-semibold tracking-tight`}
      >
        <span className="bg-linear-to-b from-white to-white/65 bg-clip-text text-transparent">
          <CountUp to={to} suffix={suffix} />
        </span>
      </p>

      <p className="relative mt-3 text-sm text-white/60 sm:text-lg">{label}</p>
    </motion.li>
  )
}
