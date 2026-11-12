"use client"

import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
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

// Content (sample data: swap for real data from your API)
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

type Job = {
  company: string
  hue: string
  title: string
  place: string
  pay: string
  match: number
  tags: string[]
}

type Tab = { label: string; query: string; count: number; jobs: Job[] }

const TABS: Tab[] = [
  {
    label: "Product Designer",
    query: "Product Designer",
    count: 1284,
    jobs: [
      {
        company: "Northwind",
        hue: "#5c53fe",
        title: "Senior Product Designer",
        place: "Remote",
        pay: "$90–120k",
        match: 96,
        tags: ["Figma", "Research"],
      },
      {
        company: "Lumen Labs",
        hue: "#0ea5e9",
        title: "Product Designer, Growth",
        place: "Hybrid · New York",
        pay: "$85–110k",
        match: 91,
        tags: ["Prototyping", "B2B"],
      },
      {
        company: "Brightpath",
        hue: "#f97316",
        title: "Design Lead",
        place: "On-site · Austin",
        pay: "$120–150k",
        match: 88,
        tags: ["Systems", "Leadership"],
      },
    ],
  },
  {
    label: "AI Engineering",
    query: "AI Engineer",
    count: 962,
    jobs: [
      {
        company: "Orbit Health",
        hue: "#ec4899",
        title: "Machine Learning Engineer",
        place: "Remote",
        pay: "$130–170k",
        match: 94,
        tags: ["Python", "PyTorch"],
      },
      {
        company: "Kitepay",
        hue: "#22c55e",
        title: "AI Engineer, Fraud",
        place: "Hybrid · London",
        pay: "$120–160k",
        match: 90,
        tags: ["LLMs", "MLOps"],
      },
      {
        company: "Fieldnote",
        hue: "#eab308",
        title: "LLM Platform Engineer",
        place: "Remote",
        pay: "$140–180k",
        match: 87,
        tags: ["RAG", "Infra"],
      },
    ],
  },
  {
    label: "Dev-ops Engineer",
    query: "DevOps Engineer",
    count: 547,
    jobs: [
      {
        company: "Northwind",
        hue: "#5c53fe",
        title: "Site Reliability Engineer",
        place: "Remote",
        pay: "$110–150k",
        match: 95,
        tags: ["Kubernetes", "AWS"],
      },
      {
        company: "Kitepay",
        hue: "#22c55e",
        title: "DevOps Engineer",
        place: "Hybrid · Berlin",
        pay: "$95–125k",
        match: 92,
        tags: ["Terraform", "CI/CD"],
      },
      {
        company: "Lumen Labs",
        hue: "#0ea5e9",
        title: "Platform Engineer",
        place: "On-site · Toronto",
        pay: "$105–140k",
        match: 86,
        tags: ["Go", "Observability"],
      },
    ],
  },
]

const STATS = [
  { to: 50, suffix: "K", label: "Active Jobs" },
  { to: 12, suffix: "K", label: "Companies" },
  { to: 2, suffix: "M", label: "Job Seekers" },
  { to: 97, suffix: "%", label: "Satisfaction Rate" },
]

const TAB_DURATION = 5 // seconds each role stays on screen

// Motion
const EASE = [0.22, 1, 0.36, 1] as const
const SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const

const gridV: Variants = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },

  exit: { opacity: 0, transition: { duration: 0.18 } },
}

const cardV: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.97, filter: "blur(6px)" },

  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE },
  },
}

const statsV: Variants = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.09,
    },
  },
}

const statCellV: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: EASE,
    },
  },
}

// Helpers
/** Number that counts up whenever it (re)mounts in view. */
function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1.6,
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

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5"
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

  const sx = useMotionValue(-999)
  const sy = useMotionValue(-999)
  const spotlight = useMotionTemplate`radial-gradient(640px circle at ${sx}px ${sy}px, rgba(143,136,255,0.10), transparent 65%)`

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const horizonY = useTransform(scrollYProgress, [0, 1], [0, 140])

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        className={`${manrope.className} relative isolate overflow-hidden bg-[#010103] text-white`}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          sx.set(e.clientX - r.left)
          sy.set(e.clientY - r.top)
        }}
      >
        <Backdrop horizonY={horizonY} spotlight={spotlight} />

        <div className="relative mx-auto max-w-360 px-5 sm:px-8">
          <div className="mx-auto flex w-full max-w-196 flex-col items-center pt-28 text-center sm:pt-32 lg:pt-36">
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
          </div>

          <Showcase />
          {showStats && <Stats />}
        </div>
      </section>
    </MotionConfig>
  )
}

