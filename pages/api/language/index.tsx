import { serialize, CookieSerializeOptions } from 'cookie'
import { NextApiHandler, NextApiResponse } from 'next'

const DEFAULT_LOCALE = 'es'

const PREFERRED_LOCAL_COOKIE = 'NEXT_LOCAL'

const language: NextApiHandler = (req, res) => {
  if (req.method === 'GET') {
    const preferedLocale = req.cookies[PREFERRED_LOCAL_COOKIE] || ''

    return res.status(200).json({
      preferedLocale,
      defaultLocale: DEFAULT_LOCALE,
    })
  }

  if (req.method === 'POST') {
    const newPreferredLocal = req.body.preferedLocale as string | undefined
    // For this page, we don't care setting an invalid value.
    // worst case: the value is ignored and Next.js defaults to defaultLocale. Not critical.
    setCookie(res, PREFERRED_LOCAL_COOKIE, newPreferredLocal, {
      // Heads-up: the NEXT_LOCALE must be set to the `/` path
      path: '/',
    })

    res.redirect('/')
    return res.end()
  }

  res.status(405).end()
}

function setCookie(
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) {
  const stringValue =
    typeof value === 'object' ? `j:${JSON.stringify(value)}` : String(value)

  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge!)
    options.maxAge! /= 1000
  }

  res.setHeader('Set-Cookie', serialize(name, String(stringValue), options))
}

export default language
