import { apiClient } from './client'
import type { Candidate, CandidatesResponse, VoteCountResponse } from '@/types'

export interface CandidatePayload {
  name: string
  party: string
  age: number
}

export const candidatesApi = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get<CandidatesResponse>(`/candidate?page=${page}&limit=${limit}`),

  create: (data: CandidatePayload) =>
    apiClient.post<{ success: boolean; candidate: Candidate }>('/candidate', data),

  update: (candidateId: string, data: Partial<CandidatePayload>) =>
    apiClient.put<{ success: boolean; candidate: Candidate }>(`/candidate/${candidateId}`, data),

  delete: (candidateId: string) =>
    apiClient.delete<{ success: boolean; message: string }>(`/candidate/${candidateId}`),

  vote: (candidateId: string) =>
    apiClient.post<{ success: boolean; message: string }>('/vote', { candidateId }),

  getVoteCounts: () =>
    apiClient.get<VoteCountResponse>('/results'),
}
