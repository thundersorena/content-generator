'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  Search, MoreHorizontal, ShieldCheck, ShieldOff, UserX,
  Mail, CheckCircle2, Clock, Users,
} from 'lucide-react'
import { AppHeader } from '@/components/app/header'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MOCK_USERS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type UserStatus = 'active' | 'pending' | 'suspended'

const STATUS_CONFIG: Record<UserStatus, { label: string; classes: string }> = {
  active:    { label: 'Active',    classes: 'bg-green-500/15 text-green-400 border-green-500/20' },
  pending:   { label: 'Pending',   classes: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
  suspended: { label: 'Suspended', classes: 'bg-red-500/15 text-red-400 border-red-500/20' },
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || u.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    all: MOCK_USERS.length,
    active: MOCK_USERS.filter((u) => u.status === 'active').length,
    pending: MOCK_USERS.filter((u) => u.status === 'pending').length,
    suspended: MOCK_USERS.filter((u) => u.status === 'suspended').length,
  }

  return (
    <div>
      <AppHeader
        title="User Management"
        description="View, search, and manage platform users."
      />

      <div className="p-6 space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {([
            { label: 'Total Users',    value: counts.all,       icon: Users,        color: 'text-brand',       bg: 'bg-brand/10' },
            { label: 'Active',         value: counts.active,    icon: CheckCircle2, color: 'text-green-400',   bg: 'bg-green-500/10' },
            { label: 'Pending',        value: counts.pending,   icon: Clock,        color: 'text-yellow-400',  bg: 'bg-yellow-500/10' },
            { label: 'Suspended',      value: counts.suspended, icon: UserX,        color: 'text-red-400',     bg: 'bg-red-500/10' },
          ] as const).map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-card border border-border/60 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', bg)}>
                  <Icon className={cn('w-4 h-4', color)} />
                </div>
              </div>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:border-brand transition-colors"
            />
          </div>
          <div className="flex gap-1">
            {(['all', 'active', 'pending', 'suspended'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                  statusFilter === s
                    ? 'bg-brand text-white'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                {s} {s !== 'all' && <span className="opacity-60">({counts[s]})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* User table */}
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  {['User', 'Role', 'Email Verified', 'Executions', 'Tokens', 'Joined', 'Status', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => {
                  const statusCfg = STATUS_CONFIG[user.status as UserStatus]
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-brand/20 text-brand text-xs font-semibold">
                              {user.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium leading-tight">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs capitalize',
                            user.role === 'admin'
                              ? 'border-brand/40 text-brand bg-brand/10'
                              : 'border-border text-muted-foreground'
                          )}
                        >
                          {user.role}
                        </Badge>
                      </td>

                      {/* Email verified */}
                      <td className="px-5 py-4">
                        {user.emailVerified ? (
                          <span className="flex items-center gap-1 text-green-400 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </td>

                      {/* Executions */}
                      <td className="px-5 py-4 text-muted-foreground">{user.executions.toLocaleString()}</td>

                      {/* Tokens */}
                      <td className="px-5 py-4 text-muted-foreground">
                        {(user.tokensUsed / 1000).toFixed(1)}K
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(user.createdAt), 'MMM d, yyyy')}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border', statusCfg.classes)}>
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {openMenu === user.id && (
                            <div className="absolute right-0 top-8 z-20 bg-popover border border-border rounded-xl shadow-lg w-44 py-1 overflow-hidden">
                              {[
                                { icon: Mail,      label: 'Send Email' },
                                { icon: ShieldCheck, label: 'Make Admin' },
                                { icon: ShieldOff,  label: 'Suspend User' },
                                { icon: UserX,      label: 'Delete User' },
                              ].map(({ icon: Icon, label }) => (
                                <button
                                  key={label}
                                  onClick={() => setOpenMenu(null)}
                                  className={cn(
                                    'flex items-center gap-2.5 w-full px-4 py-2 text-sm hover:bg-muted transition-colors text-left',
                                    label === 'Delete User' && 'text-destructive hover:bg-destructive/10'
                                  )}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                  {label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No users found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
