'use client'

import { useState } from 'react'
import { Save, Globe, Webhook, BrainCircuit, Bell, Lock, ChevronRight } from 'lucide-react'
import { AppHeader } from '@/components/app/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { id: 'general',       label: 'General',       icon: Globe },
  { id: 'webhooks',      label: 'Webhooks',       icon: Webhook },
  { id: 'ai',            label: 'AI / Models',    icon: BrainCircuit },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
  { id: 'security',      label: 'Security',       icon: Lock },
]

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('general')
  const [saved, setSaved] = useState(false)

  // Form state
  const [siteName, setSiteName] = useState('FlowAI')
  const [siteUrl, setSiteUrl] = useState('https://app.flowai.dev')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [registrationOpen, setRegistrationOpen] = useState(true)

  const [n8nUrl, setN8nUrl] = useState('https://n8n.yourserver.com')
  const [n8nApiKey, setN8nApiKey] = useState('n8n_api_••••••••••••')
  const [webhookSecret, setWebhookSecret] = useState('whsec_••••••••••••••••')

  const [defaultModel, setDefaultModel] = useState('gpt-4o')
  const [maxTokens, setMaxTokens] = useState('4096')
  const [rateLimitPerUser, setRateLimitPerUser] = useState('100')
  const [streamingEnabled, setStreamingEnabled] = useState(true)

  const [emailOnFailure, setEmailOnFailure] = useState(true)
  const [emailOnNewUser, setEmailOnNewUser] = useState(true)
  const [slackWebhook, setSlackWebhook] = useState('')

  const [requireEmailVerification, setRequireEmailVerification] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState('7')
  const [twoFactorRequired, setTwoFactorRequired] = useState(false)

  const handleSave = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <AppHeader title="Site Settings" description="Configure global platform settings." />

      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Section nav */}
          <nav className="lg:w-52 shrink-0">
            <div className="bg-card border border-border/60 rounded-2xl p-2 flex flex-row lg:flex-col gap-1">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-left',
                    activeSection === s.id
                      ? 'bg-brand/10 text-brand font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <s.icon className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:block">{s.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Settings panel */}
          <div className="flex-1 bg-card border border-border/60 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  {SECTIONS.find((s) => s.id === activeSection)?.label} Settings
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Changes take effect immediately after saving.
                </p>
              </div>
              <Button
                onClick={handleSave}
                size="sm"
                className={cn(
                  'gap-1.5 border-0',
                  saved
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/20'
                    : 'bg-brand text-white hover:bg-brand/90'
                )}
              >
                <Save className="w-3.5 h-3.5" />
                {saved ? 'Saved!' : 'Save changes'}
              </Button>
            </div>

            <div className="p-6 space-y-8">
              {/* General */}
              {activeSection === 'general' && (
                <>
                  <SettingGroup title="Platform Identity">
                    <SettingRow label="Site Name" description="Displayed in the browser tab and emails.">
                      <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="max-w-xs" />
                    </SettingRow>
                    <Separator className="opacity-50" />
                    <SettingRow label="Site URL" description="The canonical public URL of this application.">
                      <Input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} className="max-w-xs" />
                    </SettingRow>
                  </SettingGroup>

                  <SettingGroup title="Access Control">
                    <SettingRow label="User Registration" description="Allow new users to create accounts.">
                      <Switch checked={registrationOpen} onCheckedChange={setRegistrationOpen} />
                    </SettingRow>
                    <Separator className="opacity-50" />
                    <SettingRow label="Maintenance Mode" description="Take the platform offline for all non-admin users.">
                      <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                    </SettingRow>
                  </SettingGroup>
                </>
              )}

              {/* Webhooks */}
              {activeSection === 'webhooks' && (
                <SettingGroup title="n8n Integration">
                  <SettingRow label="n8n Base URL" description="The base URL of your self-hosted n8n instance.">
                    <Input value={n8nUrl} onChange={(e) => setN8nUrl(e.target.value)} className="max-w-sm font-mono text-sm" />
                  </SettingRow>
                  <Separator className="opacity-50" />
                  <SettingRow label="n8n API Key" description="Used to authenticate requests from this app to n8n.">
                    <Input value={n8nApiKey} onChange={(e) => setN8nApiKey(e.target.value)} type="password" className="max-w-sm font-mono text-sm" />
                  </SettingRow>
                  <Separator className="opacity-50" />
                  <SettingRow label="Webhook Secret" description="HMAC secret to verify incoming webhook payloads.">
                    <Input value={webhookSecret} onChange={(e) => setWebhookSecret(e.target.value)} type="password" className="max-w-sm font-mono text-sm" />
                  </SettingRow>
                </SettingGroup>
              )}

              {/* AI / Models */}
              {activeSection === 'ai' && (
                <>
                  <SettingGroup title="Model Defaults">
                    <SettingRow label="Default Model" description="The AI model used when no workflow-specific model is set.">
                      <select
                        value={defaultModel}
                        onChange={(e) => setDefaultModel(e.target.value)}
                        className="h-9 px-3 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:border-brand transition-colors"
                      >
                        {['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet', 'gemini-1.5-pro'].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </SettingRow>
                    <Separator className="opacity-50" />
                    <SettingRow label="Max Tokens per Request" description="Hard cap on tokens consumed per execution.">
                      <Input value={maxTokens} onChange={(e) => setMaxTokens(e.target.value)} type="number" className="max-w-[120px]" />
                    </SettingRow>
                    <Separator className="opacity-50" />
                    <SettingRow label="Rate Limit (per user/day)" description="Max executions allowed per user per 24 hours.">
                      <Input value={rateLimitPerUser} onChange={(e) => setRateLimitPerUser(e.target.value)} type="number" className="max-w-[120px]" />
                    </SettingRow>
                    <Separator className="opacity-50" />
                    <SettingRow label="Streaming Responses" description="Stream AI output tokens in real-time.">
                      <Switch checked={streamingEnabled} onCheckedChange={setStreamingEnabled} />
                    </SettingRow>
                  </SettingGroup>
                </>
              )}

              {/* Notifications */}
              {activeSection === 'notifications' && (
                <>
                  <SettingGroup title="Email Alerts">
                    <SettingRow label="Alert on Failed Execution" description="Send admin an email when any execution fails.">
                      <Switch checked={emailOnFailure} onCheckedChange={setEmailOnFailure} />
                    </SettingRow>
                    <Separator className="opacity-50" />
                    <SettingRow label="Alert on New User" description="Send admin an email when a new user registers.">
                      <Switch checked={emailOnNewUser} onCheckedChange={setEmailOnNewUser} />
                    </SettingRow>
                  </SettingGroup>

                  <SettingGroup title="Integrations">
                    <SettingRow label="Slack Webhook URL" description="Optionally post notifications to a Slack channel.">
                      <Input
                        value={slackWebhook}
                        onChange={(e) => setSlackWebhook(e.target.value)}
                        placeholder="https://hooks.slack.com/services/…"
                        className="max-w-sm font-mono text-sm"
                      />
                    </SettingRow>
                  </SettingGroup>
                </>
              )}

              {/* Security */}
              {activeSection === 'security' && (
                <SettingGroup title="Authentication">
                  <SettingRow label="Require Email Verification" description="Users must verify their email before accessing the app.">
                    <Switch checked={requireEmailVerification} onCheckedChange={setRequireEmailVerification} />
                  </SettingRow>
                  <Separator className="opacity-50" />
                  <SettingRow label="Session Timeout (days)" description="How long a session stays active before requiring re-login.">
                    <Input value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} type="number" className="max-w-[100px]" />
                  </SettingRow>
                  <Separator className="opacity-50" />
                  <SettingRow label="Require 2FA for Admins" description="Enforce two-factor authentication for all admin users.">
                    <Switch checked={twoFactorRequired} onCheckedChange={setTwoFactorRequired} />
                  </SettingRow>
                </SettingGroup>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">{title}</h3>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex-1 min-w-0">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}
