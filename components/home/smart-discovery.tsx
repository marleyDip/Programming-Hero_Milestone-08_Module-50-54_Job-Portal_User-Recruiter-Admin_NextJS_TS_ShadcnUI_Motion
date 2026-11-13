"use client"

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import Link from "next/link"
import { useState } from "react"

import {
  ArrowIcon,
  BriefcaseIcon,
  DollarIcon,
  EASE,
  Magnetic,
  PinIcon,
  SPRING,
  SectionHeader,
  SparkleIcon,
  VIEWPORT,
  inter,
  manrope,
  useSpotlight,
} from "./shared"

// Content (sample data: swap for real data from your API)
type Category = "Engineering" | "Design" | "Data" | "Marketing"

type Job = {
  id: string
  title: string
  company: string
  desc: string
  location: string
  schedule: string
  pay: string
  match: number
  category: Category
  reason: string
}

const JOBS: Job[] = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    company: "Northwind",
    desc: "Build fast, accessible interfaces for a hiring platform used by thousands of teams.",
    location: "New York, USA",
    schedule: "Hybrid",
    pay: "€25–€40/hour",
    match: 96,
    category: "Engineering",
    reason: "Matches your React and design-systems experience.",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    company: "Lumen Labs",
    desc: "Shape end-to-end experiences from first sketch to shipped, measurable product.",
    location: "Remote",
    schedule: "Full-time",
    pay: "$90–120k/year",
    match: 94,
    category: "Design",
    reason: "Your research and prototyping work is a strong fit.",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    company: "Orbit Health",
    desc: "Turn messy hiring data into clear insights that guide leadership decisions.",
    location: "London, UK",
    schedule: "Hybrid",
    pay: "£45–60k/year",
    match: 91,
    category: "Data",
    reason: "SQL and dashboard skills line up with this role.",
  },
  {
    id: "growth-marketer",
    title: "Growth Marketer",
    company: "Brightpath",
    desc: "Own acquisition experiments across paid, lifecycle and community channels.",
    location: "Berlin, Germany",
    schedule: "On-site",
    pay: "€55–75k/year",
    match: 89,
    category: "Marketing",
    reason: "Your funnel-testing background stands out here.",
  },
  {
    id: "backend-engineer",
    title: "Backend Engineer",
    company: "Kitepay",
    desc: "Design reliable payment APIs and services that scale across regions.",
    location: "Remote",
    schedule: "Full-time",
    pay: "$120–150k/year",
    match: 93,
    category: "Engineering",
    reason: "Strong overlap with your Node and Postgres history.",
  },
  {
    id: "ux-researcher",
    title: "UX Researcher",
    company: "Fieldnote",
    desc: "Uncover what candidates really need and turn it into product direction.",
    location: "Toronto, Canada",
    schedule: "Hybrid",
    pay: "CA$80–100k/year",
    match: 90,
    category: "Design",
    reason: "Interview and synthesis experience match closely.",
  },
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    company: "Orbit Health",
    desc: "Ship models that rank and recommend roles for people across the platform.",
    location: "Remote",
    schedule: "Full-time",
    pay: "$130–170k/year",
    match: 92,
    category: "Data",
    reason: "Python and ranking projects put you near the top.",
  },
  {
    id: "content-strategist",
    title: "Content Strategist",
    company: "Brightpath",
    desc: "Plan stories and guides that help people grow their careers with confidence.",
    location: "Austin, USA",
    schedule: "Hybrid",
    pay: "$70–90k/year",
    match: 87,
    category: "Marketing",
    reason: "Your editorial portfolio fits the brief.",
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    company: "Northwind",
    desc: "Keep deployments boringly reliable with solid pipelines and observability.",
    location: "Remote",
    schedule: "Full-time",
    pay: "$110–150k/year",
    match: 95,
    category: "Engineering",
    reason: "Kubernetes and CI/CD experience are a direct match.",
  },
  {
    id: "brand-designer",
    title: "Brand Designer",
    company: "Lumen Labs",
    desc: "Give a fast-growing product a visual identity people remember.",
    location: "Amsterdam, NL",
    schedule: "On-site",
    pay: "€50–70k/year",
    match: 88,
    category: "Design",
    reason: "Your identity and motion work matches the role.",
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    company: "Kitepay",
    desc: "Detect fraud patterns and explain them clearly to product and risk teams.",
    location: "Dublin, Ireland",
    schedule: "Hybrid",
    pay: "€75–95k/year",
    match: 90,
    category: "Data",
    reason: "Statistics and experimentation skills are a fit.",
  },
  {
    id: "performance-marketer",
    title: "Performance Marketer",
    company: "Fieldnote",
    desc: "Scale paid channels with sharp creative testing and honest reporting.",
    location: "Remote",
    schedule: "Full-time",
    pay: "$65–85k/year",
    match: 86,
    category: "Marketing",
    reason: "Paid-social results show up strongly in your profile.",
  },
]

