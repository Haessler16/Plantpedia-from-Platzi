import { NextApiHandler } from 'next'

const previewStatus: NextApiHandler = async (request, response) => {
  response.json({
    preview: request.preview ?? false,
    context: request.previewData,
  })
}

export default previewStatus
