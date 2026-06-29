'use client'

import { useEffect, useRef } from 'react'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'Head of Marketing, TechCorp',
    quote:
      'FlowAI cut our content production time by 80%. We now generate SEO-optimized blog posts and social copy in seconds with our n8n workflows.',
    rating: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'CTO, DataStream Inc.',
    quote:
      'The multi-model support is a game changer. We route complex analysis to Claude and quick summaries to GPT-4o-mini — the cost savings are massive.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Operations Manager, Automate.io',
    quote:
      'The dashboard gives us full visibility into every automation execution. Token tracking and success rates help us optimize our workflows continuously.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Founder, GrowthLab',
    quote:
      'We built our entire customer onboarding automation on FlowAI. The execution history and one-click rerun features save us hours every week.',
    rating: 5,
  },
  {
    name: 'Emma Torres',
    role: 'Product Manager, Scale.ai',
    quote:
      'Setup took 10 minutes. We connected our existing n8n workflows via webhook and were automating immediately. Absolutely no friction.',
    rating: 5,
  },
  {
    name: 'James Liu',
    role: 'Lead Developer, BuildFast',
    quote:
      'The admin panel is exceptional. Full user management, token analytics, and the ability to configure AI models per workflow from one place.',
    rating: 5,
  },
]

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const run = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      const testimonialCards = sectionRef.current?.querySelectorAll('.testimonial-card')
      if (testimonialCards && testimonialCards.length > 0) {
        gsap.fromTo(
          Array.from(testimonialCards),
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.5, stagger: 0.08,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          }
        )
      }
    }
    run()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-muted/20 border-y border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-3">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Loved by automation teams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="testimonial-card bg-card border border-border/60 rounded-2xl p-6 hover:border-brand/30 transition-all duration-300"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-xs font-bold text-brand">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
