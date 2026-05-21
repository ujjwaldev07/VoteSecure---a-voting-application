import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { candidatesApi, type CandidatePayload } from '@/api/candidates'
import { toast } from 'sonner'

export const candidateKeys = {
  all: ['candidates'] as const,
  counts: ['vote-counts'] as const,
}

export function useCandidates() {
  return useQuery({
    queryKey: candidateKeys.all,
    queryFn: async () => {
      const { data } = await candidatesApi.getAll()
      return data.candidates
    },
    staleTime: 30_000,
  })
}

export function useVoteCounts() {
  return useQuery({
    queryKey: candidateKeys.counts,
    queryFn: async () => {
      const { data } = await candidatesApi.getVoteCounts()
      return data.results
    },
    refetchInterval: 30_000,
  })
}

export function useVote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (candidateId: string) => candidatesApi.vote(candidateId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: candidateKeys.all })
      void qc.invalidateQueries({ queryKey: candidateKeys.counts })
    },
  })
}

export function useCreateCandidate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CandidatePayload) => candidatesApi.create(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: candidateKeys.all })
      toast.success('Candidate created')
    },
  })
}

export function useUpdateCandidate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CandidatePayload> }) =>
      candidatesApi.update(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: candidateKeys.all })
      toast.success('Candidate updated')
    },
  })
}

export function useDeleteCandidate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => candidatesApi.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: candidateKeys.all })
      toast.success('Candidate deleted')
    },
  })
}
