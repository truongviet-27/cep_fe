import type { CreateClientConfig } from '@sdk/hey-api/client'
import { axiosInstance } from '@utility/axios-instance'

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  ...axiosInstance,
})
