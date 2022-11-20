import { SiweMessage } from 'siwe'
import type { IronSessionOptions } from 'iron-session'

export const sessionOptions: IronSessionOptions = {
  cookieName: 'siwe',
  password: process.env.IRON_SESSION_PASSWORD as string
}

declare module 'iron-session' {
  interface IronSessionData {
    nonce?: string
    siwe?: SiweMessage
  }
}
