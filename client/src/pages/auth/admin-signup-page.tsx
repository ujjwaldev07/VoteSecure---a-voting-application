import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Shield, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/auth/auth-layout'
import { FormField } from '@/components/auth/form-field'
import { PasswordStrength } from '@/components/auth/password-strength'
import { Button } from '@/components/ui/button'
import { adminApi } from '@/api/admin'
import { getErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/auth-store'
import { ROUTES } from '@/lib/constants'
import { useDebounce } from '@/hooks/use-debounce'

const schema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Min 8 characters')
      .regex(/[A-Z]/, 'Need uppercase')
      .regex(/[0-9]/, 'Need number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function AdminSignupPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, touchedFields, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const password = watch('password', '')
  const debouncedPassword = useDebounce(password, 300)

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { confirmPassword: _, ...payload } = data
      const res = await adminApi.signup(payload)

      if (res.data.user) {
        setSession(res.data.user, 'admin')
      }

      setSuccess(true)
      toast.success(res.data.message ?? 'Admin account created')

      setTimeout(() => {
        navigate(ROUTES.ADMIN, { replace: true })
      }, 900)
    } catch (err) {
      const message = getErrorMessage(err)
      if (message.toLowerCase().includes('email')) {
        setError('email', { type: 'server', message })
      }
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout title="Admin ready" subtitle="Redirecting to admin dashboard" variant="admin">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-8"
        >
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          <p className="text-sm text-muted-foreground">Admin account created successfully</p>
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Create admin account" subtitle="Register as an election administrator" variant="admin">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
          <Shield className="h-6 w-6 text-white" />
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <FormField
          id="name"
          label="Full Name"
          register={register('name')}
          error={errors.name}
          valid={!!touchedFields.name && !errors.name}
        />
        <FormField
          id="email"
          label="Admin Email"
          type="email"
          register={register('email')}
          error={errors.email}
          valid={!!touchedFields.email && !errors.email}
        />
        <FormField
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          register={register('password')}
          error={errors.password}
          valid={!!touchedFields.password && !errors.password}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Toggle password"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <PasswordStrength password={debouncedPassword} />
        <FormField
          id="confirm"
          label="Confirm Password"
          type="password"
          register={register('confirmPassword')}
          error={errors.confirmPassword}
          valid={!!touchedFields.confirmPassword && !errors.confirmPassword}
        />
        <Button type="submit" className="w-full" variant="glow" disabled={loading || !isValid}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating admin...
            </>
          ) : (
            'Create admin account'
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already registered?{' '}
          <Link to={ROUTES.ADMIN_LOGIN} className="text-primary hover:underline">
            Admin sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
