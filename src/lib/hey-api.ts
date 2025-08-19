import { axiosInstance } from '@rest-data-provider/utils'
import type { CreateClientConfig } from '@sdk/hey-api/client'

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  ...axiosInstance,
})
