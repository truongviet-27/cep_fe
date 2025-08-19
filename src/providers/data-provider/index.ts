import { customDataProvider } from '@rest-data-provider'

const API_URL = 'http://localhost:8001/api/v1'

export const dataProvider = customDataProvider(API_URL)
