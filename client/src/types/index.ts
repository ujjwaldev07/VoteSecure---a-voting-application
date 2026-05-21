export type UserRole = 'voter' | 'admin'
export type AccountType = 'user' | 'admin'

export interface User {
  _id: string
  name: string
  age?: number
  email?: string
  mobile?: string
  address?: string
  aadharCardNumber?: string
  role: UserRole
  isVoted?: boolean
}

export interface Admin {
  _id: string
  name: string
  email: string
  role: 'admin'
}

export interface Candidate {
  _id: string
  name: string
  party: string
  age: number
  voteCount: number
}

export interface VoteCount {
  _id: string
  name: string
  party: string
  count: number
}

export interface AuthResponse {
  success?: boolean
  message?: string
  user?: User
  admin?: Admin
  csrfToken?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface ApiError {
  success?: boolean
  error?: string
  message?: string
}

export interface CandidatesResponse {
  success: boolean
  candidates: Candidate[]
  count: number
  page: number
  pages: number
  fromCache?: boolean
}

export interface VoteCountResponse {
  success: boolean
  results: VoteCount[]
  fromCache?: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}
