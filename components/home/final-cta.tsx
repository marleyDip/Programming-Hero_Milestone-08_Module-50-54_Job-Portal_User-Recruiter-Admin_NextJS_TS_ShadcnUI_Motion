"use client"

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { ArrowRight, Bell } from "lucide-react"
import { Rethink_Sans } from "next/font/google"
import Link from "next/link"
import { useEffect, useState } from "react"

import { EASE, Magnetic, SPRING, VIEWPORT, manrope } from "./shared"

const rethink = Rethink_Sans({ subsets: ["latin"], display: "swap" })

const LINES = [
  ["Your", "next", "role", "is"],
  ["already", "looking", "for", "you"],
]

const MATCHES = [
  { role: "Senior Product Designer", company: "Northwind", score: 96 },
  { role: "Machine Learning Engineer", company: "Orbit Health", score: 94 },
  { role: "Frontend Developer", company: "Lumen Labs", score: 93 },
  { role: "Growth Marketer", company: "Brightpath", score: 91 },
]

// Matches "found" by the radar: position from the center (px) and blink delay
const BLIPS = [
  { x: -470, y: -150, delay: 0.4 },
  { x: 520, y: -210, delay: 1.9 },
  { x: -410, y: 210, delay: 3.2 },
  { x: 470, y: 180, delay: 4.6 },
]

