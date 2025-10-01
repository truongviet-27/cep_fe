import { customDataProvider } from '@providers/data-provider/rest-data-provider'

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001/api/v1'

export const dataProvider = customDataProvider(API_URL)
