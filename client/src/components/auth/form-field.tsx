import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface FormFieldProps {
  id: string
  label: string
  type?: string
  register: UseFormRegisterReturn
  error?: FieldError
  valid?: boolean
  shake?: boolean
  endAdornment?: React.ReactNode
}

export function FormField({
  id,
  label,
  type = 'text',
  register,
  error,
  valid,
  shake,
  endAdornment,
}: FormFieldProps) {
  return (
    <motion.div
      animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="space-y-2"
    >
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          error={!!error}
          className={cn(valid && 'border-emerald-500/50', endAdornment && 'pr-10')}
          {...register}
        />
        {endAdornment && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{endAdornment}</div>
        )}
        <AnimatePresence>
          {(valid || error) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {valid && !error && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              {error && <XCircle className="h-4 w-4 text-destructive" />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0 }}
            className="text-xs text-destructive"
            role="alert"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
