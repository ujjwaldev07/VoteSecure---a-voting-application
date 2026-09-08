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
  // POST /api/auth/admin/signup
  signup: (data: AdminSignupPayload) =>
    apiClient.post<AuthResponse>('/auth/admin/signup', data, {
      skipErrorToast: true,
    }),

  // POST /api/auth/admin/login
  login: (data: AdminLoginPayload) =>
    apiClient.post<AuthResponse>('/auth/admin/login', data, {
      skipErrorToast: true,
    }),

  // GET /api/auth/admin/profile
  getProfile: () =>
    apiClient.get<{ success: boolean; admin: Admin }>('/auth/admin/profile'),

  // GET /api/auth/admin/analytics
  getAnalytics: () =>
    apiClient.get<{
      success: boolean
      candidateCount: number
      voterCount: number
      votedCount: number
      turnoutPercentage: number
      topCandidates: Array<{
        _id: string
        name: string
        party: string
        voteCount: number
      }>
    }>('/auth/admin/analytics'),
}