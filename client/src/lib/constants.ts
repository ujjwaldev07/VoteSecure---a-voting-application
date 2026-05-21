export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
export const THEME_KEY = 'votesecure_theme'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_SIGNUP: '/admin/signup',
  DASHBOARD: '/dashboard',
  CANDIDATES: '/candidates',
  RESULTS: '/results',
  ADMIN: '/admin',
  ADMIN_CANDIDATES: '/admin/candidates',
  ADMIN_ANALYTICS: '/admin/analytics',
  PROFILE: '/profile',
} as const

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

export const PARTY_CATEGORIES = [
  'All',
  'Democrat',
  'Republican',
  'Independent',
  'Green',
  'Libertarian',
] as const
