import { corporationCustomRest } from '@providers/corporation-provider/rest-data-provider'

const API_URL =
  process.env.NEXT_PUBLIC_API_CORPORATION_URL || 'http://localhost:8001/api/v1'

export const corporationProvider = corporationCustomRest(API_URL)