export function FinalCta() {
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useMotionValue(-999)
  const sy = useMotionValue(-999)
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, rgba(143,136,255,0.12), transparent 65%)`
  const glowX = useSpring(useTransform(px, [-0.5, 0.5], [-50, 50]), {
    stiffness: 60,
    damping: 20,
  })
  const glowY = useSpring(useTransform(py, [-0.5, 0.5], [-30, 30]), {
    stiffness: 60,
    damping: 20,
  })

  return (
    <section
      id="get-started"
      className={`${manrope.className} relative isolate overflow-hidden bg-[#010103] px-5 py-28 text-white sm:px-8 lg:py-44`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        px.set((e.clientX - r.left) / r.width - 0.5)
        py.set((e.clientY - r.top) / r.height - 0.5)
        sx.set(e.clientX - r.left)
        sy.set(e.clientY - r.top)
      }}
    >
      {/* Backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* line grid (the "BG Grid" in the Figma) */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(143,136,255,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(143,136,255,0.10) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 60% 65% at 50% 50%, black, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 65% at 50% 50%, black, transparent 75%)",
          }}
        />

        {/* big purple radial glow (the Figma "Gradient" ellipse) */}
        <motion.div
          className="absolute top-1/2 left-1/2 -mt-[380px] -ml-[590px] h-[760px] w-[1180px] rounded-full"
          style={{
            x: glowX,
            y: glowY,
            background:
              "radial-gradient(closest-side, rgba(92,83,254,0.55), rgba(92,83,254,0.26) 50%, rgba(92,83,254,0) 100%)",
          }}
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* radar: faint rings + expanding pulses, centered on the headline */}
        <div className="absolute top-1/2 left-1/2 size-0">
          {[300, 520, 760, 1020].map((d) => (
            <span
              key={d}
              className="absolute rounded-full border border-white/[0.07]"
              style={{ width: d, height: d, left: -d / 2, top: -d / 2 }}
            />
          ))}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute rounded-full border border-[#8f88ff]/40"
              style={{ width: 300, height: 300, left: -150, top: -150 }}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 3.6], opacity: [0.7, 0] }}
              transition={{
                duration: 7.5,
                delay: i * 2.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
          {BLIPS.map((b) => (
            <span
              key={`${b.x}-${b.y}`}
              className="absolute hidden lg:block"
              style={{ left: b.x, top: b.y }}
            >
              <motion.span
                className="absolute -top-1.5 -left-1.5 size-3 rounded-full bg-[#38bdf8]"
                style={{ boxShadow: "0 0 16px 3px rgba(56,189,248,0.7)" }}
                animate={{ opacity: [0.15, 1, 0.15], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 5,
                  delay: b.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.span
                className="absolute -top-4 -left-4 size-8 rounded-full border border-[#38bdf8]/60"
                animate={{ scale: [0.5, 1.8], opacity: [0.7, 0] }}
                transition={{
                  duration: 5,
                  delay: b.delay,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </span>
          ))}
        </div>

        {/* cursor light */}
        <motion.div
          className="absolute inset-0"
          style={{ background: spotlight }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#010103] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#010103] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex max-w-[840px] flex-col items-center text-center">
        <h2
          className={`${rethink.className} text-[clamp(40px,7.4vw,72px)] leading-[1.06] font-medium tracking-[-0.03em]`}
        >
          {LINES.map((line, li) => (
            <span
              key={li}
              className="flex flex-wrap justify-center gap-x-[0.27em]"
            >
              {line.map((w, wi) => {
                const accent = li === 1 && wi >= 1
                return (
                  <span
                    key={w}
                    className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em]"
                  >
                    <motion.span
                      className={`inline-block ${accent ? "bg-gradient-to-r from-[#d6d3ff] via-[#8f88ff] to-[#38bdf8] bg-clip-text text-transparent" : ""}`}
                      initial={{ y: "110%", opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={VIEWPORT}
                      transition={{
                        duration: 0.8,
                        ease: EASE,
                        delay: 0.1 + (li * 4 + wi) * 0.07,
                      }}
                    >
                      {w}
                    </motion.span>
                  </span>
                )
              })}
            </span>
          ))}
        </h2>

        <motion.p
          className="mt-6 max-w-[620px] text-lg leading-relaxed text-white/70 sm:text-xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
        >
          Build a profile in three minutes. The matches start arriving tomorrow
          morning.
        </motion.p>

        <MatchTicker />

        <motion.div
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE, delay: 1 }}
        >
          <Magnetic>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
            >
              <Link
                href="/sign-up"
                className="group relative isolate flex h-[58px] items-center gap-2 overflow-hidden rounded-xl border border-[#090a15]/10 bg-white px-7 text-lg font-semibold text-[#0b0b14] shadow-[0_14px_50px_-12px_rgba(255,255,255,0.5)] outline-none focus-visible:ring-2 focus-visible:ring-[#c9c5ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#010103]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-[#5c53fe]/25 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100"
                />
                Create a free account
                <ArrowRight
                  className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </motion.div>
          </Magnetic>

          <Magnetic>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
            >
              <Link
                href="/pricing"
                className="flex h-[58px] items-center rounded-xl border border-white/30 bg-[#0e0b16]/70 px-7 text-lg font-medium text-white backdrop-blur-md transition-all duration-300 outline-none hover:border-[#8f88ff]/70 hover:bg-[#5c53fe]/20 hover:shadow-[0_10px_40px_-10px_rgba(92,83,254,0.8)] focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
              >
                View pricing
              </Link>
            </motion.div>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  )
}

/** A small rotating "new match" notice that shows what arrives tomorrow morning. */
function MatchTicker() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % MATCHES.length), 3200)
    return () => clearInterval(id)
  }, [])
  const m = MATCHES[i]

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE, delay: 0.85 }}
    >
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] py-2 pr-5 pl-2 backdrop-blur-xl">
        <span className="relative grid size-8 place-items-center rounded-full bg-[linear-gradient(135deg,#7a72ff,#5c53fe)] text-white shadow-[0_0_18px_-2px_rgba(92,83,254,0.9)]">
          <Bell className="size-4" aria-hidden />
          <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
          </span>
        </span>
        <span
          className="relative block h-5 w-[min(72vw,370px)] overflow-hidden text-left text-sm sm:text-[15px]"
          aria-live="polite"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={m.role}
              className="absolute inset-0 truncate leading-5 text-white/80"
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <span className="text-white/50">New match: </span>
              <span className="font-medium text-white">{m.role}</span>
              <span className="text-white/50"> · {m.company} · </span>
              <span className="font-medium text-[#a8a2ff]">{m.score}%</span>
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </motion.div>
  )
}
