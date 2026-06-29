'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { ChevronRight, ChevronLeft, Loader2, CheckCircle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AppHeader } from '@/components/app/header'
import { useExecutionStore } from '@/lib/store/execution-store'
import { MOCK_EXECUTIONS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const WORKFLOWS = [
  { id: 'content-generator', name: 'Content Generator', desc: 'Generate blog posts, social copy, and marketing content.', model: 'GPT-4o' },
  { id: 'data-analyzer', name: 'Data Analyzer', desc: 'Analyze datasets and extract structured insights.', model: 'Claude 3.5 Sonnet' },
  { id: 'email-drafter', name: 'Email Drafter', desc: 'Write professional emails and follow-ups.', model: 'GPT-4o-mini' },
  { id: 'report-builder', name: 'Report Builder', desc: 'Build comprehensive reports from raw inputs.', model: 'Gemini 1.5 Pro' },
  { id: 'seo-optimizer', name: 'SEO Optimizer', desc: 'Optimize content for search engine ranking.', model: 'GPT-4o' },
]

const TONES = ['Professional', 'Casual', 'Technical', 'Creative', 'Persuasive']
const LENGTHS = [
  { value: 'short', label: 'Short', desc: '~200 words' },
  { value: 'medium', label: 'Medium', desc: '~600 words' },
  { value: 'long', label: 'Long', desc: '~1200 words' },
]

const step2Schema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters'),
  context: z.string().min(10, 'Please provide at least 10 characters of context'),
  tone: z.string().min(1, 'Select a tone'),
  length: z.string().min(1, 'Select a length'),
  additionalInstructions: z.string().optional(),
})
type Step2Data = z.infer<typeof step2Schema>

const STEPS = ['Choose Workflow', 'Configure Input', 'Review & Submit']

export default function FormPage() {
  const router = useRouter()
  const { setCurrentExecution, addExecution } = useExecutionStore()
  const [step, setStep] = useState(0)
  const [selectedWorkflow, setSelectedWorkflow] = useState<typeof WORKFLOWS[0] | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { tone: 'Professional', length: 'medium' },
  })

  const formData = watch()

  const handleWorkflowSelect = (wf: typeof WORKFLOWS[0]) => {
    setSelectedWorkflow(wf)
    setStep(1)
  }

  const onSubmit = async (data: Step2Data) => {
    setStep(2)
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 2500))

    const execution = {
      ...MOCK_EXECUTIONS[0],
      id: `exec_${Date.now()}`,
      workflowName: selectedWorkflow?.name ?? 'Custom Workflow',
      modelName: selectedWorkflow?.model ?? 'GPT-4o',
      input: { ...data },
      status: 'success' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tokensUsed: Math.floor(Math.random() * 2000) + 800,
      executionTime: Math.floor(Math.random() * 4000) + 1500,
    }
    setCurrentExecution(execution)
    addExecution(execution)
    setSubmitting(false)
    router.push(`/results?id=${execution.id}`)
  }

  return (
    <div>
      <AppHeader title="New Automation" description="Submit your data to trigger an AI workflow." />

      <div className="p-6 max-w-3xl mx-auto">
        {/* Step progress */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0',
                i < step ? 'bg-brand text-white' : i === step ? 'bg-brand/20 text-brand border border-brand' : 'bg-muted text-muted-foreground'
              )}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn('text-sm', i <= step ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
              {i < STEPS.length - 1 && (
                <div className={cn('flex-1 h-px', i < step ? 'bg-brand' : 'bg-border')} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Choose Workflow */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Choose a workflow</h2>
            <p className="text-sm text-muted-foreground mb-6">Select the AI automation you want to run.</p>
            <div className="grid gap-3">
              {WORKFLOWS.map((wf) => (
                <button
                  key={wf.id}
                  onClick={() => handleWorkflowSelect(wf)}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-border/60 bg-card hover:border-brand/40 hover:bg-brand/5 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                    <Zap className="w-5 h-5 text-brand" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{wf.name}</p>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">{wf.model}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{wf.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand transition-colors mt-1 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Configure */}
        {step === 1 && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-brand/5 border border-brand/20">
              <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-brand" />
              </div>
              <div>
                <p className="font-medium text-sm">{selectedWorkflow?.name}</p>
                <p className="text-xs text-muted-foreground">Model: {selectedWorkflow?.model}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="topic">Topic / Subject *</Label>
                <Input id="topic" placeholder="e.g. Benefits of AI in healthcare" {...register('topic')} />
                {errors.topic && <p className="text-xs text-destructive">{errors.topic.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="context">Context & Background *</Label>
                <Textarea id="context" rows={4} placeholder="Provide relevant context, key points, target audience, or any details the AI should know…" {...register('context')} />
                {errors.context && <p className="text-xs text-destructive">{errors.context.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Tone</Label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setValue('tone', t)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm border transition-all',
                        formData.tone === t
                          ? 'border-brand bg-brand/10 text-brand'
                          : 'border-border text-muted-foreground hover:border-border/80'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Output Length</Label>
                <div className="grid grid-cols-3 gap-3">
                  {LENGTHS.map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => setValue('length', l.value)}
                      className={cn(
                        'p-3 rounded-xl border text-left transition-all',
                        formData.length === l.value
                          ? 'border-brand bg-brand/10'
                          : 'border-border hover:border-border/80'
                      )}
                    >
                      <p className={cn('font-medium text-sm', formData.length === l.value ? 'text-brand' : '')}>{l.label}</p>
                      <p className="text-xs text-muted-foreground">{l.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="additionalInstructions">Additional Instructions <span className="text-muted-foreground">(optional)</span></Label>
                <Textarea id="additionalInstructions" rows={2} placeholder="Any specific requirements, formatting preferences, or constraints…" {...register('additionalInstructions')} />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button type="button" variant="outline" onClick={() => setStep(0)} className="gap-1.5">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              <Button type="submit" className="flex-1 bg-brand text-white hover:bg-brand/90 border-0 gap-1.5">
                Review & Submit <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Submitting */}
        {step === 2 && (
          <div className="text-center py-12">
            {submitting ? (
              <>
                <div className="w-20 h-20 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-brand animate-spin" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Running your automation…</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Triggering <span className="text-foreground font-medium">{selectedWorkflow?.name}</span> via n8n webhook.<br />
                  The AI is processing your request.
                </p>
                <div className="max-w-xs mx-auto space-y-2">
                  {['Sending to n8n webhook', 'AI model processing', 'Generating output'].map((step, i) => (
                    <div key={step} className="flex items-center gap-3 text-sm text-left">
                      <div className="w-5 h-5 rounded-full border-2 border-brand border-t-transparent animate-spin shrink-0" style={{ animationDelay: `${i * 0.3}s` }} />
                      <span className="text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Automation complete!</h2>
                <p className="text-sm text-muted-foreground">Redirecting to your results…</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
