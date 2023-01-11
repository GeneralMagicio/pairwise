import { isJSON } from '@/utils/helpers/json'
import { encodeJson } from '@/utils/helpers/b64'

export const snapShotPlaygroundLink = (
  title: string,
  params: string,
  network: string,
  addresses: Array<string> = [],
  snapshot = ''
) => {
  return `https://snapshot.org/#/playground/${title}?query=${encodeJson({
    params: isJSON(params) ? JSON.parse(params) : {},
    network: network,
    snapshot,
    addresses
  })}`
}
