import { SiweMessage } from 'siwe'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/iron-session/session'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async function serverSideCall(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'invalid method' })
  } else {
    try {
      const { message, signature } = req.body
      const siweMessage = new SiweMessage(message)
      const fields = await siweMessage.validate(signature)

      if (fields.nonce !== req.session.nonce)
        return res.status(422).json({ message: 'Invalid nonce.' })

      req.session.siwe = fields
      await req.session.save()
      res.json({ ok: true })
    } catch (e) {
      console.log(e)
      res.json({ ok: false })
    }
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
