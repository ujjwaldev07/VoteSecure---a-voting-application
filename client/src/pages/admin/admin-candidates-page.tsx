import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { PageTransition } from '@/components/shared/page-transition'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useCandidates,
  useCreateCandidate,
  useUpdateCandidate,
  useDeleteCandidate,
} from '@/hooks/use-candidates'
import type { Candidate } from '@/types'
import { getErrorMessage } from '@/api/client'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2),
  party: z.string().min(2),
  age: z.number().min(25).max(100),
})

type FormData = z.infer<typeof schema>

export default function AdminCandidatesPage() {
  const { data: candidates = [], isLoading } = useCandidates()
  const createMutation = useCreateCandidate()
  const updateMutation = useUpdateCandidate()
  const deleteMutation = useDeleteCandidate()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Candidate | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { age: 35 },
  })

  const openCreate = () => {
    setEditing(null)
    reset({ name: '', party: '', age: 35 })
    setOpen(true)
  }

  const openEdit = (c: Candidate) => {
    setEditing(c)
    reset({ name: c.name, party: c.party, age: c.age })
    setOpen(true)
  }

  const onSubmit = async (data: FormData) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing._id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      setOpen(false)
      reset()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <PageTransition>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Candidates</h1>
          <p className="text-muted-foreground">Add, edit, or remove candidates</p>
        </div>
        <Button variant="glow" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add candidate
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All candidates ({candidates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Party</th>
                    <th className="pb-3 font-medium">Age</th>
                    <th className="pb-3 font-medium">Votes</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c, i) => (
                    <motion.tr
                      key={c._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50"
                    >
                      <td className="py-3 font-medium">{c.name}</td>
                      <td className="py-3">{c.party}</td>
                      <td className="py-3">{c.age}</td>
                      <td className="py-3">{c.voteCount}</td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)} aria-label={`Edit ${c.name}`}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(c._id)} aria-label={`Delete ${c.name}`}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit candidate' : 'Add candidate'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} error={!!errors.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="party">Party</Label>
              <Input id="party" {...register('party')} error={!!errors.party} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" {...register('age', { valueAsNumber: true })} error={!!errors.age} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="glow" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : editing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete candidate?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <Loader2 className="animate-spin" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}
