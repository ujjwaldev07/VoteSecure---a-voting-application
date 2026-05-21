import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, BarChart3, TrendingUp, Users, Vote } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageTransition } from '@/components/shared/page-transition'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCandidates, useVoteCounts } from '@/hooks/use-candidates'
import { useProfile } from '@/hooks/use-profile'
import { useAuthStore } from '@/store/auth-store'
import { ROUTES } from '@/lib/constants'
import { formatNumber } from '@/lib/utils'

const statCards = [
  { key: 'candidates', label: 'Candidates', icon: Users, color: 'text-blue-500' },
  { key: 'votes', label: 'Total Votes', icon: Vote, color: 'text-violet-500' },
  { key: 'turnout', label: 'Your Status', icon: TrendingUp, color: 'text-emerald-500' },
  { key: 'leading', label: 'Leading Party', icon: BarChart3, color: 'text-amber-500' },
] as const

export default function DashboardPage() {
  const { data: user } = useProfile()
  const { data: candidates = [], isLoading } = useCandidates()
  const { data: voteCounts = [] } = useVoteCounts()
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin')

  const totalVotes = candidates.reduce((s, c) => s + c.voteCount, 0)
  const leading = voteCounts[0]

  const chartData = candidates.map((c) => ({
    name: c.name.split(' ')[0],
    votes: c.voteCount,
  }))

  const stats = {
    candidates: candidates.length,
    votes: totalVotes,
    turnout: user?.isVoted ? 'Voted' : 'Not voted',
    leading: leading?.party ?? '—',
  }

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name ?? 'Voter'}. Here&apos;s your election overview.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="hover:glow-primary transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">
                    {card.key === 'votes'
                      ? formatNumber(stats.votes)
                      : String(stats[card.key])}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vote distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="voteGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ background: 'var(--color-popover)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="votes" stroke="oklch(0.55 0.22 264)" fill="url(#voteGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Quick actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!user?.isVoted && !isAdmin && (
              <Button variant="glow" className="w-full" asChild>
                <Link to={ROUTES.CANDIDATES}>Cast your vote</Link>
              </Button>
            )}
            <Button variant="outline" className="w-full" asChild>
              <Link to={ROUTES.RESULTS}>View results</Link>
            </Button>
            {isAdmin && (
              <Button variant="outline" className="w-full" asChild>
                <Link to={ROUTES.ADMIN}>Admin panel</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {candidates.slice(0, 5).map((c) => (
              <div key={c._id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.party}</p>
                </div>
                <span className="text-sm font-medium">{c.voteCount} votes</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
