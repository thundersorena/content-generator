'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({ email: z.string().email('Enter a valid email') })
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 1000))
    setSent(true)
  }

  if (sent) {
    return (
      <div className="glass rounded-2xl border border-border/60 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-brand" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Check your inbox</h1>
        <p className="text-sm text-muted-foreground mb-6">
          We sent a password reset link to <br />
          <span className="text-foreground font-medium">{getValues('email')}</span>
        </p>
        <Link href="/login">
          <Button variant="outline" className="w-full">Back to sign in</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl border border-border/60 p-8">
      <Link href="/login" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to sign in
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Reset your password</h1>
        <p className="text-sm text-muted-foreground">We&apos;ll send a reset link to your email.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="you@company.com" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="w-full bg-brand text-white hover:bg-brand/90 border-0" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending…</> : 'Send reset link'}
        </Button>
      </form>
    </div>
  )
}
