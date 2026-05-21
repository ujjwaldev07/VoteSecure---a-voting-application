import { motion } from 'framer-motion'
import { CheckCircle2, Vote } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { getInitials, getPartyColor } from '@/lib/utils'
import type { Candidate } from '@/types'

interface CandidateCardProps {
  candidate: Candidate
  votePercent: number
  onVote: () => void
  hasVoted: boolean
  isAdmin: boolean
  disabled?: boolean
}

export function CandidateCard({
  candidate,
  votePercent,
  onVote,
  hasVoted,
  isAdmin,
  disabled,
}: CandidateCardProps) {
  const photo = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(candidate.name)}`

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="gradient-border group overflow-hidden transition-shadow hover:glow-primary">
        <CardHeader className="flex flex-row items-start gap-4 pb-2">
          <Avatar className="h-14 w-14 ring-2 ring-primary/30">
            <AvatarImage src={photo} alt={candidate.name} />
            <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{candidate.name}</h3>
            <Badge
              className="mt-1"
              style={{ backgroundColor: `${getPartyColor(candidate.party)}20`, color: getPartyColor(candidate.party) }}
            >
              {candidate.party}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Age {candidate.age} · {candidate.voteCount} votes · Platform focused on transparency & growth
          </p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Vote share</span>
              <span className="font-medium">{votePercent.toFixed(1)}%</span>
            </div>
            <Progress value={votePercent} className="h-2" />
          </div>
        </CardContent>
        <CardFooter>
          {hasVoted ? (
            <Button variant="secondary" className="w-full" disabled>
              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
              Already Voted
            </Button>
          ) : isAdmin ? (
            <Button variant="outline" className="w-full" disabled>
              Admins cannot vote
            </Button>
          ) : (
            <Button
              variant="glow"
              className="w-full"
              onClick={onVote}
              disabled={disabled}
            >
              <Vote className="mr-2 h-4 w-4" />
              Vote
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
