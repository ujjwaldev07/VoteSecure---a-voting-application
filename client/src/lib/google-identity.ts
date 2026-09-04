export interface GoogleCredentialResponse {
  credential?: string
  select_by?: string
}

interface GoogleIdentityApi {
  accounts: {
    id: {
      initialize: (configuration: {
        client_id: string
        callback: (response: GoogleCredentialResponse) => void
        auto_select?: boolean
        cancel_on_tap_outside?: boolean
      }) => void
      renderButton: (parent: HTMLElement, options: Record<string, string | number>) => void
    }
  }
}

declare global {
  interface Window {
    google?: GoogleIdentityApi
  }
}

const scriptUrl = 'https://accounts.google.com/gsi/client'
let scriptPromise: Promise<GoogleIdentityApi> | null = null
let initializedClientId: string | null = null
let credentialHandler: ((response: GoogleCredentialResponse) => void) | null = null

function loadGoogleIdentityScript() {
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts.id) {
      resolve(window.google)
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`)
    const script = existing ?? document.createElement('script')

    const onLoad = () => {
      if (window.google?.accounts.id) {
        resolve(window.google)
      } else {
        reject(new Error('Google Identity Services did not load correctly'))
      }
    }

    script.addEventListener('load', onLoad, { once: true })
    script.addEventListener('error', () => reject(new Error('Google Identity Services failed to load')), {
      once: true,
    })

    if (!existing) {
      script.src = scriptUrl
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  })

  return scriptPromise
}

export async function getGoogleIdentity(
  clientId: string,
  onCredential: (response: GoogleCredentialResponse) => void
) {
  credentialHandler = onCredential
  const google = await loadGoogleIdentityScript()

  if (initializedClientId && initializedClientId !== clientId) {
    throw new Error('Google Identity Services was already initialized with a different client ID')
  }

  if (!initializedClientId) {
    initializedClientId = clientId
    google.accounts.id.initialize({
      client_id: clientId,
      auto_select: false,
      cancel_on_tap_outside: true,
      callback: (response) => credentialHandler?.(response),
    })
  }

  return google
}

export function clearGoogleCredentialHandler(handler: (response: GoogleCredentialResponse) => void) {
  if (credentialHandler === handler) {
    credentialHandler = null
  }
}
