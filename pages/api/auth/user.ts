import type { NextApiHandler } from 'next'

const credentialAuth: NextApiHandler<User> = (req, res) => {
  // GET ant not OK

  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  //POST - OK
  // validate credentials

  if (req.body.password === process.env.AUTH_PLATZI_SECRET) {
    const platziUser: User = {
      name: 'Platzi Student',
      email: 'student@gmail.com',
      image: '',
    }

    return res.status(200).json(platziUser)
  }

  res.status(401).end()
}

export default credentialAuth
