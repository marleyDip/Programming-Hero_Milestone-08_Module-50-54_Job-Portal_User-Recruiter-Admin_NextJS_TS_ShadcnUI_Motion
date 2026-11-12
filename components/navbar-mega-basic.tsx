"use client"

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"

import { cn } from "@/lib/utils"

// Content (sample data: replace with real data from your API)
type MenuId = "jobs" | "companies"

const CATEGORIES = [
  { name: "Engineering", count: "2,481", slug: "engineering" },
  { name: "Design", count: "612", slug: "design" },
  { name: "Product", count: "438", slug: "product" },
  { name: "Marketing", count: "790", slug: "marketing" },
  { name: "Sales", count: "1,126", slug: "sales" },
  { name: "Customer support", count: "534", slug: "support" },
  { name: "Data & analytics", count: "377", slug: "data" },
  { name: "Operations", count: "465", slug: "operations" },
]

const WORK_STYLES = [
  { name: "Remote", slug: "remote" },
  { name: "Hybrid", slug: "hybrid" },
  { name: "On-site", slug: "onsite" },
  { name: "Part-time", slug: "part-time" },
  { name: "Internships", slug: "internship" },
]

const COMPANIES = [
  { name: "Northwind", roles: 34, hue: "#5c53fe" },
  { name: "Lumen Labs", roles: 21, hue: "#0ea5e9" },
  { name: "Brightpath", roles: 18, hue: "#f97316" },
  { name: "Kitepay", roles: 15, hue: "#22c55e" },
  { name: "Orbit Health", roles: 12, hue: "#ec4899" },
  { name: "Fieldnote", roles: 9, hue: "#eab308" },
]

const INDUSTRIES = [
  "Fintech",
  "Healthcare",
  "E-commerce",
  "Education",
  "Climate",
]

const TRENDING = [
  "Frontend engineer",
  "Product designer",
  "Remote data analyst",
  "Customer success manager",
  "Marketing manager",
  "Backend engineer",
]

const SIMPLE_LINKS = [
  { label: "Career advice", href: "/advice" },
  { label: "Pricing", href: "/pricing" },
]

// Motion
const SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const
const EASE = [0.22, 1, 0.36, 1] as const
const subscribeToPlatform = () => () => {}
const getPlatformIsMac = () => /Mac|iPhone|iPad/.test(navigator.platform)

// Small icons
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

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 16 16"
      fill="none"
      className="size-3.5"
      aria-hidden
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  )
}

