import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageTransition } from '@/components/shared/page-transition'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartFrame } from '@/components/shared/chart-frame'
import { useCandidates, useVoteCounts } from '@/hooks/use-candidates'
import { getPartyColor, formatNumber } from '@/lib/utils'

export default function AdminAnalyticsPage() {
  const { data: candidates = [] } = useCandidates()
  const { data: voteCounts = [] } = useVoteCounts()

  const totalVotes = candidates.reduce((s, c) => s + c.voteCount, 0)

  const partyData = voteCounts.map((v) => ({
    party: v.party,
    votes: v.count,
    fill: getPartyColor(v.party),
  }))

  const trendData = candidates.map((c, i) => ({
    name: c.name.split(' ')[0],
    votes: c.voteCount,
    index: i + 1,
  }))

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Election Analytics</h1>
        <p className="text-muted-foreground">Detailed voting statistics and trends</p>
      </div>

      <motion.div
        className="mb-8 grid gap-4 sm:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[
          { label: 'Total votes', value: formatNumber(totalVotes) },
          { label: 'Candidates', value: candidates.length },
          { label: 'Parties', value: voteCounts.length },
          {
            label: 'Avg per candidate',
            value: candidates.length ? Math.round(totalVotes / candidates.length) : 0,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Votes by party</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartFrame height={320}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={partyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="party" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="votes" radius={[4, 4, 0, 0]} animationDuration={800}>
                  {partyData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartFrame>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Candidate performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartFrame height={320}>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="votes"
                  stroke="oklch(0.55 0.22 264)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  animationDuration={800}
                />
                </LineChart>
              </ResponsiveContainer>
            </ChartFrame>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
