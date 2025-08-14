import { customDataProvider } from '@rest-data-provider'

const API_URL = 'http://localhost:3000/api'

export const dataProvider = customDataProvider(API_URL)