// Navbar
export function NavbarMega() {
  const pathname = usePathname()

  const [menu, setMenu] = useState<MenuId | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const isMac = useSyncExternalStore(
    subscribeToPlatform,
    getPlatformIsMac,
    () => true
  )
  const [previousPathname, setPreviousPathname] = useState(pathname)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset transient UI during the render that observes a route change.
  if (previousPathname !== pathname) {
    setPreviousPathname(pathname)
    setMenu(null)
    setDrawer(false)
    setSearchOpen(false)
  }

  // Reading progress line along the bottom edge of the bar
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  })

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8))

  const openMenu = useCallback((id: MenuId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMenu(id)
  }, [])

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setMenu(null), 140)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  // ⌘K / Ctrl+K opens search, Escape closes menus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setMenu(null)
        setSearchOpen((v) => !v)
      }
      if (e.key === "Escape") setMenu(null)
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Scroll lock for drawer + search
  useEffect(() => {
    document.documentElement.style.overflow =
      drawer || searchOpen ? "hidden" : ""

    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [drawer, searchOpen])

  // Leave drawer when growing into desktop layout
  useEffect(() => {
    if (!drawer) return

    const mq = window.matchMedia("(min-width: 1024px)")
    const onChange = () => mq.matches && setDrawer(false)

    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [drawer])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <MotionConfig reducedMotion="user">
      <header
        className={cn(
          "sticky top-0 z-50 font-sans backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300",
          "border-b",
          scrolled
            ? "border-white/10 bg-[#0c0c0f]/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.7)]"
            : "border-white/6 bg-[#0c0c0f]/55"
        )}
        onMouseLeave={scheduleClose}
      >
        <motion.div
          className="mx-auto flex h-16 w-full max-w-330 items-center gap-2 px-4 sm:px-6 lg:h-17"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Hireloop home"
            className="mr-2 shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#8f88ff] lg:mr-6"
          >
            <motion.span
              className="block"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
            >
              <Image
                src="/hireloop-logo.png"
                alt="Hireloop"
                width={300}
                height={84}
                priority
                className="h-8 w-auto"
              />
            </motion.span>
          </Link>

          {/* Desktop primary nav */}
          <nav
            aria-label="Main"
            className="hidden items-center lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {(
              [
                { id: "jobs", label: "Find jobs" },
                { id: "companies", label: "Companies" },
              ] as const
            ).map((item) => {
              const open = menu === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={open}
                  aria-controls={`mega-${item.id}`}
                  onMouseEnter={() => {
                    setHovered(item.id)
                    openMenu(item.id)
                  }}
                  onClick={() => (open ? setMenu(null) : openMenu(item.id))}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[15px] transition-colors duration-200 outline-none",
                    "focus-visible:ring-2 focus-visible:ring-[#8f88ff]",
                    open || hovered === item.id
                      ? "text-white"
                      : "text-[#a0a0ab]"
                  )}
                >
                  {hovered === item.id && (
                    <motion.span
                      layoutId="mega-hover"
                      className="absolute inset-0 rounded-lg bg-white/[0.07]"
                      transition={SPRING}
                    />
                  )}

                  <span className="relative">{item.label}</span>
                  <span className="relative">
                    <Chevron open={open} />
                  </span>
                </button>
              )
            })}

            {SIMPLE_LINKS.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => {
                    setHovered(link.href)
                    scheduleClose()
                  }}
                  className={cn(
                    "relative rounded-lg px-3.5 py-2 text-[15px] transition-colors duration-200 outline-none",
                    "focus-visible:ring-2 focus-visible:ring-[#8f88ff]",
                    active || hovered === link.href
                      ? "text-white"
                      : "text-[#a0a0ab]"
                  )}
                >
                  {hovered === link.href && (
                    <motion.span
                      layoutId="mega-hover"
                      className="absolute inset-0 rounded-lg bg-white/[0.07]"
                      transition={SPRING}
                    />
                  )}

                  <span className="relative">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex-1" />

          {/* Search trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search jobs and companies"
            className="group hidden h-10 items-center gap-2.5 rounded-xl border border-white/10 bg-white/3 px-3 text-sm text-[#828997] transition-colors outline-none hover:border-white/20 hover:bg-white/6 hover:text-white focus-visible:ring-2 focus-visible:ring-[#8f88ff] lg:flex xl:w-72.5"
          >
            <SearchIcon className="size-4.5 shrink-0" />
            <span className="hidden flex-1 text-left xl:block">
              Search jobs or companies
            </span>

            <kbd className="hidden rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-sans text-[11px] text-[#a0a0ab] xl:block">
              {isMac ? "⌘" : "Ctrl"} K
            </kbd>
          </button>

          {/* Desktop auth */}
          <div className="hidden items-center gap-1.5 lg:flex">
            <Link
              href="/sign-in"
              className="rounded-lg px-3.5 py-2 text-[15px] font-medium text-white transition-colors outline-none hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
            >
              Sign in
            </Link>

            <PostJobButton />
          </div>

          {/* Mobile actions */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="grid size-10 place-items-center rounded-lg text-white transition-colors outline-none hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#8f88ff] lg:hidden"
          >
            <SearchIcon className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
            aria-expanded={drawer}
            className="grid size-10 place-items-center rounded-lg text-white transition-colors outline-none hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#8f88ff] lg:hidden"
          >
            <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden>
              <path
                d="M3 6h14M3 10h14M3 14h9"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </motion.div>

        {/* Reading progress */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-px origin-left bg-linear-to-r from-[#5c53fe] via-[#8f88ff] to-[#0ea5e9]"
          style={{ scaleX: progress }}
        />

        {/* Mega panel */}
        <div className="pointer-events-none absolute inset-x-0 top-full hidden px-6 lg:block">
          <div className="mx-auto max-w-330">
            <AnimatePresence>
              {menu && (
                <motion.div
                  key="mega"
                  layout
                  style={{ borderRadius: 20 }}
                  className="pointer-events-auto mt-2 overflow-hidden border border-white/10 bg-[#121216]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
                  initial={{ opacity: 0, y: -8, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    y: -6,
                    scale: 0.99,
                    transition: { duration: 0.15 },
                  }}
                  transition={{
                    duration: 0.28,
                    ease: EASE,
                    layout: { duration: 0.3, ease: EASE },
                  }}
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {menu === "jobs" ? (
                      <JobsPanel key="jobs" />
                    ) : (
                      <CompaniesPanel key="companies" />
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <SearchPalette
        key={searchOpen ? "open" : "closed"}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} />
    </MotionConfig>
  )
}

// Mega panels
const panelMotion = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.22, ease: EASE } },
  exit: { opacity: 0, x: -12, transition: { duration: 0.12 } },
}

function PanelHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 px-3 text-[13px] font-medium text-[#828997]">
      {children}
    </p>
  )
}

