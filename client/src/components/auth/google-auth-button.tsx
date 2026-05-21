import { useState } from 'react'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { getErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/auth-store'
import { GOOGLE_CLIENT_ID, ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface GoogleAuthButtonProps {
  mode?: 'login' | 'signup'
  className?: string
}

export function GoogleAuthButton({ mode = 'login', className }: GoogleAuthButtonProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Google sign-in failed. Please try again.')
      return
    }

    setLoading(true)
    try {
      const res = await authApi.google({ credential: credentialResponse.credential })
      if (res.data.user) {
        setSession(res.data.user, 'user')
      }
      toast.success(mode === 'signup' ? 'Account created with Google!' : 'Signed in with Google')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (!GOOGLE_CLIENT_ID) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        Google sign-in is not configured. Add VITE_GOOGLE_CLIENT_ID to your environment.
      </p>
    )
  }

  return (
    <motion.div className={cn('relative w-full', className)} layout>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm"
        >
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </motion.div>
      )}
      <motion.div
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: loading ? 1 : 0.99 }}
        className={cn(
          'flex justify-center overflow-hidden rounded-xl border border-border/60 bg-background/50 p-1 shadow-sm transition-shadow hover:shadow-md',
          loading && 'pointer-events-none opacity-70'
        )}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => toast.error('Google sign-in was cancelled or failed')}
          theme="outline"
          size="large"
          width="360"
          text={mode === 'signup' ? 'signup_with' : 'continue_with'}
          shape="rectangular"
        />
      </motion.div>
    </motion.div>
  )
}
