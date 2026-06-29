'use client'

import { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: 12847, suffix: '+', label: 'Automations Run' },
  { value: 96.4, suffix: '%', label: 'Success Rate' },
  { value: 48.2, suffix: 'M', label: 'Tokens Processed' },
  { value: 1247, suffix: '+', label: 'Active Users' },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const duration = 2000
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current * 10) / 10)
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  const display =
    suffix === 'M'
      ? count.toFixed(1)
      : suffix === '%'
        ? count.toFixed(1)
        : Math.floor(count).toLocaleString()

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="glass rounded-3xl border border-border/60 p-10 md:p-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