function JobsPanel() {
  return (
    <motion.div
      id="mega-jobs"
      {...panelMotion}
      className="grid grid-cols-12 gap-8 p-6"
    >
      <div className="col-span-5">
        <PanelHeading>Browse by category</PanelHeading>

        <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/jobs?category=${c.slug}`}
                className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] text-[#d4d4d8] transition-colors outline-none hover:bg-white/6 hover:text-white focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
              >
                <span>{c.name}</span>
                <span className="text-xs text-[#6b6b75] tabular-nums transition-colors group-hover:text-[#8f88ff]">
                  {c.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-3">
        <PanelHeading>Work style</PanelHeading>
        <ul className="flex flex-col gap-0.5">
          {WORK_STYLES.map((w) => (
            <li key={w.slug}>
              <Link
                href={`/jobs?type=${w.slug}`}
                className="block rounded-lg px-3 py-2.5 text-[15px] text-[#d4d4d8] transition-colors outline-none hover:bg-white/6 hover:text-white focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
              >
                {w.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-4">
        <Link
          href="/sign-up"
          className="group relative flex h-full min-h-55 flex-col justify-end overflow-hidden rounded-2xl border border-[#5c53fe]/30 bg-[#17142e] p-5 outline-none focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
        >
          <div
            aria-hidden
            className="absolute -top-16 -right-10 size-56 rounded-full bg-[#5c53fe]/50 blur-3xl transition-transform duration-700 group-hover:scale-125"
          />

          <div
            aria-hidden
            className="absolute -bottom-20 -left-10 size-48 rounded-full bg-[#0ea5e9]/25 blur-3xl transition-transform duration-700 group-hover:scale-125"
          />

          <p className="relative text-lg leading-snug font-semibold text-white">
            Get matched with roles that fit you
          </p>

          <p className="relative mt-1.5 text-sm leading-relaxed text-[#b9b6e8]">
            Tell us what you want and Hireloop shows the jobs worth your time.
          </p>

          <span className="relative mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-[#17142e] transition-transform duration-300 group-hover:translate-x-0.5">
            Start matching
          </span>
        </Link>
      </div>
    </motion.div>
  )
}

function CompaniesPanel() {
  return (
    <motion.div
      id="mega-companies"
      {...panelMotion}
      className="grid grid-cols-12 gap-8 p-6"
    >
      <div className="col-span-8">
        <PanelHeading>Hiring right now</PanelHeading>

        <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5">
          {COMPANIES.map((c) => (
            <li key={c.name}>
              <Link
                href={`/company/${c.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors outline-none hover:bg-white/6 focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
              >
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-lg text-sm font-semibold text-white"
                  style={{
                    backgroundColor: `${c.hue}33`,
                    boxShadow: `inset 0 0 0 1px ${c.hue}55`,
                  }}
                >
                  {c.name[0]}
                </span>

                <span className="flex flex-col">
                  <span className="text-[15px] text-white">{c.name}</span>
                  <span className="text-xs text-[#828997]">
                    {c.roles} open roles
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-4 flex flex-col">
        <PanelHeading>Browse by industry</PanelHeading>

        <ul className="flex flex-col gap-0.5">
          {INDUSTRIES.map((i) => (
            <li key={i}>
              <Link
                href={`/company?industry=${i.toLowerCase()}`}
                className="block rounded-lg px-3 py-2.5 text-[15px] text-[#d4d4d8] transition-colors outline-none hover:bg-white/6 hover:text-white focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
              >
                {i}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/company"
          className="mt-auto rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#8f88ff] transition-colors outline-none hover:bg-[#5c53fe]/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
        >
          See all companies
        </Link>
      </div>
    </motion.div>
  )
}

// Primary CTA
function PostJobButton({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <motion.div
      className={fullWidth ? "w-full" : undefined}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={SPRING}
    >
      <Link
        href="/employers/post"
        className={cn(
          "group relative isolate grid place-items-center overflow-hidden border border-[#090a15]/10 bg-[#5c53fe] text-[15px] font-medium text-[#ededef] outline-none",
          "shadow-[inset_0_3px_10px_rgba(255,255,255,0.20)] transition-colors duration-200 hover:bg-[#6a62ff]",
          "focus-visible:ring-2 focus-visible:ring-[#c9c5ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0f]",
          fullWidth ? "h-12 w-full rounded-xl" : "h-10 rounded-lg px-4"
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100"
        />
        Post a job
      </Link>
    </motion.div>
  )
}

// Search palette (⌘K)
function SearchPalette({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [index, setIndex] = useState(0)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = TRENDING.filter((t) => t.toLowerCase().includes(q))

    return q
      ? [
          `Search "${query.trim()}"`,
          ...matches.filter((m) => m.toLowerCase() !== q),
        ]
      : matches
  }, [query])

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const go = (i: number) => {
    const raw = results[i]
    if (!raw) return

    const term = query.trim() && i === 0 ? query.trim() : raw
    router.push(`/jobs?q=${encodeURIComponent(term)}`)
    onClose()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose()
    else if (e.key === "ArrowDown") {
      e.preventDefault()
      setIndex((v) => Math.min(v + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setIndex((v) => Math.max(v - 1, 0))
    } else if (e.key === "Enter") go(index)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search"
          className="fixed inset-0 z-60 flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#121216] font-sans shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
              <SearchIcon className="size-5 shrink-0 text-[#828997]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setIndex(0)
                }}
                placeholder="Search jobs, skills or companies"
                aria-label="Search jobs, skills or companies"
                className="h-14 w-full bg-transparent text-base text-white placeholder:text-[#6b6b75] focus:outline-none"
              />
              <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 text-[11px] text-[#828997]">
                Esc
              </kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              <p className="px-3 pt-2 pb-1.5 text-[13px] font-medium text-[#828997]">
                {query.trim() ? "Suggestions" : "Popular searches"}
              </p>

              {results.length === 0 ? (
                <p className="px-3 py-6 text-sm text-[#828997]">
                  No matches. Press Enter to search anyway.
                </p>
              ) : (
                <ul role="listbox">
                  {results.map((r, i) => (
                    <li key={r} role="option" aria-selected={i === index}>
                      <button
                        type="button"
                        onMouseEnter={() => setIndex(i)}
                        onClick={() => go(i)}
                        className="relative flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[15px] text-[#d4d4d8] outline-none"
                      >
                        {i === index && (
                          <motion.span
                            layoutId="palette-active"
                            className="absolute inset-0 rounded-lg bg-white/[0.07]"
                            transition={SPRING}
                          />
                        )}
                        <SearchIcon className="relative size-4 shrink-0 text-[#6b6b75]" />
                        <span
                          className={cn(
                            "relative",
                            i === index && "text-white"
                          )}
                        >
                          {r}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Mobile drawer
function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [section, setSection] = useState<MenuId | null>(null)
  const closeDrawer = useCallback(() => {
    setSection(null)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer()
    window.addEventListener("keydown", onKey)

    return () => window.removeEventListener("keydown", onKey)
  }, [open, closeDrawer])

  const toggle = (id: MenuId) => setSection((s) => (s === id ? null : id))

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            aria-hidden
            className="fixed inset-0 z-55 bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />

          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-y-0 right-0 z-56 flex w-[min(92vw,400px)] flex-col border-l border-white/10 bg-[#0f0f13] font-sans lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.5 }}
            onDragEnd={(_, info) =>
              (info.offset.x > 100 || info.velocity.x > 500) && closeDrawer()
            }
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
              <Image
                src="/hireloop-logo.png"
                alt="Hireloop"
                width={300}
                height={84}
                className="h-7 w-auto"
              />

              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-lg text-white transition-colors outline-none hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="size-5"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="m5 5 10 10M15 5 5 15"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3">
              <motion.ul
                initial="closed"
                animate="open"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.12 },
                  },
                }}
                className="flex flex-col"
              >
                {(
                  [
                    { id: "jobs", label: "Find jobs" },
                    { id: "companies", label: "Companies" },
                  ] as const
                ).map((s) => {
                  const expanded = section === s.id
                  return (
                    <DrawerItem key={s.id}>
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => toggle(s.id)}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-[17px] text-white transition-colors outline-none hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
                      >
                        {s.label}
                        <Chevron open={expanded} />
                      </button>

                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <ul className="mb-2 ml-4 flex flex-col border-l border-white/10 py-1 pl-2">
                              {(s.id === "jobs"
                                ? [
                                    ...CATEGORIES.slice(0, 6).map((c) => ({
                                      label: c.name,
                                      href: `/jobs?category=${c.slug}`,
                                    })),
                                    {
                                      label: "All remote jobs",
                                      href: "/jobs?type=remote",
                                    },
                                  ]
                                : [
                                    ...COMPANIES.slice(0, 4).map((c) => ({
                                      label: c.name,
                                      href: `/company/${c.name.toLowerCase().replace(/\s+/g, "-")}`,
                                    })),
                                    {
                                      label: "See all companies",
                                      href: "/company",
                                    },
                                  ]
                              ).map((l) => (
                                <li key={l.href} className="list-none">
                                  <Link
                                    href={l.href}
                                    className="block rounded-lg px-3 py-2.5 text-[15px] text-[#a0a0ab] transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
                                  >
                                    {l.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </DrawerItem>
                  )
                })}

                {SIMPLE_LINKS.map((l) => (
                  <DrawerItem key={l.href}>
                    <Link
                      href={l.href}
                      className="block rounded-xl px-4 py-3.5 text-[17px] text-white transition-colors outline-none hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
                    >
                      {l.label}
                    </Link>
                  </DrawerItem>
                ))}
              </motion.ul>
            </div>

            <div className="grid shrink-0 gap-2 border-t border-white/[0.07] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <PostJobButton fullWidth />

              <Link
                href="/sign-in"
                className="grid h-12 place-items-center rounded-xl border border-white/10 text-[15px] font-medium text-white transition-colors outline-none hover:bg-white/6 focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
              >
                Sign in
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function DrawerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.li
      variants={{
        closed: { opacity: 0, x: 16 },
        open: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } },
      }}
    >
      {children}
    </motion.li>
  )
}
