import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { Grid } from '@ui/Grid'
import { Typography } from '@ui/Typography'
import { Button } from '@ui/Button'

import { signIn, signOut, useSession } from 'next-auth/client'

export const TopArea = () => {
  return (
    <Grid container justifyContent="space-between">
      <Grid item>
        <LoginLogout />
      </Grid>
      <Grid item>
        <LocalOptions />
      </Grid>
    </Grid>
  )
}

function LoginLogout() {
  const { t } = useTranslation(['common'])
  const [session, loading] = useSession()

  if (loading) {
    return (
      <Typography variant="body2" component="span">
        loading
      </Typography>
    )
  }
  if (session === null) {
    return <Button onClick={() => signIn()}>{t('login')}</Button>
  }

  return (
    <>
      <span>{session?.user?.name}</span>
      <Button onClick={() => signOut()}>{t('logout')}</Button>
    </>
  )
}

function LocalOptions() {
  const { locales, locale } = useRouter()
  const { t } = useTranslation(['common'])

  if (locales === undefined || locale === undefined) {
    return null
  }
  return (
    <>
      <Typography variant="body2" component="span" className="pr-3">
        {t('language')}
      </Typography>
      {locales.map((loc) => {
        return (
          <form
            action="/api/language"
            method="POST"
            key={loc}
            className="inline-block"
          >
            <input name="preferredLocale" value={loc} type="hidden" />
            <Button
              variant={loc === locale ? 'outlined' : 'text'}
              className="ml-1"
              type="submit"
            >
              {loc}
            </Button>
          </form>
        )
      })}
    </>
  )
}
