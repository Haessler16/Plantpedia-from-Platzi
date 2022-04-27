import { NextApiHandler } from 'next'
import random from 'lodash/random'
import { getSession } from 'next-auth/client'

const premium: NextApiHandler = async (req, res) => {
  const seccion = await getSession({ req })

  if (!seccion) {
    res.statusCode = 401
    res.end('Unauthorized')
    return
  }

  res.status(200).json({
    data: 'https://picsum.photos/id/' + random(1, 1000) + '/200/300',
    time: new Date().getTime(),
  })
}

export default premium
