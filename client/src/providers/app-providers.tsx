import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'sonner'
import { ThemeProvider } from './theme-provider'
import { AuthBootstrap } from './auth-bootstrap'
import { GOOGLE_CLIENT_ID } from '@/lib/constants'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function AuthProviders({ children }: { children: ReactNode }) {
  if (!GOOGLE_CLIENT_ID) {
    return <>{children}</>
  }

  return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProviders>
            <AuthBootstrap />
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                className: 'glass',
              }}
            />
          </AuthProviders>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
