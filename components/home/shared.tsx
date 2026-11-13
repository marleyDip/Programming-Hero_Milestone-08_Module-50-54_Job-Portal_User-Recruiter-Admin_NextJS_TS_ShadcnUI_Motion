"use client"

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion"

import { Inter, Manrope, Plus_Jakarta_Sans, Space_Mono } from "next/font/google"
import { useRef } from "react"

// Fonts (from the Figma file)
export const manrope = Manrope({ subsets: ["latin"], display: "swap" })

export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
})

export const inter = Inter({ subsets: ["latin"], display: "swap" })

export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
})

// Motion
export const EASE = [0.22, 1, 0.36, 1] as const

export const SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const

export const VIEWPORT = { once: true, margin: "-80px" } as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },

  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
}

/** Cursor-following light inside a single element. */
export function useSpotlight(color = "rgba(143,136,255,0.16)", size = 260) {
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

/** Element drifts slightly toward the cursor. */
export function Magnetic({
  children,
  strength = 0.25,
}: {
  children: React.ReactNode
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.5 })
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.5 })

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

// Section header: ■ Label ■  +  word-by-word title (matches the Figma)
export function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: string
}) {
  const words = title.split(" ")

  const square = {
    hidden: { scale: 0, rotate: -90, opacity: 0 },
    show: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: EASE },
    },
  }

  return (
    <div className="mx-auto flex max-w-170 flex-col items-center text-center">
      <motion.div
        className="flex items-center gap-4"
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      >
        <motion.span
          variants={square}
          className="size-2 rounded-xs bg-[#5c53fe] shadow-[0_0_14px_rgba(92,83,254,0.95)]"
        />

        <motion.span
          variants={fadeUp}
          className={`${spaceMono.className} text-lg text-white sm:text-xl`}
        >
          {eyebrow}
        </motion.span>

        <motion.span
          variants={square}
          className="size-2 rounded-xs bg-[#5c53fe] shadow-[0_0_14px_rgba(92,83,254,0.95)]"
        />
      </motion.div>

      <h2
        className={`${manrope.className} mt-5 flex flex-wrap justify-center gap-x-[0.27em] text-[clamp(32px,5vw,48px)] leading-[1.15] font-semibold tracking-tight text-white`}
      >
        {words.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="mb-[-0.12em] inline-block overflow-hidden pb-[0.12em]"
          >
            <motion.span
              className="inline-block"
              initial={{ y: "110%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={VIEWPORT}
              transition={{
                duration: 0.75,
                ease: EASE,
                delay: 0.15 + i * 0.06,
              }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </h2>
    </div>
  )
}

// Icons
type IconProps = { className?: string }

export function ArrowIcon({ className }: IconProps) {
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

export function PinIcon({ className }: IconProps) {
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

export function BriefcaseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <rect
        x="2.5"
        y="6"
        width="15"
        height="10.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M7 6V4.5A1.5 1.5 0 0 1 8.5 3h3A1.5 1.5 0 0 1 13 4.5V6M2.5 11h15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function DollarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12.2 7.6c-.3-.8-1.1-1.3-2.2-1.3-1.3 0-2.2.7-2.2 1.7 0 2.3 4.4 1.2 4.4 3.5 0 1-.9 1.8-2.2 1.8-1.2 0-2-.6-2.3-1.4M10 5v1.3m0 7.4V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z"
        fill="currentColor"
      />
    </svg>
  )
}
