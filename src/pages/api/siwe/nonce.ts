import { generateNonce } from 'siwe'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/iron-session/session'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async function serverSideCall(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).send({ error: 'invalid method' })
  } else {
    req.session.nonce = generateNonce()
    await req.session.save()
    res.setHeader('Content-Type', 'text/plain')
    res.send(req.session.nonce)
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
