import { apiClient, resetCsrfToken } from './client'
import type { AuthResponse, User } from '@/types'

export interface VoterSignupPayload {
  name: string
  age: number
  email?: string
  mobile: string
  address: string
  aadharCardNumber: string
  password: string
}

export interface AdminSignupPayload {
  name: string
  email: string
  password: string
}

export interface VoterLoginPayload {
  email?: string
  aadharCardNumber?: string
  password: string
}

export interface AdminLoginPayload {
  email: string
  password: string
}

export interface PasswordUpdatePayload {
  currentPassword: string
  newPassword: string
}

export interface GoogleAuthPayload {
  credential: string
}

export const authApi = {
  signup: (data: VoterSignupPayload) =>
    apiClient.post<AuthResponse>('/auth/signup', data, { skipErrorToast: true }),

  signupVoter: (data: VoterSignupPayload) =>
    apiClient.post<AuthResponse>('/auth/signup/voter', data, { skipErrorToast: true }),

  signupAdmin: (data: AdminSignupPayload) =>
    apiClient.post<AuthResponse>('/auth/signup/admin', data, { skipErrorToast: true }),

  login: (data: VoterLoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login', data, { skipErrorToast: true }),

  loginVoter: (data: VoterLoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login/voter', data, { skipErrorToast: true }),

  loginAdmin: (data: AdminLoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login/admin', data, { skipErrorToast: true }),

  google: (data: GoogleAuthPayload) =>
    apiClient.post<AuthResponse>('/auth/google', data, { skipErrorToast: true }),

  refresh: () =>
    apiClient.post<AuthResponse>('/auth/refresh', undefined, {
      skipErrorToast: true,
      skipAuthRefresh: true,
    }),

  logout: async () => {
    const response = await apiClient.post<{ success: boolean; message: string }>('/auth/logout')
    resetCsrfToken()
    return response
  },

  getMe: () =>
    apiClient.get<{ success: boolean; user: User }>('/auth/me', {
      skipErrorToast: true,
      skipAuthRefresh: true,
    }),

  getCsrfToken: () =>
    apiClient.get<{ success: boolean; csrfToken: string }>('/auth/csrf', {
      skipErrorToast: true,
      skipAuthRefresh: true,
      skipCsrf: true,
    }),

  getProfile: () =>
    apiClient.get<{ success: boolean; user: User }>('/user/profile'),

  updatePassword: (data: PasswordUpdatePayload) =>
    apiClient.put<{ success: boolean; message: string }>('/user/profile/password', data),
}
