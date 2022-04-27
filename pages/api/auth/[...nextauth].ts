import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import Providers from 'next-auth/providers'

const options: NextAuthOptions = {
  theme: 'light',
  // debug: true,
  session: {
    jwt: true,
    maxAge: 60 * 15, // 15min
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    signingKey: process.env.JWT_SIGNING_KEY,
    encryption: true,
    encryptionKey: process.env.JWT_ENCRYPTION_KEY,
  },
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
