import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Shield,
  Sparkles,
  Users,
  Vote,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/page-transition'
import { ROUTES } from '@/lib/constants'

const features = [
  { icon: Shield, title: 'Bank-grade security', desc: 'JWT auth, encrypted sessions, role-based access control.' },
  { icon: Zap, title: 'Real-time results', desc: 'Live vote counts and analytics updated every 30 seconds.' },
  { icon: BarChart3, title: 'Rich analytics', desc: 'Charts, rankings, and turnout statistics at a glance.' },
  { icon: Users, title: 'One vote per citizen', desc: 'Tamper-proof single-vote enforcement built into the system.' },
]

const stats = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '50ms', label: 'Avg latency' },
  { value: '10K+', label: 'Votes secured' },
  { value: '100%', label: 'Audit trail' },
]

const faqs = [
  { q: 'How secure is VoteSecure?', a: 'We use JWT authentication, bcrypt password hashing, and role-based access to protect every vote.' },
  { q: 'Can I change my vote?', a: 'No. Once cast, your vote is permanently recorded to ensure election integrity.' },
  { q: 'Who can vote?', a: 'Registered voters with the voter role. Administrators manage the election but cannot vote.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-500">
              <Vote className="h-4 w-4 text-white" />
            </div>
            <span className="gradient-text">VoteSecure</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to={ROUTES.LOGIN}>Sign in</Link>
            </Button>
            <Button variant="glow" asChild>
              <Link to={ROUTES.SIGNUP}>Get started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={false}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-primary/40"
              style={{ left: `${(i * 17) % 100}%`, top: `${(i * 23) % 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>

        <FadeIn>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            Enterprise digital voting platform
          </div>
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
            Democracy,{' '}
            <span className="gradient-text">reimagined</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Secure, transparent, and beautiful voting experiences built for modern elections.
            Trusted by organizations that demand excellence.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="glow" asChild>
              <Link to={ROUTES.SIGNUP}>
                Start voting <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={ROUTES.RESULTS}>View live results</Link>
            </Button>
          </div>
        </FadeIn>
      </section>

      <section className="border-y border-border/50 bg-muted/20 py-16">
        <StaggerContainer className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <div className="text-3xl font-bold gradient-text">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <FadeIn className="mb-16 text-center">
            <h2 className="text-3xl font-bold">Built for trust</h2>
            <p className="mt-4 text-muted-foreground">Everything you need for a world-class election</p>
          </FadeIn>
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <div className="glass rounded-xl p-6 transition-all hover:glow-primary">
                  <f.icon className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-t border-border/50 py-24 px-6">
        <div className="mx-auto max-w-2xl">
          <FadeIn className="mb-12 text-center">
            <h2 className="text-3xl font-bold">FAQ</h2>
          </FadeIn>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <FadeIn key={f.q} delay={i * 0.1}>
                <details className="glass group rounded-xl p-4">
                  <summary className="cursor-pointer font-medium">{f.q}</summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-12 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} VoteSecure. All rights reserved.</p>
      </footer>
    </div>
  )
}
