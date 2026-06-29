'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/lib/store/auth-store'
import { MOCK_USER, MOCK_ADMIN } from '@/lib/mock-data'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setError('')
    await new Promise((r) => setTimeout(r, 1000))
    // Mock auth — admin@flowai.dev → admin, any other → user
    if (data.email === 'admin@flowai.dev') {
      setUser(MOCK_ADMIN)
      setToken('mock-admin-token')
      router.push('/admin')
    } else if (data.email.includes('@')) {
      setUser({ ...MOCK_USER, email: data.email })
      setToken('mock-user-token')
      router.push('/dashboard')
    } else {
      setError('Invalid credentials. Try any email and 6+ char password.')
    }
  }

  return (
    <div className="glass rounded-2xl border border-border/60 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your FlowAI account</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-brand hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-brand text-white hover:bg-brand/90 border-0"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in…</>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border/40">
        <p className="text-xs text-muted-foreground text-center mb-1">Demo credentials</p>
        <p className="text-xs text-center"><span className="text-foreground font-mono">admin@flowai.dev</span> → Admin dashboard</p>
        <p className="text-xs text-center"><span className="text-foreground font-mono">any@email.com</span> → User dashboard</p>
      </div>

      <p className="mt-6 text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-brand hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}
