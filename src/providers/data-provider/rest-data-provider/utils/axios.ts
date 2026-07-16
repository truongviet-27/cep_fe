import { getSessionOnce } from '@lib/get-session-once'
import type { HttpError } from '@refinedev/core'
import useTenantStore from '@stores/useTenantStore'
import { getOrgFromToken } from '@utility/decode-token'
import axios from 'axios'

const axiosInstance = axios.create()

useTenantStore.subscribe((state) => {
  if (state.tenantId) {
    axiosInstance.defaults.headers.common['x-tenant-id'] = state.tenantId
  } else {
    delete axiosInstance.defaults.headers.common['x-tenant-id']
  }
})

axiosInstance.interceptors.request.use(
  async (request) => {
    const session = await getSessionOnce()
    const { tenantId } = useTenantStore.getState()
    const cepId = getOrgFromToken(session?.accessToken)?.id
    if (session?.accessToken) {
      request.headers = request.headers ?? {}
      request.headers['Authorization'] = `Bearer ${session.accessToken}`
    }
    if (tenantId || cepId) {
      request.headers = request.headers ?? {}
      request.headers['x-tenant-id'] = tenantId ?? cepId
    }
    return request
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.message === 'AUTH_EXPIRED') {
      return Promise.reject(error)
    }

    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message || error.message,
      statusCode: error.response?.status,
    }
    return Promise.reject(customError)
  },
)

export { axiosInstance }
