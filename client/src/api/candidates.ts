import { apiClient } from './client'
import type { Candidate, CandidatesResponse, VoteCountResponse } from '@/types'

export interface CandidatePayload {
  name: string
  party: string
  age: number
}

export const candidatesApi = {
  // GET /api/auth/candidate
  getAll: (page = 1, limit = 10) =>
    apiClient.get<CandidatesResponse>(
      `/auth/candidate?page=${page}&limit=${limit}`
    ),

  // POST /api/auth/candidate
  create: (data: CandidatePayload) =>
    apiClient.post<{ success: boolean; candidate: Candidate }>(
      '/auth/candidate',
      data
    ),

  // PUT /api/auth/candidate/:candidateId
  update: (candidateId: string, data: Partial<CandidatePayload>) =>
    apiClient.put<{ success: boolean; candidate: Candidate }>(
      `/auth/candidate/${candidateId}`,
      data
    ),

  // DELETE /api/auth/candidate/:candidateId
  delete: (candidateId: string) =>
    apiClient.delete<{ success: boolean; message: string }>(
      `/auth/candidate/${candidateId}`
    ),

  // POST /api/auth/candidate/vote/:candidateId
  vote: (candidateId: string) =>
    apiClient.post<{ success: boolean; message: string }>(
      `/auth/candidate/vote/${candidateId}`
    ),

  // GET /api/results
  getVoteCounts: () =>
    apiClient.get<VoteCountResponse>('/results'),
}