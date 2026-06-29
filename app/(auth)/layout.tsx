import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col items-center justify-center p-4 relative">
      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-brand/8 blur-[100px] pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center transition-transform group-hover:scale-110">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="font-semibold text-lg tracking-tight">FlowAI</span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} FlowAI. All rights reserved.
      </p>
    </div>
  )
}
