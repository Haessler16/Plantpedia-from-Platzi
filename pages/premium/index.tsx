import { Layout } from 'components/Layout'
import { GetServerSideProps } from 'next'
import { useSession, getSession } from 'next-auth/client'

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession(context)

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
    props: { session },
  }
}

const Premium = () => {
  const [session, loading] = useSession()

  if (loading) {
    return <h2>Loading...</h2>
  }

  if (!session) {
    // not logged
    return <Layout>Acceso Denegado</Layout>
  }

  // loggead
  return <Layout>Contenido Secretisimo</Layout>
}

export default Premium
