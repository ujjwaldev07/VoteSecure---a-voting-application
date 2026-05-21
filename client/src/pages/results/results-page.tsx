import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageTransition } from '@/components/shared/page-transition'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useCandidates, useVoteCounts } from '@/hooks/use-candidates'
import { getPartyColor, formatNumber } from '@/lib/utils'

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 1200
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value])
  return <span>{formatNumber(count)}</span>
}

export default function ResultsPage() {
  const { data: candidates = [], isLoading } = useCandidates()
  const { data: voteCounts = [] } = useVoteCounts()

  const totalVotes = candidates.reduce((s, c) => s + c.voteCount, 0)
  const sorted = [...candidates].sort((a, b) => b.voteCount - a.voteCount)
  const winner = sorted[0]

  const pieData = voteCounts.map((v) => ({
    name: v.party,
    value: v.count,
    fill: getPartyColor(v.party),
  }))

  const barData = sorted.map((c) => ({
    name: c.name.split(' ')[0],
    votes: c.voteCount,
    fill: getPartyColor(c.party),
  }))

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Election Results</h1>
        <p className="text-muted-foreground">Live vote counts and rankings</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 grid gap-4 sm:grid-cols-3"
      >
        <Card className="glow-primary">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total votes</p>
            <p className="text-3xl font-bold">
              {isLoading ? '—' : <AnimatedCounter value={totalVotes} />}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Candidates</p>
            <p className="text-3xl font-bold">{candidates.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Leading party</p>
            <p className="text-3xl font-bold">{voteCounts[0]?.party ?? '—'}</p>
          </CardContent>
        </Card>
      </motion.div>

      {winner && (
        <Card className="mb-8 border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-4 py-6">
            <Trophy className="h-10 w-10 text-amber-500" />
            <div>
              <Badge className="mb-1 bg-amber-500/20 text-amber-600">Current leader</Badge>
              <h2 className="text-xl font-bold">{winner.name}</h2>
              <p className="text-muted-foreground">
                {winner.party} · {winner.voteCount} votes (
                {totalVotes ? ((winner.voteCount / totalVotes) * 100).toFixed(1) : 0}%)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vote share</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Votes by candidate</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={80} className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="votes" radius={[0, 4, 4, 0]} animationDuration={800}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sorted.map((c, i) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between rounded-lg border border-border/50 p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.party}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{c.voteCount}</p>
                  <p className="text-xs text-muted-foreground">
                    {totalVotes ? ((c.voteCount / totalVotes) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
