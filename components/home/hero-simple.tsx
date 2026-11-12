"use client"

import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion"
import { Manrope, Plus_Jakarta_Sans, Space_Mono } from "next/font/google"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

// Fonts
const manrope = Manrope({ subsets: ["latin"], display: "swap" })
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
})
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" })

// Content (sample data: swap for real data from your API)
const SUGGESTIONS = [
  "Product Designer",
  "AI Engineer",
  "DevOps Engineer",
  "Frontend Developer",
  "Data Analyst",
  "Marketing Manager",
]

type Job = {
  company: string
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
        title: "Senior Product Designer",
        place: "Remote",
        pay: "$90–120k",
        match: 96,
        tags: ["Figma", "Research"],
      },
      {
        company: "Lumen Labs",
        title: "Product Designer, Growth",
        place: "New York",
        pay: "$85–110k",
        match: 91,
        tags: ["Prototyping", "B2B"],
      },
      {
        company: "Brightpath",
        title: "Design Lead",
        place: "Austin",
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
        title: "Machine Learning Engineer",
        place: "Remote",
        pay: "$130–170k",
        match: 94,
        tags: ["Python", "PyTorch"],
      },
      {
        company: "Kitepay",
        title: "AI Engineer, Fraud",
        place: "London",
        pay: "$120–160k",
        match: 90,
        tags: ["LLMs", "MLOps"],
      },
      {
        company: "Fieldnote",
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
        title: "Site Reliability Engineer",
        place: "Remote",
        pay: "$110–150k",
        match: 95,
        tags: ["Kubernetes", "AWS"],
      },
      {
        company: "Kitepay",
        title: "DevOps Engineer",
        place: "Berlin",
        pay: "$95–125k",
        match: 92,
        tags: ["Terraform", "CI/CD"],
      },
      {
        company: "Lumen Labs",
        title: "Platform Engineer",
        place: "Toronto",
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

const TAB_SECONDS = 5

// Motion
const EASE = [0.22, 1, 0.36, 1] as const
const SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const

const listV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const itemV: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

// Helpers
function CountUp({
  to,
  suffix = "",
  duration = 1.6,
}: {
  to: number
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" })
  const mv = useMotionValue(0)
  const text = useTransform(
    mv,
    (v) => `${Math.round(v).toLocaleString("en-US")}${suffix}`
  )

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, to, { duration, ease: EASE })
    return () => controls.stop()
  }, [inView, mv, to, duration])

  return <motion.span ref={ref}>{text}</motion.span>
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

