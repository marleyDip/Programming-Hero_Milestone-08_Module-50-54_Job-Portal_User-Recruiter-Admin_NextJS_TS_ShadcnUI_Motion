"use client"

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

// Content
const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
] as const

const SIGN_IN_HREF = "/sign-in"
const SIGN_UP_HREF = "/sign-up"

// Motion
const SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const

const panelVariants: Variants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
}

const itemVariants: Variants = {
  closed: { opacity: 0, x: -12 },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
}

// Navbar
export function Navbar() {
  const pathname = usePathname()
  const { scrollY } = useScroll()

  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  // Condense once the page moves; hide on scroll down, reveal on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)

    setHidden(y > previous && y > 320 && !open)
  })

  // Close on Escape, and when the viewport grows into the desktop layout.
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)

    const mq = window.matchMedia("(min-width: 1024px)")

    const onChange = () => mq.matches && setOpen(false)

    window.addEventListener("keydown", onKey)
    mq.addEventListener("change", onChange)

    return () => {
      window.removeEventListener("keydown", onKey)
      mq.removeEventListener("change", onChange)
    }
  }, [open])

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : ""

    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [open])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <MotionConfig reducedMotion="user">
      {/* Dim + blur the page behind the open mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            aria-hidden
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-5"
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.nav
          aria-label="Main"
          className={cn(
            "pointer-events-auto relative w-full overflow-hidden rounded-2xl border",
            "font-sans backdrop-blur-xl"
          )}
          initial={{ opacity: 0, y: -24 }}
          animate={{
            opacity: 1,
            y: 0,
            maxWidth: scrolled ? 920 : 1320,
            backgroundColor: scrolled
              ? "rgba(26, 26, 31, 0.82)"
              : "rgba(34, 34, 34, 0.60)",
            borderColor: scrolled
              ? "rgba(255, 255, 255, 0.10)"
              : "rgba(255, 255, 255, 0.07)",
            boxShadow: scrolled
              ? "0 12px 40px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(92, 83, 254, 0.06)"
              : "0 4px 4px rgba(0, 0, 0, 0.12)",
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Main row */}
          <div className="flex h-15 items-center justify-between pr-3 pl-5 sm:h-17 lg:h-18.5 lg:pr-4 lg:pl-6">
            <Link
              href="/"
              aria-label="Hireloop home"
              onClick={() => setOpen(false)}
              className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
            >
              <motion.span
                className="block"
                whileHover={{ scale: 1.04, rotate: -1.5 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING}
              >
                <Image
                  src="/hireloop-logo.png"
                  alt="Hireloop"
                  width={300}
                  height={84}
                  priority
                  className="h-8 w-auto sm:h-9"
                />
              </motion.span>
            </Link>

            {/* Desktop */}
            <div className="hidden items-center gap-6 lg:flex">
              <ul
                className="flex items-center gap-1"
                onMouseLeave={() => setHovered(null)}
              >
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href)
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        onMouseEnter={() => setHovered(link.href)}
                        onFocus={() => setHovered(link.href)}
                        onBlur={() => setHovered(null)}
                        className={cn(
                          "relative block rounded-lg px-4 py-2 text-[15px] transition-colors duration-200 outline-none",
                          "focus-visible:ring-2 focus-visible:ring-[#8f88ff]",
                          active || hovered === link.href
                            ? "text-white"
                            : "text-[#a0a0ab]",
                          active && "font-medium"
                        )}
                      >
                        {hovered === link.href && (
                          <motion.span
                            layoutId="nav-hover"
                            className="absolute inset-0 rounded-lg bg-white/[0.07]"
                            transition={SPRING}
                          />
                        )}
                        <span className="relative">{link.label}</span>
                        {active && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-[#5c53fe] shadow-[0_0_12px_2px_rgba(92,83,254,0.65)]"
                            transition={SPRING}
                          />
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <span aria-hidden className="h-6 w-px bg-[#a8a8a8]/40" />

              <div className="flex items-center gap-2">
                <Link
                  href={SIGN_IN_HREF}
                  className="rounded-lg px-4 py-2 text-[15px] font-semibold text-[#8f88ff] transition-colors duration-200 outline-none hover:bg-[#5c53fe]/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
                >
                  Sign in
                </Link>
                <GetStartedButton />
              </div>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-lg text-white transition-colors outline-none hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#8f88ff] lg:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <motion.span
                  className="absolute left-0 h-0.5 w-5 rounded-full bg-current"
                  initial={false}
                  animate={
                    open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }
                  }
                  transition={SPRING}
                />
                <motion.span
                  className="absolute top-1.5 left-0 h-0.5 w-5 rounded-full bg-current"
                  initial={false}
                  animate={
                    open
                      ? { opacity: 0, scaleX: 0.2 }
                      : { opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.18 }}
                />
                <motion.span
                  className="absolute left-0 h-0.5 w-5 rounded-full bg-current"
                  initial={false}
                  animate={
                    open ? { top: 6, rotate: -45 } : { top: 12, rotate: 0 }
                  }
                  transition={SPRING}
                />
              </span>
            </button>
          </div>

          {/* Mobile panel: the bar itself grows downward */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id="mobile-menu"
                key="panel"
                onClick={() => setOpen(false)}
                variants={panelVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="overflow-hidden lg:hidden"
              >
                <div className="border-t border-white/[0.07] px-3 pt-3 pb-4">
                  <ul className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => {
                      const active = isActive(link.href)
                      return (
                        <motion.li key={link.href} variants={itemVariants}>
                          <Link
                            href={link.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex items-center justify-between rounded-xl px-4 py-3.5 text-base transition-colors outline-none",
                              "focus-visible:ring-2 focus-visible:ring-[#8f88ff]",
                              active
                                ? "bg-white/6 font-medium text-white"
                                : "text-[#c4c4cc] hover:bg-white/5 hover:text-white"
                            )}
                          >
                            {link.label}
                            {active && (
                              <span className="size-1.5 rounded-full bg-[#5c53fe] shadow-[0_0_10px_2px_rgba(92,83,254,0.7)]" />
                            )}
                          </Link>
                        </motion.li>
                      )
                    })}
                  </ul>

                  <motion.div
                    variants={itemVariants}
                    className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-4"
                  >
                    <Link
                      href={SIGN_IN_HREF}
                      className="grid h-11 place-items-center rounded-xl border border-white/10 text-[15px] font-semibold text-[#c9c5ff] transition-colors outline-none hover:bg-white/6 focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
                    >
                      Sign in
                    </Link>
                    <GetStartedButton fullWidth />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </motion.header>
    </MotionConfig>
  )
}

// Primary CTA
function GetStartedButton({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <motion.div
      className={fullWidth ? "w-full" : undefined}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={SPRING}
    >
      <Link
        href={SIGN_UP_HREF}
        className={cn(
          "group relative isolate grid place-items-center overflow-hidden rounded-lg border border-[#090a15]/10 bg-[#5c53fe] text-[15px] font-medium text-[#ededef] outline-none",
          "shadow-[inset_0_3px_10px_rgba(255,255,255,0.20)] transition-colors duration-200 hover:bg-[#6a62ff]",
          "focus-visible:ring-2 focus-visible:ring-[#c9c5ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f]",
          fullWidth ? "h-11 w-full rounded-xl" : "h-10 px-5"
        )}
      >
        {/* light sweep on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100"
        />
        Get started
      </Link>
    </motion.div>
  )
}
