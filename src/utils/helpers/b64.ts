const B64U_LOOKUP: { [key: string]: string } = {
  '/': '_',
  _: '/',
  '+': '-',
  '-': '+',
  '=': '.',
  '.': '='
}

export const encode = (str: string) =>
  btoa(str).replace(/(\+|\/|=)/g, (m: string): string => B64U_LOOKUP[m] || '')

export const decode = (str: string) =>
  atob(str.replace(/(-|_|\.)/g, (m: string): string => B64U_LOOKUP[m] || ''))

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const encodeJson = (json: any) => encode(JSON.stringify(json))
export const decodeJson = (str: string) => JSON.parse(decode(str))
