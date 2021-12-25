import { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { useServerStyles } from '@ui/ssr'
import { UIProvider } from '@ui/Provider'
import { QueryProviders } from 'api/QueryProviders'
import { Provider as AuthProvider } from 'next-auth/client'

import '../ui/globals.css'

const NextApp = ({ Component, pageProps }: AppProps) => {
  useServerStyles()

  return (
    <AuthProvider session={pageProps.session}>
      <QueryProviders>
        <UIProvider>
          <Component {...pageProps} />
        </UIProvider>
      </QueryProviders>
    </AuthProvider>
  )
}

export default appWithTranslation(NextApp)
