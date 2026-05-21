import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthDivider } from '@/components/auth/auth-divider'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { FormField } from '@/components/auth/form-field'
import { PasswordStrength } from '@/components/auth/password-strength'
import { Button } from '@/components/ui/button'
import { authApi } from '@/api/auth'
import { getErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/auth-store'
import { ROUTES } from '@/lib/constants'
import { useDebounce } from '@/hooks/use-debounce'

const schema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    age: z.number({ error: 'Age is required' }).min(18, 'Must be 18 or older').max(120),
    email: z.string().email('Email format invalid').optional().or(z.literal('')),
    mobile: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),
    address: z.string().min(5, 'Address is required'),
    aadharCardNumber: z.string().length(12, 'Aadhar must be 12 digits'),
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

function mapServerErrorToField(message: string): keyof FormData | null {
  const lower = message.toLowerCase()
  if (lower.includes('mobile')) return 'mobile'
  if (lower.includes('aadhar')) return 'aadharCardNumber'
  if (lower.includes('email')) return 'email'
  if (lower.includes('password')) return 'password'
  return null
}

export default function SignupPage() {
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
    delayError: 400,
    defaultValues: { age: 18 },
  })

  const password = watch('password', '')
  const debouncedPassword = useDebounce(password, 300)

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { confirmPassword: _, ...payload } = data
      const res = await authApi.signup({
        ...payload,
        email: payload.email || undefined,
      })

      if (res.data.user) {
        setSession(res.data.user, 'user')
      }
      setSuccess(true)
      toast.success(res.data.message ?? 'Account created successfully!')

      setTimeout(() => {
        navigate(ROUTES.DASHBOARD, { replace: true })
      }, 900)
    } catch (err) {
      const message = getErrorMessage(err)
      const field = mapServerErrorToField(message)
      if (field) {
        setError(field, { type: 'server', message })
      }
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout title="You're all set" subtitle="Redirecting to your dashboard">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          >
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          </motion.div>
          <p className="text-sm text-muted-foreground">Account created successfully</p>
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Create account" subtitle="Join VoteSecure and exercise your right to vote">
      <GoogleAuthButton mode="signup" />
      <AuthDivider label="or register with email" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <FormField
          id="name"
          label="Full Name"
          register={register('name')}
          error={errors.name}
          valid={!!touchedFields.name && !errors.name}
        />
        <motion.div layout className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField
            id="age"
            label="Age"
            type="number"
            register={register('age', { valueAsNumber: true })}
            error={errors.age}
            valid={!!touchedFields.age && !errors.age}
          />
          <FormField
            id="mobile"
            label="Mobile"
            register={register('mobile')}
            error={errors.mobile}
            valid={!!touchedFields.mobile && !errors.mobile}
          />
        </motion.div>
        <FormField
          id="email"
          label="Email (optional)"
          type="email"
          register={register('email')}
          error={errors.email}
          valid={!!touchedFields.email && !errors.email}
        />
        <FormField
          id="address"
          label="Address"
          register={register('address')}
          error={errors.address}
          valid={!!touchedFields.address && !errors.address}
        />
        <FormField
          id="aadhar"
          label="Aadhar Number"
          register={register('aadharCardNumber')}
          error={errors.aadharCardNumber}
          valid={!!touchedFields.aadharCardNumber && !errors.aadharCardNumber}
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
        <motion.div whileTap={{ scale: loading ? 1 : 0.98 }}>
          <Button type="submit" className="w-full" variant="glow" disabled={loading || !isValid}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </motion.div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
