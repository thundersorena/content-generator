'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface AppHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function AppHeader({ title, description, action }: AppHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {action}
        <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand" />
        </button>
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}
      </div>
    </header>
  )
}
