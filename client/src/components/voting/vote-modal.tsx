import { useState } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useVote } from '@/hooks/use-candidates'
import { getErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/auth-store'
import type { Candidate } from '@/types'

interface VoteModalProps {
  candidate: Candidate | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function VoteModal({ candidate, open, onClose, onSuccess }: VoteModalProps) {
  const [success, setSuccess] = useState(false)
  const voteMutation = useVote()
  const setUser = useAuthStore((s) => s.setUser)
  const user = useAuthStore((s) => s.user)

  const handleVote = async () => {
    if (!candidate) return
    try {
      await voteMutation.mutateAsync(candidate._id)
      if (user) setUser({ ...user, isVoted: true })
      setSuccess(true)
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
      toast.success('Your vote has been recorded!')
      setTimeout(() => {
        onSuccess()
        onClose()
        setSuccess(false)
      }, 2000)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleClose = () => {
    if (!voteMutation.isPending) {
      onClose()
      setSuccess(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <CheckCircle2 className="mb-4 h-16 w-16 text-emerald-500" />
            <h3 className="text-xl font-bold">Vote Recorded!</h3>
            <p className="mt-2 text-muted-foreground">
              Thank you for participating in the election.
            </p>
          </motion.div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm your vote</DialogTitle>
              <DialogDescription>
                Are you sure you want to vote for{' '}
                <strong>{candidate?.name}</strong> ({candidate?.party})? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleClose} disabled={voteMutation.isPending}>
                Cancel
              </Button>
              <Button variant="glow" onClick={handleVote} disabled={voteMutation.isPending}>
                {voteMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Recording...
                  </>
                ) : (
                  'Confirm Vote'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
