import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, Download, Settings, Users } from 'lucide-react'
import { PageTransition } from '@/components/shared/page-transition'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCandidates } from '@/hooks/use-candidates'
import { ROUTES } from '@/lib/constants'
import { formatNumber } from '@/lib/utils'
import { toast } from 'sonner'

const adminActions = [
  {
    title: 'Manage Candidates',
    desc: 'Add, edit, or remove election candidates',
    icon: Users,
    to: ROUTES.ADMIN_CANDIDATES,
  },
  {
    title: 'Analytics',
    desc: 'View detailed voting statistics and trends',
    icon: BarChart3,
    to: ROUTES.ADMIN_ANALYTICS,
  },
  {
    title: 'Election Settings',
    desc: 'Configure election parameters',
    icon: Settings,
    to: ROUTES.ADMIN,
  },
]

export default function AdminPage() {
  const { data: candidates = [] } = useCandidates()
  const totalVotes = candidates.reduce((s, c) => s + c.voteCount, 0)

  const exportReport = () => {
    const csv = [
      'Name,Party,Age,Votes',
      ...candidates.map((c) => `${c.name},${c.party},${c.age},${c.voteCount}`),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'election-report.csv'
    a.click()
    toast.success('Report exported')
  }

  return (
    <PageTransition>
      <motion.div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your election platform</p>
        </div>
        <Button variant="outline" onClick={exportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export report
        </Button>
      </motion.div>

      <motion.div
        className="mb-8 grid gap-4 sm:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Candidates</p>
            <p className="text-2xl font-bold">{candidates.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total votes</p>
            <p className="text-2xl font-bold">{formatNumber(totalVotes)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Parties</p>
            <p className="text-2xl font-bold">{new Set(candidates.map((c) => c.party)).size}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adminActions.map((action, i) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="h-full transition-shadow hover:glow-primary">
              <CardHeader>
                <action.icon className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>{action.title}</CardTitle>
                <CardDescription>{action.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to={action.to}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </PageTransition>
  )
}
