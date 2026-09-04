import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/lib/constants'
import { useAuthStore } from '@/store/auth-store'
import type { ApiError, ApiResponse } from '@/types'

const MAX_RETRIES = 2
const RETRY_DELAY_MS = 600
const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete'])

let csrfToken: string | null = null
let csrfPromise: Promise<string> | null = null
let refreshPromise: Promise<void> | null = null

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

function shouldRetry(error: AxiosError): boolean {
  const status = error.response?.status
  if (status && status < 500) return false
  return !error.response || error.code === 'ECONNABORTED' || status === 503
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchCsrfToken() {
  if (csrfToken) return csrfToken
  if (!csrfPromise) {
    csrfPromise = apiClient
      .get<{ csrfToken: string }>('/auth/csrf', {
        withCredentials: true,
        timeout: 10000,
        skipCsrf: true,
        skipAuthRefresh: true,
        skipErrorToast: true,
      })
      .then((response) => {
        csrfToken = response.data.csrfToken
        return csrfToken
      })
      .finally(() => {
        csrfPromise = null
      })
  }

  return csrfPromise
}

async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post('/auth/refresh', undefined, {
        skipAuthRefresh: true,
        skipErrorToast: true,
      })
      .then((response) => {
        const user = response.data.user
        if (user) {
          useAuthStore.getState().setSession(user, user.role === 'admin' ? 'admin' : 'user')
        }
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

apiClient.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase()

  if (MUTATING_METHODS.has(method) && !config.skipCsrf) {
    const token = await fetchCsrfToken()
    config.headers = config.headers || {}
    config.headers['X-CSRF-Token'] = token
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const config = error.config as InternalAxiosRequestConfig | undefined

    if (config && shouldRetry(error)) {
      const retryCount = Number(config._retry ?? 0) + 1
      config._retry = retryCount
      if (retryCount <= MAX_RETRIES) {
        await delay(RETRY_DELAY_MS * retryCount)
        return apiClient.request(config)
      }
    }

    if (error.response?.status === 403 && extractErrorMessage(error) === 'Invalid CSRF token') {
      csrfToken = null
      if (config && !config._csrfRetry) {
        return apiClient.request({
          ...config,
          _csrfRetry: true,
          headers: { ...config.headers },
        })
      }
    }

    if (error.response?.status === 401 && config && !config.skipAuthRefresh) {
      try {
        await refreshSession()
        return apiClient.request({
          ...config,
          skipAuthRefresh: true,
        })
      } catch (refreshError) {
        useAuthStore.getState().clearAuth()
      }
    }

    const message = extractErrorMessage(error)

    if (error.response?.status === 401 && !config?.skipUnauthorizedRedirect) {
      const path = window.location.pathname
      const isAuthPage =
        path.includes('/login') ||
        path.includes('/signup') ||
        path.includes('/admin/login') ||
        path.includes('/admin/signup')

      if (!isAuthPage) {
        if (!config?.skipErrorToast) {
          toast.error('Session expired. Please sign in again.')
        }
        const isAdminArea = path.startsWith('/admin')
        window.location.href = isAdminArea ? '/admin/login' : '/login'
      }
    } else if (!config?.skipErrorToast) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export function resetCsrfToken() {
  csrfToken = null
}

export function extractErrorMessage(error: AxiosError<ApiError>): string {
  const data = error.response?.data
  if (data?.message) return data.message
  if (data?.error) return data.error
  if (error.message) return error.message
  return 'Something went wrong'
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    return extractErrorMessage(error)
  }
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred'
}

export function isApiSuccess<T>(
  data: ApiResponse<T> | undefined
): data is ApiResponse<T> & { success: true } {
  return data?.success === true
}