// Backdrop: one glow system, nothing else competing for attention
function Backdrop({
  horizonY,
  spotlight,
}: {
  horizonY: MotionValue<number>
  spotlight: MotionValue<string>
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        className="absolute -top-48 -right-48 h-140 w-205 rounded-full bg-[#5c53fe]/30 blur-[140px]"
        animate={{ x: [0, -90, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[8%] -left-40 h-105 w-140 rounded-full bg-[#0ea5e9]/10 blur-[130px]"
        animate={{ x: [0, 80, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage:
            "radial-gradient(ellipse 65% 45% at 50% 24%, black, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 45% at 50% 24%, black, transparent 78%)",
        }}
      />

      {/* Horizon: a dark planet with a glowing purple rim, as in the Figma */}
      <motion.div
        className="absolute top-[52%] left-1/2 aspect-square w-[170%] rounded-full bg-[#010103]"
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

// Showcase: trending tabs + live preview, one connected interaction
function Showcase() {
  const reduce = useReducedMotion()
  const [tab, setTab] = useState(0)
  const [paused, setPaused] = useState(false)
  const progress = useMotionValue(0)

  // Auto-advance with a visible progress line; pauses on hover/focus, resumes where it left off
  useEffect(() => {
    if (paused || reduce) return
    const remaining = 1 - progress.get()
    const controls = animate(progress, 1, {
      duration: TAB_DURATION * remaining,
      ease: "linear",
      onComplete: () => {
        progress.set(0)
        setTab((t) => (t + 1) % TABS.length)
      },
    })

    return () => controls.stop()
  }, [paused, reduce, tab, progress])

  const select = (i: number) => {
    progress.set(0)
    setTab(i)
  }

  const current = TABS[tab]

  // Panel tilt toward the cursor
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const cfg = { stiffness: 140, damping: 20, mass: 0.7 }

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [2.5, -2.5]), cfg)

  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-3.5, 3.5]), cfg)

  return (
    <div
      className="relative mx-auto mt-10 w-full max-w-260"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Tabs */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 1.2 }}
      >
        <span className="flex items-center gap-2 text-base text-white/60">
          <TrendIcon className="size-4 text-[#8f88ff]" />
          Trending positions
        </span>

        <div
          role="tablist"
          aria-label="Trending positions"
          className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/10 bg-[#1a1a1b]/80 p-1 backdrop-blur-md"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") select((tab + 1) % TABS.length)
            if (e.key === "ArrowLeft")
              select((tab - 1 + TABS.length) % TABS.length)
          }}
        >
          {TABS.map((t, i) => {
            const on = i === tab
            return (
              <button
                key={t.label}
                role="tab"
                id={`hero-tab-${i}`}
                aria-selected={on}
                aria-controls="hero-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => select(i)}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#8f88ff] ${
                  on ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="hero-tab-pill"
                    className="absolute inset-0 rounded-full bg-[#5c53fe]/25 shadow-[inset_0_0_0_1px_rgba(143,136,255,0.45),0_8px_28px_-8px_rgba(92,83,254,0.8)]"
                    transition={SPRING}
                  />
                )}

                <span className="relative">{t.label}</span>
                {on && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-4 bottom-0.5 h-0.5 origin-left rounded-full bg-linear-to-r from-[#8f88ff] to-[#38bdf8]"
                    style={{ scaleX: progress }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Preview panel */}
      <motion.div
        className="mt-8"
        style={{ perspective: 1400, transformPerspective: 1400 }}
        initial={{ opacity: 0, y: 70, rotateX: 12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 1.4 }}
      >
        <motion.div
          style={{ rotateX, rotateY, transformPerspective: 1400 }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            mx.set((e.clientX - r.left) / r.width - 0.5)
            my.set((e.clientY - r.top) / r.height - 0.5)
          }}
          onMouseLeave={() => {
            mx.set(0)
            my.set(0)
          }}
        >
          <div className="relative overflow-hidden rounded-3xl bg-white/10 p-px shadow-[0_40px_120px_-30px_rgba(92,83,254,0.65)]">
            {/* a single sliver of light travels around the edge */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
            >
              <motion.span
                className="absolute top-1/2 left-1/2 aspect-square w-[170%]"
                style={{
                  x: "-50%",
                  y: "-50%",
                  background:
                    "conic-gradient(from 0deg, transparent 0 68%, rgba(143,136,255,0.95) 84%, rgba(56,189,248,0.95) 92%, transparent 100%)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              />
            </span>

            <div
              id="hero-panel"
              role="tabpanel"
              aria-labelledby={`hero-tab-${tab}`}
              className="relative rounded-[23px] bg-[#09090e]/95 backdrop-blur-xl"
            >
              {/* header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-7">
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-2 text-emerald-300">
                    <Ping /> Live openings
                  </span>

                  <span aria-hidden className="h-4 w-px bg-white/15" />
                  <span className="relative inline-block h-5 min-w-38 overflow-hidden text-left text-white/80">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={current.label}
                        className="absolute inset-0 leading-5"
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -16, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        {current.label}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-white/55">
                    <span className="text-white tabular-nums">
                      <CountUp
                        key={current.label}
                        to={current.count}
                        duration={1.1}
                      />
                    </span>{" "}
                    open roles
                  </span>

                  <Link
                    href={`/jobs?q=${encodeURIComponent(current.query)}`}
                    className="group/all flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium text-[#8f88ff] transition-colors outline-none hover:bg-[#5c53fe]/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
                  >
                    View all
                    <ArrowIcon className="size-3.5 transition-transform duration-300 group-hover/all:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* cards */}
              <div className="p-4 sm:p-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.ul
                    key={current.label}
                    variants={gridV}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="grid gap-4 md:grid-cols-3"
                  >
                    {current.jobs.map((job, i) => (
                      <JobCard
                        key={job.title}
                        job={job}
                        className={i === 2 ? "hidden md:block" : ""}
                      />
                    ))}
                  </motion.ul>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

function JobCard({ job, className = "" }: { job: Job; className?: string }) {
  const spot = useSpotlight("rgba(92,83,254,0.20)", 240)
  return (
    <motion.li variants={cardV} className={className}>
      <motion.div
        whileHover={{ y: -5 }}
        transition={SPRING}
        onMouseMove={spot.onMouseMove}
        className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-left transition-colors duration-300 hover:border-[#5c53fe]/55"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: spot.background }}
        />

        <Link
          href={`/jobs?q=${encodeURIComponent(job.title)}`}
          aria-label={`${job.title} at ${job.company}`}
          className="absolute inset-0 z-10 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
        />

        <div className="relative flex items-start justify-between">
          <span
            className="grid size-11 place-items-center rounded-xl text-base font-bold text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
            style={{
              backgroundColor: `${job.hue}33`,
              boxShadow: `inset 0 0 0 1px ${job.hue}66, 0 8px 24px -10px ${job.hue}`,
            }}
          >
            {job.company[0]}
          </span>

          <span className="flex items-center gap-1.5 rounded-full bg-[#5c53fe]/20 px-2.5 py-1 text-xs font-medium text-[#c9c5ff]">
            <svg viewBox="0 0 24 24" className="size-3" aria-hidden>
              <path
                d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z"
                fill="currentColor"
              />
            </svg>
            {job.match}% match
          </span>
        </div>

        <h3 className="relative mt-4 text-[17px] leading-snug font-semibold text-white">
          {job.title}
        </h3>

        <p className="relative mt-1 text-sm text-white/55">
          {job.company} · {job.place}
        </p>

        <div className="relative mt-4 flex flex-wrap gap-1.5">
          {job.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/4 px-2.5 py-1 text-xs text-white/70"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
          <span className="text-[15px] font-semibold text-white">
            {job.pay}
          </span>

          <span className="grid size-8 place-items-center rounded-full border border-white/10 text-white/70 transition-all duration-300 group-hover:border-transparent group-hover:bg-[#5c53fe] group-hover:text-white">
            <ArrowIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </motion.div>
    </motion.li>
  )
}

// Stats
function Stats() {
  return (
    <div className="relative mx-auto max-w-260 pt-24 pb-24 lg:pt-32 lg:pb-32">
      <motion.h2
        className={`${instrument.className} mx-auto max-w-155 text-center text-[clamp(24px,3.6vw,36px)] leading-[1.3] font-medium text-balance text-white/70`}
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

      {/* One connected strip instead of four separate cards */}
      <motion.ul
        className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4"
        variants={statsV}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {STATS.map((s) => (
          <StatCell key={s.label} {...s} />
        ))}
      </motion.ul>
    </div>
  )
}

function StatCell({
  to,
  suffix,
  label,
}: {
  to: number
  suffix: string
  label: string
}) {
  const spot = useSpotlight("rgba(92,83,254,0.22)", 240)
  return (
    <motion.li
      variants={statCellV}
      onMouseMove={spot.onMouseMove}
      className="group relative overflow-hidden bg-[#08080d] px-5 py-8 text-center sm:py-10"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spot.background }}
      />

      <p
        className={`${jakarta.className} relative text-[clamp(34px,5vw,52px)] leading-none font-semibold tracking-tight`}
      >
        <span className="bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent">
          <CountUp to={to} suffix={suffix} />
        </span>
      </p>

      <p className="relative mt-3 text-sm text-white/60 sm:text-base">
        {label}
      </p>
    </motion.li>
  )
}
