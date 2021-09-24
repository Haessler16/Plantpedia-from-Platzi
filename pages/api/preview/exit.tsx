import { NextApiHandler } from 'next'

const enablePreview: NextApiHandler = async (_, response) => {
  // Exit the current user from "Preview Mode"
  response.clearPreviewData()

  // Redirect to homepage
  response.redirect(`/`)
  response.end()
}

export default enablePreview
