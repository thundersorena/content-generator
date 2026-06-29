'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun, Zap, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background',
        scrolled
          ? 'border-b border-border/60 py-3'
          : 'py-5'
      )}
    >
      <nav className="container mx-auto px-4 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center glow-brand transition-transform group-hover:scale-110">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-semibold text-lg text-foreground tracking-tight">FlowAI</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Sign in
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-brand text-white hover:bg-brand/90 border-0">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border/60 px-4 py-4">
          <ul className="flex flex-col gap-4 mb-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">Sign in</Button>
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full bg-brand text-white hover:bg-brand/90 border-0">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
