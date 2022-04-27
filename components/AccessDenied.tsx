import { useTranslation } from 'next-i18next'
import { Typography } from '@ui/Typography'
import { Button } from '@ui/Button'
import { Layout } from 'components/Layout'

export const AccessDenied = () => {
  const { t } = useTranslation(['page-errors'])
  return (
    <Layout title="Acceso denegado">
      <div className="text-center">
        <Typography variant="h2" className="mb-6">
          {t('accessDenied')}
        </Typography>
        <Typography variant="body1" className="mb-6">
          {t('weA reSorryYouCantAccess')}
        </Typography>
        <Button
          color="primary"
          variant="contained"
          href="/api/auth/signin"
          title={t('signIn')}
        >
          {t('signIn')}
        </Button>
      </div>
    </Layout>
  )
}
