"use client"

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type Variants,
} from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

import {
  ArrowRight,
  Check,
  Crown,
  Sparkles,
  Sprout,
  Zap,
  type LucideIcon,
} from "lucide-react"

import {
  EASE,
  SPRING,
  SectionHeader,
  VIEWPORT,
  inter,
  jakarta,
  useSpotlight,
} from "./shared"

// Content
const YEARLY_DISCOUNT = 0.25

type Plan = {
  id: string
  name: string
  price: number // per month, billed monthly
  popular?: boolean
  tagline: string
  features: string[]
  icon: LucideIcon
  tone: string // icon tile styling
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    tagline: "Free plan",
    features: ["Daily AI match brief (top 5)", "Verified salary bands"],
    icon: Sprout,
    tone: "border border-white/10 bg-[linear-gradient(135deg,#010102,#313131)] text-white/85",
  },
  {
    id: "growth",
    name: "Growth",
    price: 17,
    popular: true,
    tagline: "Everything you need to move faster",
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
    icon: Zap,
    tone: "bg-[linear-gradient(135deg,#7a72ff,#5c53fe)] text-white shadow-[0_8px_28px_-6px_rgba(92,83,254,0.9),inset_0_1px_0_rgba(255,255,255,0.35)]",
  },
  {
    id: "premium",
    name: "Premium",
    price: 99,
    tagline: "For teams and power users",
    features: [
      "Everything in Growth",
      "Multi-profile career portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
    ],
    icon: Crown,
    tone: "bg-[linear-gradient(135deg,#fdba74,#f97316)] text-[#2a1200] shadow-[0_8px_28px_-6px_rgba(249,115,22,0.8),inset_0_1px_0_rgba(255,255,255,0.45)]",
  },
]

const listV: Variants = {
  hidden: {},

  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.35 },
  },
}

const rowV: Variants = {
  hidden: { opacity: 0, x: -10 },

  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: EASE },
  },
}

const checkV: Variants = {
  hidden: { scale: 0, rotate: -45, opacity: 0 },

  show: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 420, damping: 18, delay: 0.1 },
  },
}