const FILTERS: ("All" | Category)[] = [
  "All",
  "Engineering",
  "Design",
  "Data",
  "Marketing",
]

// Section
export function SmartDiscovery() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All")

  const visible = (
    filter === "All" ? JOBS : JOBS.filter((j) => j.category === filter)
  ).slice(0, 6)

  return (
    <section
      id="discover"
      className={`${inter.className} relative isolate scroll-mt-24 overflow-hidden bg-[#010103] px-5 py-24 text-white sm:px-8 lg:py-32`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-px w-[70%] -translate-x-1/2 bg-linear-to-r from-transparent via-[#8f88ff]/40 to-transparent" />

        <div className="absolute top-1/3 -left-40 h-105 w-105 rounded-full bg-[#5c53fe]/12 blur-[140px]" />

        <div className="absolute -right-40 bottom-[10%] h-105 w-105 rounded-full bg-[#0ea5e9]/9 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-330">
        <SectionHeader
          eyebrow="Smart job discovery"
          title="The roles you'd never find by searching"
        />

        {/* Filters */}
        <motion.div
          className="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        >
          <div
            role="group"
            aria-label="Filter jobs by category"
            className="flex flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-white/4 p-1"
          >
            {FILTERS.map((f) => {
              const on = f === filter
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f)}
                  className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#8f88ff] ${
                    on ? "text-white" : "text-white/55 hover:text-white"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="discovery-pill"
                      className="absolute inset-0 rounded-full bg-[#5c53fe] shadow-[inset_0_2px_8px_rgba(255,255,255,0.25),0_8px_24px_-8px_rgba(92,83,254,0.9)]"
                      transition={SPRING}
                    />
                  )}
                  <span className="relative">{f}</span>
                </button>
              )
            })}
          </div>

          <p className="text-sm text-white/50" aria-live="polite">
            Showing{" "}
            <span className="text-white tabular-nums">{visible.length}</span> of
            1,284 open roles
          </p>
        </motion.div>

        {/* Cards */}
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((job, i) => (
              <motion.li
                key={job.id}
                layout="position"
                initial={{ opacity: 0, y: 36, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                exit={{
                  opacity: 0,
                  scale: 0.92,
                  transition: { duration: 0.2 },
                }}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: (i % 3) * 0.09,
                }}
              >
                <JobCard job={job} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* CTA */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Magnetic>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
            >
              <Link
                href="/jobs"
                className="group relative isolate flex h-14.5 items-center gap-2 overflow-hidden rounded-xl border border-[#090a15]/10 bg-white px-7 text-lg font-medium text-[#0b0b14] shadow-[0_10px_40px_-10px_rgba(255,255,255,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-[#c9c5ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#010103]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-[#5c53fe]/25 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100"
                />
                View all open jobs
                <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  )
}

