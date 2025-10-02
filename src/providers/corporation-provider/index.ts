import { corporationCustomRest } from '@providers/corporation-provider/rest-data-provider'

const API_URL =
  process.env.NEXT_PUBLIC_API_CORPORATION_URL ||
  'https://api.houjin-bangou.nta.go.jp/4'

export const corporationProvider = corporationCustomRest(API_URL)
