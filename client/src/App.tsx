import { AppProviders } from '@/providers/app-providers'
import { AppRoutes } from '@/routes'
import { ErrorBoundary } from '@/components/shared/error-boundary'

export default function App() {
  return (
    <AppProviders>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </AppProviders>
  )
}
