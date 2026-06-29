'use client'

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, Zap, Users, Coins, CheckCircle2 } from 'lucide-react'
import { AppHeader } from '@/components/app/header'
import { StatCard } from '@/components/app/stat-card'
import { ANALYTICS } from '@/lib/mock-data'

const COLORS = [
  'oklch(0.62 0.22 265)',
  'oklch(0.68 0.18 200)',
  'oklch(0.72 0.14 145)',
  'oklch(0.74 0.19 50)',
]

const TOOLTIP_STYLE = {
  contentStyle: {
    background: 'oklch(0.12 0 0)',
    border: '1px solid oklch(1 0 0 / 10%)',
    borderRadius: 10,
    fontSize: 12,
  },
  labelStyle: { color: 'oklch(0.96 0 0)' },
}

const TICK_STYLE = { fontSize: 11, fill: 'oklch(0.58 0 0)' }

// Extended mock data for analytics page
const WEEKLY_DATA = [
  { date: 'Jun 23', executions: 420, tokens: 1800000, users: 87 },
  { date: 'Jun 24', executions: 380, tokens: 1550000, users: 82 },
  { date: 'Jun 25', executions: 510, tokens: 2200000, users: 95 },
  { date: 'Jun 26', executions: 445, tokens: 1950000, users: 91 },
  { date: 'Jun 27', executions: 620, tokens: 2700000, users: 103 },
  { date: 'Jun 28', executions: 580, tokens: 2450000, users: 99 },
  { date: 'Jun 29', executions: 490, tokens: 2050000, users: 93 },
]

const WORKFLOW_DATA = [
  { name: 'Content Generator', executions: 4120 },
  { name: 'Data Analyzer',     executions: 3310 },
  { name: 'Email Drafter',     executions: 2490 },
  { name: 'Report Builder',    executions: 1680 },
  { name: 'SEO Optimizer',     executions: 1247 },
]

export default function AdminAnalyticsPage() {
  return (
    <div>
      <AppHeader title="Platform Analytics" description="Deep-dive metrics across all users and workflows." />

      <div className="p-6 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Executions"  value={ANALYTICS.totalExecutions.toLocaleString()} change="+18%" icon={Zap} />
          <StatCard title="Active Users"       value={ANALYTICS.activeUsers.toLocaleString()}     change="+8%"  icon={Users}         iconColor="bg-blue-500/10"   iconTextColor="text-blue-400" />
          <StatCard title="Total Tokens"       value={`${(ANALYTICS.totalTokens / 1_000_000).toFixed(1)}M`} change="+31%" icon={Coins} iconColor="bg-yellow-500/10" iconTextColor="text-yellow-400" />
          <StatCard title="Success Rate"       value={`${ANALYTICS.successRate}%`}                change="+0.4%" icon={CheckCircle2}  iconColor="bg-green-500/10" iconTextColor="text-green-400" />
        </div>

        {/* Executions & users over time */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-card border border-border/60 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-sm">Daily Executions</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Last 7 days</p>
              </div>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={WEEKLY_DATA}>
                <defs>
                  <linearGradient id="execGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS[0]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                <XAxis dataKey="date" tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Area
                  type="monotone" dataKey="executions"
                  stroke={COLORS[0]} fill="url(#execGrad2)" strokeWidth={2}
                  name="Executions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border/60 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-sm">Daily Active Users</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Last 7 days</p>
              </div>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={WEEKLY_DATA}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS[1]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                <XAxis dataKey="date" tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Area
                  type="monotone" dataKey="users"
                  stroke={COLORS[1]} fill="url(#userGrad)" strokeWidth={2}
                  name="Active Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tokens + Workflow breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Token usage by model - pie */}
          <div className="bg-card border border-border/60 rounded-2xl p-5">
            <h2 className="font-semibold text-sm mb-5">Tokens by Model</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={ANALYTICS.tokensByModel}
                  dataKey="tokens"
                  nameKey="model"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {ANALYTICS.tokensByModel.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  {...TOOLTIP_STYLE}
                  formatter={(v: unknown) => [`${(Number(v) / 1_000_000).toFixed(1)}M`, 'Tokens']}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ fontSize: 11, color: 'oklch(0.58 0 0)' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Workflow popularity */}
          <div className="lg:col-span-2 bg-card border border-border/60 rounded-2xl p-5">
            <h2 className="font-semibold text-sm mb-5">Executions by Workflow</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={WORKFLOW_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" horizontal={false} />
                <XAxis
                  type="number" tick={TICK_STYLE}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  type="category" dataKey="name"
                  tick={TICK_STYLE} axisLine={false}
                  tickLine={false} width={120}
                />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="executions" radius={[0, 4, 4, 0]} name="Executions">
                  {WORKFLOW_DATA.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Token usage over time */}
        <div className="bg-card border border-border/60 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-sm">Token Consumption Over Time</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Daily token usage across all users</p>
            </div>
            <Coins className="w-4 h-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={WEEKLY_DATA}>
              <defs>
                <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={COLORS[3]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS[3]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
              <XAxis dataKey="date" tick={TICK_STYLE} axisLine={false} tickLine={false} />
              <YAxis
                tick={TICK_STYLE} axisLine={false} tickLine={false}
                tickFormatter={(v: unknown) => `${(Number(v) / 1_000_000).toFixed(1)}M`}
              />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v: unknown) => [`${(Number(v) / 1_000_000).toFixed(2)}M`, 'Tokens']}
              />
              <Area
                type="monotone" dataKey="tokens"
                stroke={COLORS[3]} fill="url(#tokenGrad)" strokeWidth={2}
                name="Tokens"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
