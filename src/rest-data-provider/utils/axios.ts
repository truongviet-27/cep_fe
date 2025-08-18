import type { HttpError } from '@refinedev/core'
import useTenantStore from '@stores/useTenantStore'
import axios from 'axios'
import { getSession } from 'next-auth/react'

const axiosInstance = axios.create()

axiosInstance.interceptors.request.use(
  async (request) => {
    const session = await getSession()
    const { tenantId } = useTenantStore.getState()

    const accessToken = session?.accessToken
    if (accessToken) {
      request.headers['Authorization'] = `Bearer ${accessToken}`
      request.headers['tenant-id'] = tenantId
    }
    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    }

    return Promise.reject(customError)
  },
)

export { axiosInstance }
