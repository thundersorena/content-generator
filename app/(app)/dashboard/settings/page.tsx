'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { Save, User, Lock, Bell, Trash2, Eye, EyeOff } from 'lucide-react'
import { AppHeader } from '@/components/app/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/lib/store/auth-store'
import { cn } from '@/lib/utils'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Enter your current password'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ProfileData = z.infer<typeof profileSchema>
type PasswordData = z.infer<typeof passwordSchema>

const SECTIONS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'password',      label: 'Password',       icon: Lock },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
  { id: 'danger',        label: 'Danger Zone',    icon: Trash2 },
]

export default function UserSettingsPage() {
  const { user, setUser } = useAuthStore()
  const [activeSection, setActiveSection] = useState('profile')
  const [profileSaved, setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  // Notification prefs
  const [notifExecDone, setNotifExecDone] = useState(true)
  const [notifExecFailed, setNotifExecFailed] = useState(true)
  const [notifNewsletter, setNotifNewsletter] = useState(false)
  const [notifSaved, setNotifSaved] = useState(false)

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  })

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const onProfileSubmit = async (data: ProfileData) => {
    await new Promise((r) => setTimeout(r, 800))
    if (user) setUser({ ...user, name: data.name, email: data.email })
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  const onPasswordSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800))
    passwordForm.reset()
    setPasswordSaved(true)
    setTimeout(() => setPasswordSaved(false), 2500)
  }

  const handleNotifSave = async () => {
    await new Promise((r) => setTimeout(r, 500))
    setNotifSaved(true)
    setTimeout(() => setNotifSaved(false), 2500)
  }

  return (
    <div>
      <AppHeader title="Account Settings" description="Manage your profile and preferences." />

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
                      ? s.id === 'danger'
                        ? 'bg-destructive/10 text-destructive font-medium'
                        : 'bg-brand/10 text-brand font-medium'
                      : s.id === 'danger'
                      ? 'text-destructive/70 hover:text-destructive hover:bg-destructive/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <s.icon className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:block">{s.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Content panel */}
          <div className="flex-1 bg-card border border-border/60 rounded-2xl overflow-hidden">

            {/* Profile */}
            {activeSection === 'profile' && (
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <SectionHeader title="Profile" description="Update your name and email address.">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={profileForm.formState.isSubmitting}
                    className={cn('gap-1.5 border-0', profileSaved ? 'bg-green-500/20 text-green-400 hover:bg-green-500/20' : 'bg-brand text-white hover:bg-brand/90')}
                  >
                    <Save className="w-3.5 h-3.5" />
                    {profileSaved ? 'Saved!' : 'Save'}
                  </Button>
                </SectionHeader>

                <div className="p-6 space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-brand/20 text-brand text-xl font-bold">
                        {user?.name?.[0] ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{user?.role} account</p>
                      <button type="button" className="text-xs text-brand hover:underline mt-1">
                        Change avatar
                      </button>
                    </div>
                  </div>

                  <Separator className="opacity-50" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" {...profileForm.register('name')} />
                      {profileForm.formState.errors.name && (
                        <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" {...profileForm.register('email')} />
                      {profileForm.formState.errors.email && (
                        <p className="text-xs text-destructive">{profileForm.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-muted/40 rounded-xl p-4 text-xs text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                    Account created {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' }) : '—'}
                  </div>
                </div>
              </form>
            )}

            {/* Password */}
            {activeSection === 'password' && (
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <SectionHeader title="Change Password" description="Use a strong, unique password.">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={passwordForm.formState.isSubmitting}
                    className={cn('gap-1.5 border-0', passwordSaved ? 'bg-green-500/20 text-green-400 hover:bg-green-500/20' : 'bg-brand text-white hover:bg-brand/90')}
                  >
                    <Save className="w-3.5 h-3.5" />
                    {passwordSaved ? 'Updated!' : 'Update'}
                  </Button>
                </SectionHeader>

                <div className="p-6 space-y-5 max-w-md">
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrent ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...passwordForm.register('currentPassword')}
                      />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-xs text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNew ? 'text' : 'password'}
                        placeholder="Min. 8 characters"
                        {...passwordForm.register('newPassword')}
                      />
                      <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••" {...passwordForm.register('confirmPassword')} />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </form>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div>
                <SectionHeader title="Notifications" description="Choose what updates you receive.">
                  <Button
                    type="button"
                    onClick={handleNotifSave}
                    size="sm"
                    className={cn('gap-1.5 border-0', notifSaved ? 'bg-green-500/20 text-green-400 hover:bg-green-500/20' : 'bg-brand text-white hover:bg-brand/90')}
                  >
                    <Save className="w-3.5 h-3.5" />
                    {notifSaved ? 'Saved!' : 'Save'}
                  </Button>
                </SectionHeader>

                <div className="p-6 space-y-5">
                  {[
                    { label: 'Execution completed', description: 'Email when an automation finishes successfully.', value: notifExecDone, onChange: setNotifExecDone },
                    { label: 'Execution failed', description: 'Email when an automation encounters an error.', value: notifExecFailed, onChange: setNotifExecFailed },
                    { label: 'Product updates', description: 'Occasional emails about new features and improvements.', value: notifNewsletter, onChange: setNotifNewsletter },
                  ].map(({ label, description, value, onChange }, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between gap-6">
                        <div>
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                        </div>
                        <Switch checked={value} onCheckedChange={onChange} />
                      </div>
                      {i < 2 && <Separator className="mt-5 opacity-50" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Danger Zone */}
            {activeSection === 'danger' && (
              <div>
                <SectionHeader title="Danger Zone" description="Irreversible actions — proceed with caution." />

                <div className="p-6 space-y-4">
                  <div className="border border-destructive/30 rounded-xl p-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">Delete all execution history</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Permanently removes all your past automation runs. This cannot be undone.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="border-destructive/40 text-destructive hover:bg-destructive/10 shrink-0">
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear history
                    </Button>
                  </div>

                  <div className="border border-destructive/30 rounded-xl p-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">Delete account</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Permanently deletes your account and all associated data. Cannot be reversed.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="border-destructive/50 text-destructive hover:bg-destructive hover:text-white shrink-0">
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between">
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  )
}
