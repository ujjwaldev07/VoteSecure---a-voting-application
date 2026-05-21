import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/auth/auth-layout'
import { FormField } from '@/components/auth/form-field'
import { Button } from '@/components/ui/button'
import { adminApi } from '@/api/admin'
import { getErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/auth-store'
import { ROUTES } from '@/lib/constants'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormData = z.infer<typeof schema>

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.ADMIN

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
      const res = await adminApi.login(data)
      if (res.data.user) {
        setSession(res.data.user, 'admin')
      }
      toast.success(res.data.message ?? 'Admin access granted')
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
    <AuthLayout
      title="Admin portal"
      subtitle="Secure access for election administrators"
      variant="admin"
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex justify-center"
      >
        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg"
          whileHover={{ scale: 1.05, rotate: 3 }}
        >
          <Shield className="h-6 w-6 text-white" />
        </motion.div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          id="email"
          label="Admin Email"
          type="email"
          register={register('email')}
          error={errors.email}
          valid={!!touchedFields.email && !errors.email}
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
            {loading ? <Loader2 className="animate-spin" /> : 'Sign in as admin'}
          </Button>
        </motion.div>
        <p className="text-center text-sm text-muted-foreground">
          Need an admin account?{' '}
          <Link to={ROUTES.ADMIN_SIGNUP} className="text-primary hover:underline">
            Register admin
          </Link>
        </p>
        <p className="text-center text-xs text-muted-foreground">
          <Link to={ROUTES.LOGIN} className="hover:text-foreground hover:underline">
            ← Back to voter sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
