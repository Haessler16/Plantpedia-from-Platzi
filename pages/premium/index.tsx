import { GetServerSideProps } from 'next'
import { useSession, getSession } from 'next-auth/client'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { Typography } from '@ui/Typography'
import { Button } from '@ui/Button'
import { Layout } from 'components/Layout'
import { AccessDenied } from 'components/AccessDenied'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession(context)
  const i18n = await serverSideTranslations(context.locale!)

  if (session == null) {
    //redirect
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }
  // validor session
  return {
    props: { session, ...i18n },
  }
}

const Premium = () => {
  const [session, loading] = useSession()
  const [imageUrl, setImageUrl] = useState<string | null>()
  const [refetchCounter, setRefech] = useState(0)
  const { t } = useTranslation(['page-premium'])

  useEffect(() => {
    fetch('/api/premium')
      .then((res) => res.json())
      .then(({ data }) => setImageUrl(data))
  }, [refetchCounter])

  if (loading) {
    return <h2>Loading...</h2>
  }

  if (!session) {
    // not logged
    return <AccessDenied />
  }

  // logged
  return (
    <Layout title="Premium content">
      <div className="text-center">
        <Typography variant="h2">
          {t('welcome', { name: session.user?.name })}
        </Typography>
        <Typography variant="body2" className="nt-1">
          {t('hereIsYourPremiumContent')}
        </Typography>
        <div className="max-w-lg mx-auto text-center my-8">
          {imageUrl && (
            <img
              key={imageUrl}
              src={imageUrl}
              alt="Premium content"
              className="rounded"
            />
          )}
        </div>
        <Button variant="outlined" onClick={() => setRefech((c) => c++)}>
          {t('more')}
        </Button>
      </div>
    </Layout>
  )
}

export default Premium
