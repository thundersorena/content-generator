'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    if (otp.some((d) => !d)) { setError('Enter all 6 digits'); return }
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="glass rounded-2xl border border-border/60 p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-6">
        <ShieldCheck className="w-8 h-8 text-brand" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Enter the 6-digit code we sent to your email.<br />
        <span className="text-xs">(Use any code for demo)</span>
      </p>

      <div className="flex justify-center gap-2 mb-6">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-xl font-bold bg-muted border border-border rounded-xl focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        ))}
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <Button onClick={handleVerify} className="w-full bg-brand text-white hover:bg-brand/90 border-0 mb-4" disabled={loading}>
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying…</> : 'Verify email'}
      </Button>

      <p className="text-sm text-muted-foreground">
        Didn&apos;t receive the code?{' '}
        <button className="text-brand hover:underline">Resend</button>
      </p>
    </div>
  )
}
