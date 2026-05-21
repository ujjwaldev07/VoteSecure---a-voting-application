import { apiClient } from './client'
import type { Admin, AuthResponse } from '@/types'

export interface AdminSignupPayload {
  name: string
  email: string
  password: string
}

export interface AdminLoginPayload {
  email: string
  password: string
}

export const adminApi = {
  signup: (data: AdminSignupPayload) =>
    apiClient.post<AuthResponse>('/admin/signup', data, { skipErrorToast: true }),

  login: (data: AdminLoginPayload) =>
    apiClient.post<AuthResponse>('/admin/login', data, { skipErrorToast: true }),

  getProfile: () => apiClient.get<{ success: boolean; admin: Admin }>('/admin/profile'),

  getAnalytics: () =>
    apiClient.get<{
      success: boolean
      candidateCount: number
      voterCount: number
      votedCount: number
      turnoutPercentage: number
      topCandidates: Array<{ _id: string; name: string; party: string; voteCount: number }>
    }>('/admin/analytics'),
}
