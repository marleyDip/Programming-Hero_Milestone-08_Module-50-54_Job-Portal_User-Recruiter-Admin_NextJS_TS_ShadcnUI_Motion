"use client"

import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const EASE = [0.22, 1, 0.36, 1] as const
const SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const

const container: Variants = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const rise: Variants = {
  hidden: { opacity: 0, y: 20 },

  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
}

const POPULAR = [
  { label: "Remote", href: "/jobs?type=remote" },
  { label: "Engineering", href: "/jobs?category=engineering" },
  { label: "Design", href: "/jobs?category=design" },
  { label: "Internships", href: "/jobs?type=internship" },
]

// Page
export function NotFoundParticles() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const [seconds, setSeconds] = useState(0)

  // "Lost for 0:12" counter
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // Press "/" anywhere to jump to the search field
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null

      if (
        e.key === "/" &&
        t &&
        !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) &&
        !t.isContentEditable
      ) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const lost = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative isolate flex min-h-[calc(100dvh-4.25rem)] flex-col items-center justify-center overflow-hidden px-6 py-14 font-sans">
        {/* Backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-[18%] left-1/2 h-105 w-190 -translate-x-1/2 rounded-full bg-[#5c53fe]/20 blur-[130px]" />

          <div className="absolute top-[30%] left-[12%] h-65 w-85 rounded-full bg-[#0ea5e9]/10 blur-[110px]" />

          <div className="absolute top-[34%] right-[10%] h-65 w-85 rounded-full bg-[#f97316]/10 blur-[110px]" />

          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)",
            }}
          />
        </div>

        <motion.div
          className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Interactive particle 404 */}
          <motion.div variants={rise} className="w-full">
            <ParticleField onInteract={() => setInteracted(true)} />
          </motion.div>

          {/* Hint + lost timer */}
          <motion.div
            variants={rise}
            className="mt-2 flex h-8 items-center justify-center"
          >
            <AnimatePresence mode="wait" initial={false}>
              {!interacted ? (
                <motion.span
                  key="hint"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3.5 py-1.5 text-[13px] text-[#a0a0ab] backdrop-blur-md"
                >
                  <motion.span
                    aria-hidden
                    className="size-1.5 rounded-full bg-[#8f88ff]"
                    animate={{ scale: [1, 1.7, 1], opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  Move your cursor through it. Click to scatter.
                </motion.span>
              ) : (
                <motion.span
                  key="timer"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-[13px] text-[#6b6b75]"
                >
                  Lost for{" "}
                  <span className="text-[#a0a0ab] tabular-nums">{lost}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.h1
            variants={rise}
            className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-[40px] sm:leading-[1.15]"
          >
            <span className="sr-only">Error 404: </span>
            Lost in the loop
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-3 max-w-md text-[15px] leading-relaxed text-[#a0a0ab] sm:text-base"
          >
            We couldn&apos;t find the page you were after. It may have moved, or
            the link might be out of date.
          </motion.p>

          {/* Search */}
          <motion.form
            variants={rise}
            role="search"
            className="mt-8 w-full max-w-lg"
            onSubmit={(e) => {
              e.preventDefault()
              const q = query.trim()
              router.push(q ? `/jobs?q=${encodeURIComponent(q)}` : "/jobs")
            }}
          >
            <label htmlFor="nf2-search" className="sr-only">
              Search jobs
            </label>

            <div className="group relative flex items-center rounded-2xl border border-white/10 bg-white/4 p-1.5 pl-4 backdrop-blur-md transition-all duration-300 focus-within:border-[#5c53fe]/60 focus-within:bg-white/6 focus-within:shadow-[0_0_0_4px_rgba(92,83,254,0.15),0_12px_40px_-10px_rgba(92,83,254,0.55)]">
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
                ref={inputRef}
                id="nf2-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search jobs, skills or companies"
                autoComplete="off"
                className="h-11 min-w-0 flex-1 bg-transparent px-3 text-[15px] text-white placeholder:text-[#6b6b75] focus:outline-none"
              />

              <AnimatePresence>
                {!focused && !query && (
                  <motion.kbd
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="mr-2 hidden rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-[#a0a0ab] sm:block"
                  >
                    /
                  </motion.kbd>
                )}
              </AnimatePresence>

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

          {/* Popular */}
          <motion.div
            variants={rise}
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-sm text-[#6b6b75]">Popular:</span>
            {POPULAR.map((p) => (
              <motion.div
                key={p.href}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
              >
                <Link
                  href={p.href}
                  className="block rounded-full border border-white/10 bg-white/3 px-3.5 py-1.5 text-sm text-[#c4c4cc] transition-colors outline-none hover:border-[#5c53fe]/50 hover:bg-[#5c53fe]/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
                >
                  {p.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div
            variants={rise}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
            >
              <Link
                href="/"
                className="group relative isolate grid h-11 place-items-center overflow-hidden rounded-xl bg-white px-6 text-[15px] font-medium text-[#0c0c0f] outline-none focus-visible:ring-2 focus-visible:ring-[#c9c5ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0f]"
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
              <button
                type="button"
                onClick={() => router.back()}
                className="grid h-11 place-items-center rounded-xl border border-white/10 bg-white/3 px-6 text-[15px] font-medium text-white transition-colors outline-none hover:border-white/20 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#8f88ff]"
              >
                Go back
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </MotionConfig>
  )
}

// Particle field
type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  phase: number
  r: number
  g: number
  b: number
}

// Brand gradient: blue -> purple -> orange (the colors in the Hireloop logo)
const STOPS: [number, number, number][] = [
  [14, 165, 233],
  [92, 83, 254],
  [249, 115, 22],
]

function gradientAt(t: number): [number, number, number] {
  const k = Math.min(Math.max(t, 0), 1) * (STOPS.length - 1)
  const i = Math.min(Math.floor(k), STOPS.length - 2)
  const f = k - i
  const a = STOPS[i]
  const b = STOPS[i + 1]

  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ]
}

function ParticleField({ onInteract }: { onInteract: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999, active: false })
  const burst = useRef<{ x: number; y: number } | null>(null)
  const interacted = useRef(false)

  const markInteracted = () => {
    if (interacted.current) return
    interacted.current = true
    onInteract()
  }

  useEffect(() => {
    const wrap = wrapRef.current

    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let particles: Particle[] = []
    let w = 0
    let h = 0
    let baseR = 1.5
    let raf = 0
    let disposed = false

    const build = () => {
      const rect = wrap.getBoundingClientRect()
      w = Math.max(1, Math.floor(rect.width))
      h = Math.max(1, Math.floor(rect.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Rasterise "404" off-screen, then turn the lit pixels into particles
      const off = document.createElement("canvas")
      off.width = w
      off.height = h

      const o = off.getContext("2d", { willReadFrequently: true })
      if (!o) return
      const family =
        getComputedStyle(wrap).fontFamily || "system-ui, sans-serif"
      const fontSize = Math.min(h * 0.95, w * 0.4)
      o.font = `800 ${fontSize}px ${family}`
      o.textAlign = "center"
      o.textBaseline = "middle"
      o.fillStyle = "#fff"
      o.fillText("404", w / 2, h / 2 + fontSize * 0.04)

      const step = Math.max(4, Math.round(fontSize / 34))
      baseR = step * 0.36

      const data = o.getImageData(0, 0, w, h).data

      const next: Particle[] = []
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (data[(y * w + x) * 4 + 3] > 128) {
            const [r, g, b] = gradientAt(x / w)
            next.push({
              x: reduce ? x : w / 2 + (Math.random() - 0.5) * w * 1.4,
              y: reduce ? y : h / 2 + (Math.random() - 0.5) * h * 2.2,
              vx: 0,
              vy: 0,
              tx: x,
              ty: y,
              phase: Math.random() * Math.PI * 2,
              r,
              g,
              b,
            })
          }
        }
      }
      particles = next
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = "lighter"

      const m = mouse.current
      const R = Math.max(90, Math.min(140, w * 0.14))
      const shock = burst.current
      burst.current = null

      if (m.active) {
        const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, R * 1.2)
        glow.addColorStop(0, "rgba(143,136,255,0.22)")
        glow.addColorStop(1, "rgba(143,136,255,0)")
        ctx.fillStyle = glow
        ctx.fillRect(m.x - R * 1.2, m.y - R * 1.2, R * 2.4, R * 2.4)
      }

      for (const p of particles) {
        if (!reduce) {
          const bx = p.tx + Math.sin(t * 0.0012 + p.phase) * 0.9
          const by = p.ty + Math.cos(t * 0.001 + p.phase) * 0.9
          p.vx += (bx - p.x) * 0.045
          p.vy += (by - p.y) * 0.045

          if (m.active) {
            const dx = p.x - m.x
            const dy = p.y - m.y
            const d2 = dx * dx + dy * dy
            if (d2 < R * R && d2 > 0.01) {
              const d = Math.sqrt(d2)
              const f = (1 - d / R) ** 2 * 6.5
              p.vx += (dx / d) * f
              p.vy += (dy / d) * f
            }
          }

          if (shock) {
            const dx = p.x - shock.x
            const dy = p.y - shock.y
            const d = Math.hypot(dx, dy) || 1
            if (d < 320) {
              const f = (1 - d / 320) * 24
              p.vx += (dx / d) * f + (Math.random() - 0.5) * 4
              p.vy += (dy / d) * f + (Math.random() - 0.5) * 4
            }
          }

          p.vx *= 0.86
          p.vy *= 0.86
          p.x += p.vx
          p.y += p.vy
        }

        const speed = Math.hypot(p.vx, p.vy)
        const heat = Math.min(speed * 0.12, 0.75)
        const rr = baseR * (1 + Math.min(speed * 0.1, 1.1))
        ctx.fillStyle = `rgba(${(p.r + (255 - p.r) * heat) | 0},${(p.g + (255 - p.g) * heat) | 0},${(p.b + (255 - p.b) * heat) | 0},${Math.min(0.6 + speed * 0.08, 1)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, rr, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = (t: number) => {
      if (disposed) return
      draw(t)
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      if (disposed) return
      build()
      cancelAnimationFrame(raf)
      if (reduce) draw(0)
      else raf = requestAnimationFrame(loop)
    }

    // Wait for the web font so the sampled "404" uses the real typeface
    document.fonts.ready.then(start)

    let resizeRaf = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(start)
    })
    ro.observe(wrap)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      cancelAnimationFrame(resizeRaf)
      ro.disconnect()
    }
  }, [])

  const pointerPos = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  return (
    <div
      ref={wrapRef}
      className="relative h-[clamp(190px,34vw,330px)] w-full cursor-crosshair touch-pan-y select-none"
      onPointerMove={(e) => {
        const p = pointerPos(e)
        mouse.current = { ...p, active: true }
        markInteracted()
      }}
      onPointerLeave={() => {
        mouse.current = { x: -9999, y: -9999, active: false }
      }}
      onPointerDown={(e) => {
        const p = pointerPos(e)
        mouse.current = { ...p, active: true }
        burst.current = p
        markInteracted()
      }}
      onPointerUp={(e) => {
        // On touch screens, release the "cursor" when the finger lifts
        if (e.pointerType !== "mouse")
          mouse.current = { x: -9999, y: -9999, active: false }
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 size-full"
      />
      <span className="sr-only">404</span>
    </div>
  )
}