// Section
export function Pricing() {
  const [yearly, setYearly] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section
      id="pricing"
      className={`${inter.className} relative isolate scroll-mt-24 overflow-hidden bg-[#010103] px-5 py-24 text-white sm:px-8 lg:py-32`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-px w-[70%] -translate-x-1/2 bg-linear-to-r from-transparent via-[#8f88ff]/40 to-transparent" />

        <div className="absolute top-[38%] left-1/2 h-140 w-225 -translate-x-1/2 rounded-full bg-[#5c53fe]/22 blur-[160px]" />

        <div className="absolute bottom-0 -left-32 h-90 w-90 rounded-full bg-[#0ea5e9]/8 blur-[130px]" />

        <div className="absolute -right-32 bottom-10 h-90 w-90 rounded-full bg-[#f97316]/[0.07] blur-[130px]" />
      </div>

      <div className="mx-auto max-w-330">
        <SectionHeader
          eyebrow="Pricing"
          title="Pay for the leverage, not the listings"
        />

        {/* Billing toggle */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        >
          <div
            role="radiogroup"
            aria-label="Billing period"
            className="flex items-center gap-1 rounded-full border border-white/10 bg-white/15 p-2 backdrop-blur-md"
          >
            {[
              { value: false, label: "Monthly" },
              { value: true, label: "Yearly" },
            ].map((opt) => {
              const on = yearly === opt.value
              return (
                <button
                  key={opt.label}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setYearly(opt.value)}
                  className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-medium transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#c9c5ff] ${
                    on ? "text-[#010103]" : "text-white"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="billing-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-[0_6px_24px_-6px_rgba(255,255,255,0.5)]"
                      transition={SPRING}
                    />
                  )}

                  <span className="relative">{opt.label}</span>
                  {opt.value && (
                    <span className="relative rounded-full bg-[#5c53fe] px-2 py-0.5 text-xs font-semibold text-white">
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-[#5c53fe]"
                        animate={
                          yearly
                            ? { opacity: 0 }
                            : { scale: [1, 1.5], opacity: [0.55, 0] }
                        }
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />

                      <span className="relative">
                        -{YEARLY_DISCOUNT * 100}%
                      </span>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Plans */}
        <ul className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={i}
              yearly={yearly}
              dimmed={hovered !== null && hovered !== plan.id}
              onHover={setHovered}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

// Plan card
function AnimatedPrice({ value }: { value: number }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => `$${Math.round(v)}`)

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.7, ease: EASE })

    return () => controls.stop()
  }, [mv, value])
  return <motion.span>{text}</motion.span>
}

function PlanCard({
  plan,
  index,
  yearly,
  dimmed,
  onHover,
}: {
  plan: Plan
  index: number
  yearly: boolean
  dimmed: boolean
  onHover: (id: string | null) => void
}) {
  const spot = useSpotlight(
    plan.popular ? "rgba(143,136,255,0.16)" : "rgba(143,136,255,0.10)",
    340
  )

  const monthly = plan.price
  const shown = yearly ? Math.round(monthly * (1 - YEARLY_DISCOUNT)) : monthly
  const yearlyTotal = monthly * 12 * (1 - YEARLY_DISCOUNT)
  const yearlySaved = monthly * 12 - yearlyTotal

  return (
    <motion.li
      className={plan.popular ? "lg:-my-4" : ""}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.12 }}
      onMouseEnter={() => onHover(plan.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className={`relative h-full overflow-hidden rounded-3xl p-px transition-all duration-500 ${
          dimmed ? "scale-[0.985] opacity-60" : ""
        } ${
          plan.popular
            ? "shadow-[0_30px_100px_-30px_rgba(92,83,254,0.8)]"
            : "bg-[#f6efe1]/20 hover:bg-[#8f88ff]/40"
        }`}
      >
        {/* featured plan: a sliver of light circles the edge */}
        {plan.popular && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-white/20"
          >
            <motion.span
              className="absolute top-1/2 left-1/2 aspect-square w-[180%]"
              style={{
                x: "-50%",
                y: "-50%",
                background:
                  "conic-gradient(from 0deg, transparent 0 62%, rgba(143,136,255,1) 80%, rgba(56,189,248,1) 90%, transparent 100%)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            />
          </span>
        )}

        <motion.div
          onMouseMove={spot.onMouseMove}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className={`group/plan relative flex h-full flex-col rounded-[23px] p-6 sm:p-7 ${
            plan.popular
              ? "bg-[#151516] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_0_80px_rgba(92,83,254,0.14)]"
              : "bg-[#010103]"
          }`}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: spot.background }}
          />

          {/* header: name + price */}
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-xl transition-transform duration-500 group-hover/plan:scale-110 group-hover/plan:-rotate-6 ${plan.tone}`}
              >
                <plan.icon className="size-6" strokeWidth={1.8} aria-hidden />
              </span>

              <div>
                <h3 className={`${jakarta.className} text-2xl leading-none`}>
                  {plan.name}
                </h3>

                {plan.popular && (
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#5c53fe]/25 px-2.5 py-1 text-xs font-medium text-[#d6d3ff]">
                    <Sparkles className="size-3" aria-hidden />
                    Most popular
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <p
                className={`${jakarta.className} text-[44px] leading-none font-semibold tracking-tight`}
              >
                <AnimatedPrice value={shown} />
                <span className="ml-1 text-sm font-normal text-white/60">
                  /month
                </span>
              </p>

              <div className="relative mt-2 h-5 text-xs text-white/50">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={`${plan.id}-${yearly}`}
                    className="absolute top-0 right-0 whitespace-nowrap"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {monthly === 0
                      ? plan.tagline
                      : yearly
                        ? `Billed $${yearlyTotal} yearly · save $${yearlySaved}`
                        : "Billed monthly"}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* features */}
          <div className="relative mt-9">
            <p className="text-lg font-medium">
              Start building your insights hub:
            </p>

            <motion.ul variants={listV} className="mt-5 space-y-3.5">
              {plan.features.map((f) => (
                <motion.li
                  key={f}
                  variants={rowV}
                  className="flex items-start gap-3 text-base text-white/85"
                >
                  <motion.span
                    variants={checkV}
                    className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#7a72ff,#5c53fe)] text-white shadow-[0_0_14px_-2px_rgba(92,83,254,0.9)]"
                  >
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </motion.span>
                  {f}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* CTA */}
          <div className="relative mt-auto pt-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
            >
              <Link
                href={`/sign-up?plan=${plan.id}&billing=${yearly ? "yearly" : "monthly"}`}
                className={`group/btn relative isolate flex h-13.75 items-center justify-between overflow-hidden rounded-xl px-6 text-base font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#c9c5ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#010103] ${
                  plan.popular
                    ? "bg-white text-[#010103] shadow-[0_12px_40px_-10px_rgba(255,255,255,0.45)]"
                    : "bg-[#595959]/50 text-white hover:bg-[#5c53fe] hover:shadow-[0_12px_36px_-10px_rgba(92,83,254,0.9)]"
                }`}
              >
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2 -skew-x-12 bg-linear-to-r from-transparent to-transparent opacity-0 transition-all duration-700 ease-out group-hover/btn:left-[130%] group-hover/btn:opacity-100 ${
                    plan.popular ? "via-[#5c53fe]/30" : "via-white/30"
                  }`}
                />
                Choose This Plan
                <ArrowRight
                  className="size-5 transition-transform duration-300 group-hover/btn:translate-x-1"
                  aria-hidden
                />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.li>
  )
}
