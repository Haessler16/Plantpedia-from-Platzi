import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import { Provider } from 'next-auth/client'

const options: NextAuthOptions = {
  theme: 'light',
  debug: true,
  session: {},
  jwt: {},
  providers: [
    Providers.Credentials({
      name: 'platzi',
      credentials: {
        password: {
          type: 'password',
          label: 'Nunca pares de...',
        },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })

        const user = await res.json()

        if (res.ok && user) {
          return user
        }

        return null
      },
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
}

export default NextAuth(options)
