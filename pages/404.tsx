import { Layout } from '@components/Layout'
import { Button } from '@ui/Button'
import { Typography } from '@ui/Typography'

export default function NotFoundPage() {
  return (
    <Layout title="404">
      <div className="text-center">
        <Typography variant="h2" className="mb-6">
          🧭 We are sorry
        </Typography>
        <Typography variant="body1" className="mb-6">
          we could not find what you were looking for
        </Typography>
        <Button
          color="primary"
          variant="contained"
          href="/"
          title="Go back home"
        >
          Go back home
        </Button>
      </div>
    </Layout>
  )
}
