'use client'

import { useEffect, useRef } from 'react'
import { FileText, Cpu, Sparkles } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: FileText,
    title: 'Submit your data',
    description:
      'Fill out a structured form with your automation inputs. Dynamic fields adapt to each workflow type.',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'n8n triggers the AI',
    description:
      'Your submission hits the n8n webhook. The workflow orchestrates data, calls your AI model, and processes the result.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Receive AI output',
    description:
      'View beautifully rendered results with markdown support. Copy, download, or rerun with one click.',
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const run = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const stepItems = sectionRef.current?.querySelectorAll('.step-item')
      if (stepItems && stepItems.length > 0) {
        gsap.fromTo(
          Array.from(stepItems),
          { x: -30, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.7, stagger: 0.2,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
          }
        )
      }
    }
    run()
  }, [])

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 bg-muted/20 border-y border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-3">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            From idea to output in 3 steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

          {STEPS.map((step) => (
            <div key={step.number} className="step-item text-center relative">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-brand" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand text-[10px] font-bold text-white flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
