import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean
    skipAuthRefresh?: boolean
    skipCsrf?: boolean
    skipUnauthorizedRedirect?: boolean
    _retry?: number
    _csrfRetry?: boolean
  }
}
