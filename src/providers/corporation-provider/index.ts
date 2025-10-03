import { corporationCustomRest } from '@providers/corporation-provider/rest-data-provider'

const API_URL = 'http://localhost:3000'

export const corporationProvider = corporationCustomRest(API_URL)
