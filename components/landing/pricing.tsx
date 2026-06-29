'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    name: 'Starter',
    monthly: 0,
    annual: 0,
    description: 'Perfect for exploring AI automation.',
    features: [
      '100 executions / month',
      '500K tokens included',
      '2 active workflows',
      'Basic analytics',
      'Community support',
    ],
    cta: 'Start for free',
    popular: false,
  },
  {
    name: 'Pro',
    monthly: 29,
    annual: 23,
    description: 'For power users and growing teams.',
    features: [
      '5,000 executions / month',
      '10M tokens included',
      'Unlimited workflows',
      'Advanced analytics',
      'Priority support',
      'Custom model selection',
      'API access',
    ],
    cta: 'Start Pro trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    monthly: 99,
    annual: 79,
    description: 'For teams that automate at scale.',
    features: [
      'Unlimited executions',
      'Unlimited tokens',
      'Unlimited workflows',
      'Admin dashboard',
      'RBAC & SSO',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Contact sales',
    popular: false,
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const run = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      const pricingCards = sectionRef.current?.querySelectorAll('.pricing-card')
      if (pricingCards && pricingCards.length > 0) {
        gsap.fromTo(
          Array.from(pricingCards),
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.15,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          }
        )
      }
    }
    run()
  }, [])

  return (
    <section ref={sectionRef} id="pricing" className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Start free. Scale as you grow. No hidden fees.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-muted rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm transition-all',
                !annual ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm flex items-center gap-2 transition-all',
                annual ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
              )}
            >
              Annual
              <Badge className="text-[10px] bg-brand/20 text-brand border-0 px-1.5 py-0.5 h-auto">-20%</Badge>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'pricing-card rounded-2xl border p-8 flex flex-col transition-all duration-300',
                plan.popular
                  ? 'border-brand/50 bg-brand/5 relative shadow-lg shadow-brand/10'
                  : 'border-border/60 bg-card hover:border-border'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-brand text-white border-0 px-3 py-1 text-xs">Most Popular</Badge>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">
                    ${annual ? plan.annual : plan.monthly}
                  </span>
                  <span className="text-muted-foreground mb-1">/ month</span>
                </div>
                {annual && plan.monthly !== plan.annual && (
                  <p className="text-xs text-muted-foreground mt-1">Billed annually</p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-brand shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.name === 'Enterprise' ? '#contact' : '/register'}>
                <Button
                  className={cn(
                    'w-full',
                    plan.popular
                      ? 'bg-brand text-white hover:bg-brand/90 border-0'
                      : 'variant-outline'
                  )}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
