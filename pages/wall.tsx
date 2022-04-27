import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { Typography } from '@ui/Typography'
import { Layout } from 'components/Layout'
import { Comment, CommentProps } from 'components/Wall/Comment'
import { Editor } from '@components/Wall/Editor'

import { getSession, useSession } from '@auth/client'
import { AccessDenied } from '@components/AccessDenied'

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession(context)
  const i18n = await serverSideTranslations(context.locale!)

  if (!session) {
    return { redirect: { destination: '/api/auth/signin', permanent: false } }
  }
  return { props: { session, ...i18n } }
}

type Story = Pick<CommentProps, 'name' | 'imageUrl' | 'text'> & { id: string }

const Wall = () => {
  const [session] = useSession()
  const [stories, setStories] = useState<Story[]>([])
  const { t } = useTranslation(['page-wall'])

  if (!session) {
    return <AccessDenied />
  }

  const addStory = (text: string) => {
    const message = text.trim()

    if (message.length < 1) {
      return
    }

    const newStory: Story = {
      id: new Date().getTime().toString(),
      name: session?.user?.name || '',
      imageUrl: session?.user?.image || '',
      text: message,
    }
    setStories((previousValue) => [newStory, ...previousValue])
  }

  return (
    <Layout>
      <div className="text-center pb-6">
        <Typography variant="h2">{t('wall')}</Typography>
        <div className="max-w-5xl mx-auto mb-6 mt-4">
          <Editor onSubmit={addStory} />
        </div>
      </div>
      <section className="">
        {stories.map(({ id, ...storyPros }) => (
          <Comment key={id} {...storyPros} />
        ))}
        <Comment
          className="bg-pink-700"
          text="This man is a knight in shining armor."
        />
        <Comment
          className="bg-indigo-700"
          text="Itaque qusquam doreles voluptates."
        />
        <Comment
          className="bg-purple-700"
          text="You hit me with a cricket. Stop talking to me."
        />
      </section>
    </Layout>
  )
}

export default Wall
