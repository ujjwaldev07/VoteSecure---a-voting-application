import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { PageTransition } from '@/components/shared/page-transition'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useProfile } from '@/hooks/use-profile'
import { authApi } from '@/api/auth'
import { getErrorMessage } from '@/api/client'
import { getInitials } from '@/lib/utils'

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type PasswordForm = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const { data: user, isLoading, isError, error, refetch, isFetching } = useProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (data: PasswordForm) => {
    try {
      await authApi.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success('Password updated successfully')
      reset()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !user) {
    return (
      <PageTransition>
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
          <div>
            <h1 className="text-xl font-semibold">Unable to load your profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isError ? getErrorMessage(error) : 'Your profile is not available right now.'}
            </p>
          </div>
          <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>
            {isFetching ? <Loader2 className="animate-spin" /> : 'Try again'}
          </Button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">{getInitials(user?.name ?? 'U')}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <Badge variant="secondary" className="mt-1 capitalize">
                  {user?.role}
                </Badge>
                {user?.isVoted && (
                  <Badge variant="success" className="ml-2">
                    Voted
                  </Badge>
                )}
              </div>
            </div>
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <dt className="text-muted-foreground">Mobile</dt>
                <dd className="font-medium">{user?.mobile || '—'}</dd>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{user?.email || '—'}</dd>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <dt className="text-muted-foreground">Aadhar</dt>
                <dd className="font-mono font-medium">
                  {user?.aadharLast4 ? `****${user.aadharLast4}` : '—'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Address</dt>
                <dd className="max-w-[200px] text-right font-medium">{user?.address || '—'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" {...register('currentPassword')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" {...register('newPassword')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input id="confirm" type="password" {...register('confirmPassword')} />
              </div>
              <Button type="submit" variant="glow" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Update password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