// Hero
export function Hero({ showStats = true }: { showStats?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const horizonY = useTransform(scrollYProgress, [0, 1], [0, 120])

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        className={`${manrope.className} relative isolate overflow-hidden bg-[#010103] text-white`}
      >
        {/* One soft glow at the top, one horizon rim light below: that's the whole backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-30 left-1/2 h-130 w-225 -translate-x-1/2 rounded-full bg-[#5c53fe]/25 blur-[150px]" />

          <motion.div
            className="absolute top-[56%] left-1/2 aspect-square w-[170%] rounded-full bg-[#010103]"
            style={{
              x: "-50%",
              y: horizonY,
              boxShadow:
                "inset 0 2px 0 rgba(200,196,255,0.6), inset 0 60px 110px -40px rgba(92,83,254,0.4), 0 -30px 120px 0 rgba(92,83,254,0.45), 0 -110px 280px 20px rgba(92,83,254,0.22)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-360 px-5 sm:px-8">
          <div className="mx-auto flex w-full max-w-196 flex-col items-center pt-28 text-center sm:pt-32 lg:pt-40">
            <Badge />
            <Headline />

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.8 }}
              className="mt-6 max-w-150 text-lg leading-relaxed text-white/65 sm:text-xl"
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

// Badge + headline
function Badge() {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="inline-flex items-center gap-2.5 rounded-full border border-[#5c53fe]/40 bg-[#5c53fe]/10 px-4 py-2 shadow-[inset_0_0_20px_rgba(92,83,254,0.25)]"
    >
      <span className="relative flex size-2" aria-hidden>
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#8f88ff]/70" />
        <span className="relative inline-flex size-2 rounded-full bg-[#8f88ff]" />
      </span>

      <span
        className={`${spaceMono.className} text-sm text-white sm:text-base`}
      >
        <CountUp to={50000} suffix="+" duration={2} /> new jobs this month
      </span>
    </motion.span>
  )
}

function Headline() {
  const words = ["Find", "Your", "Dream", "Job", "Today"]
  return (
    <h1 className="mt-7 flex flex-wrap justify-center gap-x-[0.27em] text-[clamp(42px,7.4vw,72px)] leading-[1.06] font-bold tracking-[-0.035em]">
      {words.map((w, i) => {
        const accent = i === 2 || i === 3
        return (
          <span
            key={w}
            className="mb-[-0.14em] inline-block overflow-hidden pb-[0.14em]"
          >
            <motion.span
              className={`inline-block ${accent ? "bg-linear-to-r from-[#d6d3ff] via-[#8f88ff] to-[#38bdf8] bg-clip-text text-transparent" : ""}`}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.08 }}
            >
              {w}
            </motion.span>
          </span>
        )
      })}
    </h1>
  )
}

// Search
function SearchBar() {
  const router = useRouter()
  const [job, setJob] = useState("")
  const [loc, setLoc] = useState("")
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  const q = job.trim().toLowerCase()
  const matches = (
    q ? SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)) : SUGGESTIONS
  ).slice(0, 5)

  const submit = () => {
    const params = new URLSearchParams()
    if (job.trim()) params.set("q", job.trim())
    if (loc.trim()) params.set("location", loc.trim())
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.95 }}
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <div className="flex flex-col rounded-2xl border border-white/15 bg-[#101010]/90 p-2 shadow-[0_24px_70px_-28px_rgba(92,83,254,0.7)] backdrop-blur-xl transition-all duration-300 focus-within:border-[#5c53fe]/70 focus-within:shadow-[0_0_0_4px_rgba(92,83,254,0.18),0_24px_70px_-24px_rgba(92,83,254,0.8)] md:flex-row md:items-center md:pl-6">
        <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 md:px-0 md:py-0">
          <SearchIcon className="size-5 shrink-0 text-white/45" />

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
            className="h-10 min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none"
          />
        </div>

        <span
          aria-hidden
          className="mx-1 h-px bg-white/10 md:mx-5 md:h-6 md:w-px md:bg-white/20"
        />

        <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 md:px-0 md:py-0">
          <PinIcon className="size-5 shrink-0 text-white/45" />
          <input
            value={loc}
            onChange={(e) => setLoc(e.target.value)}
            placeholder="Location or Remote"
            aria-label="Location"
            autoComplete="off"
            className="h-10 min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={SPRING}
          className="mt-1 flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#5c53fe] px-6 text-base font-medium text-white shadow-[inset_0_3px_10px_rgba(255,255,255,0.22)] transition-colors outline-none hover:bg-[#6a62ff] focus-visible:ring-2 focus-visible:ring-[#c9c5ff] md:mt-0 md:ml-4"
        >
          <SearchIcon className="size-4.5" />
          Search
        </motion.button>
      </div>

      <AnimatePresence>
        {open && matches.length > 0 && (
          <motion.ul
            id="hero-suggestions"
            role="listbox"
            className="absolute top-[calc(100%+10px)] right-0 left-0 z-30 overflow-hidden rounded-2xl border border-white/10 bg-[#121216]/95 p-2 text-left shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl md:right-auto md:w-[56%]"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            {matches.map((m, i) => (
              <li key={m} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    pick(m)
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] transition-colors ${
                    i === active
                      ? "bg-white/[0.07] text-white"
                      : "text-white/70"
                  }`}
                >
                  <SearchIcon className="size-4 shrink-0 text-white/35" />
                  {m}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.form>
  )
}

// Showcase: trending tabs + live preview
function Showcase() {
  const reduce = useReducedMotion()
  const [tab, setTab] = useState(0)
  const [paused, setPaused] = useState(false)

  // Gentle auto-rotation; pauses while the pointer or focus is inside
  useEffect(() => {
    if (paused || reduce) return
    const id = setTimeout(
      () => setTab((t) => (t + 1) % TABS.length),
      TAB_SECONDS * 1000
    )
    return () => clearTimeout(id)
  }, [tab, paused, reduce])

  const current = TABS[tab]

  return (
    <div
      className="mx-auto mt-14 w-full max-w-260"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Tabs */}
      <motion.div
        className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 1.15 }}
      >
        <span className="text-[15px] text-white/55">Trending positions</span>
        <div
          role="tablist"
          aria-label="Trending positions"
          className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-white/10 bg-white/4 p-1"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") setTab((tab + 1) % TABS.length)
            if (e.key === "ArrowLeft")
              setTab((tab - 1 + TABS.length) % TABS.length)
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
                onClick={() => setTab(i)}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#8f88ff] ${
                  on ? "text-white" : "text-white/55 hover:text-white"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="hero-tab-pill"
                    className="absolute inset-0 rounded-full bg-[#5c53fe] shadow-[inset_0_2px_8px_rgba(255,255,255,0.25),0_8px_24px_-8px_rgba(92,83,254,0.9)]"
                    transition={SPRING}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Panel */}
      <motion.div
        id="hero-panel"
        role="tabpanel"
        aria-labelledby={`hero-tab-${tab}`}
        className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#09090e]/90 shadow-[0_40px_120px_-40px_rgba(92,83,254,0.7),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 1.3 }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-7">
          <p className="text-sm text-white/55">
            <span className="text-white tabular-nums">
              <CountUp key={current.label} to={current.count} duration={1} />
            </span>{" "}
            open roles in {current.label}
          </p>

          <Link
            href={`/jobs?q=${encodeURIComponent(current.query)}`}
            className="group/all flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#a8a2ff] transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
          >
            View all
            <ArrowIcon className="size-3.5 transition-transform duration-300 group-hover/all:translate-x-1" />
          </Link>
        </div>

        <div className="p-4 sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={current.label}
              variants={listV}
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
      </motion.div>
    </div>
  )
}

