"use client"

import { motion, type Variants } from "framer-motion"

import { EASE, SectionHeader, inter } from "./shared"

// Animated line icons: they draw in on scroll and redraw on hover
const pathV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },

  show: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.9, ease: EASE },
  },

  hover: {
    pathLength: [0, 1],
    opacity: 1,
    transition: { duration: 0.8, ease: EASE },
  },
}

function Icon({ paths }: { paths: string[] }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-8" aria-hidden>
      {paths.map((d) => (
        <motion.path
          key={d}
          d={d}
          variants={pathV}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}

const FEATURES = [
  {
    title: "Smart Search",
    desc: "Find your ideal job with advanced filters.",
    paths: ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z", "m20 20-4.2-4.2"],
  },
  {
    title: "Salary Insights",
    desc: "Get real salary data to negotiate confidently.",
    paths: ["M3 20h18", "M6 20v-6", "M12 20V5", "M18 20v-9"],
  },
  {
    title: "Top Companies",
    desc: "Apply to vetted companies that are hiring.",
    paths: ["M3 20h18", "M4 20v-6h5v6", "M9.5 20V8h5v12", "M15 20v-9h5v9"],
  },
  {
    title: "Saved Jobs",
    desc: "Manage apps & favorites on your dashboard.",
    paths: ["M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z"],
  },
  {
    title: "One-Click Apply",
    desc: "Simplify your job applications for an easier process!",
    paths: [
      "M9 3.5 19 9l-4.5 1.5L17 15l-2 1-2.5-4.5L9 14V3.5Z",
      "M5.5 7 4 5.5",
      "M4 11.5H2",
      "M9 1.5V3",
    ],
  },
  {
    title: "Resume Builder",
    desc: "Create professional resumes with modern templates.",
    paths: ["M6 3h8l4 4v14H6V3Z", "M14 3v4h4", "M9 12h6", "M9 16h6"],
  },
  {
    title: "Skill-Based Matching",
    desc: "Discover jobs that match your skills and experience.",
    paths: [
      "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
      "M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z",
      "M12 12h.01",
    ],
  },
  {
    title: "Career Growth Resources",
    desc: "Boost your career with quick interview tips.",
    paths: ["m3 17 6-6 4 4 8-8", "M15 7h6v6"],
  },
]

// Section
export function Features() {
  // One pointer drives a spotlight across every card at once
  const onMove = (e: React.MouseEvent<HTMLUListElement>) => {
    const cards = e.currentTarget.querySelectorAll<HTMLElement>("[data-spot]")

    cards.forEach((el) => {
      const r = el.getBoundingClientRect()

      el.style.setProperty("--x", `${e.clientX - r.left}px`)
      el.style.setProperty("--y", `${e.clientY - r.top}px`)
    })
  }

  return (
    <section
      id="features"
      className={`${inter.className} relative isolate scroll-mt-24 overflow-hidden bg-[#151516] px-5 py-24 text-white sm:px-8 lg:py-32`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-px w-[70%] -translate-x-1/2 bg-linear-to-r from-transparent via-white/20 to-transparent" />

        <div className="absolute -top-50 left-1/2 h-105 w-215 -translate-x-1/2 rounded-full bg-[#5c53fe]/[0.14] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 55%, black, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 55%, black, transparent 80%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-330">
        <SectionHeader
          eyebrow="Features"
          title="Everything you need to succeed"
        />

        <ul
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          onMouseMove={onMove}
        >
          {FEATURES.map((f, i) => (
            <motion.li
              key={f.title}
              data-spot
              className="group relative overflow-hidden rounded-2xl"
              initial="hidden"
              whileInView="show"
              whileHover="hover"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: { opacity: 0, y: 32 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.7,
                    ease: EASE,
                    delay: (i % 4) * 0.08 + Math.floor(i / 4) * 0.12,
                  },
                },
                hover: {},
              }}
            >
              {/* gradient hairline border that lights up near the cursor */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl p-px"
                style={{
                  background:
                    "radial-gradient(220px circle at var(--x, -999px) var(--y, -999px), rgba(143,136,255,0.9), transparent 65%), rgba(255,255,255,0.08)",
                  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMask:
                    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  maskComposite: "exclude",
                  WebkitMaskComposite: "xor",
                }}
              />

              {/* soft glow */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(260px circle at var(--x, -999px) var(--y, -999px), rgba(92,83,254,0.16), transparent 70%)",
                }}
              />

              <div className="relative flex items-start gap-5 bg-white/2 p-5 sm:p-6">
                <motion.span
                  className="relative grid size-16 shrink-0 place-items-center rounded-lg border border-white/10 text-[#c9c5ff] transition-all duration-300 group-hover:border-[#5c53fe]/60 group-hover:text-white group-hover:shadow-[0_0_30px_-4px_rgba(92,83,254,0.7)]"
                  style={{
                    background: "linear-gradient(135deg, #010102, #313131)",
                  }}
                  variants={{
                    hover: {
                      y: -4,
                      rotate: -3,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      },
                    },
                  }}
                >
                  <Icon paths={f.paths} />
                </motion.span>

                <div className="min-w-0">
                  <h3 className="text-lg font-medium text-white transition-transform duration-300 group-hover:translate-x-1">
                    {f.title}
                  </h3>

                  <p className="mt-2 text-base leading-relaxed text-white/55 transition-colors duration-300 group-hover:text-white/80">
                    {f.desc}
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
