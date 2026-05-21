import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthDivider } from '@/components/auth/auth-divider'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { FormField } from '@/components/auth/form-field'
import { Button } from '@/components/ui/button'
import { authApi } from '@/api/auth'
import { getErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/auth-store'
import { ROUTES } from '@/lib/constants'

const schema = z.object({
  aadharCardNumber: z.string().length(12, 'Aadhar must be 12 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await authApi.login({ aadharCardNumber: data.aadharCardNumber, password: data.password })
      if (res.data.user) {
        setSession(res.data.user, 'user')
      }
      toast.success(res.data.message ?? 'Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to cast your secure vote">
      <GoogleAuthButton mode="login" />
      <AuthDivider />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          id="aadhar"
          label="Aadhar Card Number"
          register={register('aadharCardNumber')}
          error={errors.aadharCardNumber}
          valid={!!touchedFields.aadharCardNumber && !errors.aadharCardNumber}
          shake={shake}
        />
        <FormField
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          register={register('password')}
          error={errors.password}
          valid={!!touchedFields.password && !errors.password}
          shake={shake}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button type="submit" className="w-full" variant="glow" disabled={loading || !isValid}>
            {loading ? <Loader2 className="animate-spin" /> : 'Sign in'}
          </Button>
        </motion.div>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.SIGNUP} className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
        <p className="text-center text-xs text-muted-foreground">
          <Link to={ROUTES.ADMIN_LOGIN} className="hover:text-foreground hover:underline">
            Admin portal →
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
