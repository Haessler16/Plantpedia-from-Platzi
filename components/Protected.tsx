import { useSession } from '@auth/client'
import { AccessDenied } from '@components/AccessDenied'

export const Protected = (props: { children: any }) => {
  const [session, loading] = useSession()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <AccessDenied />
  }
  return <>{props.children}</>
}