function JobCard({ job, className = "" }: { job: Job; className?: string }) {
  return (
    <motion.li variants={itemV} className={className}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={SPRING}
        className="group relative h-full rounded-2xl border border-white/10 bg-white/3 p-5 text-left transition-colors duration-300 hover:border-[#5c53fe]/50 hover:bg-white/5"
      >
        <Link
          href={`/jobs?q=${encodeURIComponent(job.title)}`}
          aria-label={`${job.title} at ${job.company}`}
          className="absolute inset-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
        />

        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-[#6f66ff] to-[#38bdf8] text-sm font-bold">
            {job.company[0]}
          </span>
          <p className="text-sm text-white/60">
            {job.company} · {job.place}
          </p>
        </div>

        <h3 className="mt-4 text-[17px] leading-snug font-semibold">
          {job.title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/6 px-2.5 py-1 text-xs text-white/70"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
          <span className="text-[15px] font-semibold">{job.pay}</span>
          <span className="text-xs font-medium text-[#a8a2ff]">
            {job.match}% match
          </span>
        </div>
      </motion.div>
    </motion.li>
  )
}

// Stats
function Stats() {
  return (
    <div className="mx-auto max-w-260 pt-24 pb-24 lg:pt-32 lg:pb-32">
      <motion.h2
        className="mx-auto max-w-150 text-center text-[clamp(24px,3.4vw,34px)] leading-[1.3] font-medium text-balance text-white/70"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        Assisting over{" "}
        <span className="bg-linear-to-r from-[#d6d3ff] via-[#8f88ff] to-[#38bdf8] bg-clip-text text-transparent">
          <CountUp to={15000} duration={2} />
        </span>{" "}
        job seekers find their dream positions.
      </motion.h2>

      <motion.ul
        className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {STATS.map((s) => (
          <motion.li
            key={s.label}
            variants={itemV}
            className="bg-[#08080d] px-5 py-8 text-center sm:py-10"
          >
            <p
              className={`${jakarta.className} text-[clamp(34px,5vw,52px)] leading-none font-semibold tracking-tight`}
            >
              <CountUp to={s.to} suffix={s.suffix} />
            </p>
            <p className="mt-3 text-sm text-white/55 sm:text-base">{s.label}</p>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