// Card
function JobCard({ job }: { job: Job }) {
  const [saved, setSaved] = useState(false)
  const [burst, setBurst] = useState(0)
  const spot = useSpotlight("rgba(92,83,254,0.20)", 260)

  // Subtle 3D tilt toward the cursor
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const cfg = { stiffness: 200, damping: 20, mass: 0.6 }

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), cfg)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), cfg)

  return (
    <motion.div
      className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#151516] p-6 transition-colors duration-300 hover:border-[#5c53fe]/50 sm:p-8"
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={(e) => {
        spot.onMouseMove(e)
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spot.background }}
      />

      <div className="relative flex h-full flex-col">
        {/* company + match */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-linear-to-br from-[#6f66ff] to-[#38bdf8] text-sm font-bold transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
              {job.company[0]}
            </span>

            <span className="text-sm text-white/60">{job.company}</span>
          </div>

          <span className="flex items-center gap-1.5 rounded-full bg-[#5c53fe]/20 px-2.5 py-1 text-xs font-medium text-[#c9c5ff]">
            <SparkleIcon className="size-3" />
            {job.match}% match
          </span>
        </div>

        {/* title + description */}
        <h3
          className={`${manrope.className} mt-6 text-[28px] leading-tight font-semibold tracking-tight sm:text-[32px]`}
        >
          {job.title}
        </h3>

        <p className="mt-3 text-base leading-relaxed text-white/60">
          {job.desc}
        </p>

        {/* why it fits: reveals on hover, always visible on touch devices */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-focus-within:grid-rows-[1fr] group-hover:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="flex items-start gap-2 pt-3 text-sm text-[#c9c5ff]">
              <SparkleIcon className="mt-0.5 size-3.5 shrink-0" />
              {job.reason}
            </p>
          </div>
        </div>

        {/* chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Chip icon={<PinIcon className="size-4" />}>{job.location}</Chip>

          <Chip icon={<BriefcaseIcon className="size-4" />}>
            {job.schedule}
          </Chip>

          <Chip icon={<DollarIcon className="size-4" />}>{job.pay}</Chip>
        </div>

        {/* actions */}
        <div className="mt-auto flex items-center gap-3 pt-8">
          <Link
            href={`/jobs/${job.id}`}
            className="group/apply flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/4 px-5 text-base font-semibold text-white transition-all duration-300 outline-none group-hover:border-[#5c53fe]/40 hover:border-transparent hover:bg-[#5c53fe] hover:shadow-[0_10px_30px_-8px_rgba(92,83,254,0.8)] focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
          >
            Apply Now
            <ArrowIcon className="size-4 transition-transform duration-300 group-hover/apply:translate-x-1" />
          </Link>

          <motion.button
            type="button"
            aria-pressed={saved}
            aria-label={
              saved
                ? `Remove ${job.title} from saved jobs`
                : `Save ${job.title}`
            }
            whileTap={{ scale: 0.85 }}
            onClick={() => {
              if (!saved) setBurst((b) => b + 1)
              setSaved((s) => !s)
            }}
            className={`relative grid size-12 shrink-0 place-items-center rounded-xl border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#8f88ff] ${
              saved
                ? "border-[#5c53fe]/60 bg-[#5c53fe]/15 text-[#a8a2ff]"
                : "border-white/10 bg-white/4 text-white/60 hover:text-white"
            }`}
          >
            <motion.svg
              viewBox="0 0 24 24"
              className="size-5"
              animate={{ scale: saved ? [1, 1.35, 1] : 1 }}
              transition={{ duration: 0.4 }}
              aria-hidden
            >
              <path
                d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </motion.svg>

            {burst > 0 && (
              <span
                key={burst}
                aria-hidden
                className="pointer-events-none absolute inset-0"
              >
                {Array.from({ length: 7 }).map((_, i) => {
                  const a = (i / 7) * Math.PI * 2
                  return (
                    <motion.span
                      key={i}
                      className="absolute top-1/2 left-1/2 size-1 rounded-full bg-[#8f88ff]"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos(a) * 26,
                        y: Math.sin(a) * 26,
                        opacity: 0,
                        scale: 0.3,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  )
                })}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function Chip({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <span className="flex items-center gap-2 rounded-full bg-[#1f1f1f] px-3 py-1.5 text-sm font-medium text-white/85">
      <span className="text-white/50">{icon}</span>
      {children}
    </span>
  )
}
