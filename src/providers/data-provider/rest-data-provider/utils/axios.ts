import { getSessionOnce } from '@lib/get-session-once'
import type { HttpError } from '@refinedev/core'
import useTenantStore from '@stores/useTenantStore'
import { getOrgFromToken } from '@utility/decode-token'
import axios from 'axios'

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001/api/v1'

const bareAxios = axios.create()

const axiosInstance = axios.create()

useTenantStore.subscribe((state) => {
  console.log('Tenant store changed, new tenantId:', state.tenantId)
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
      request.headers['x-tenant-id'] = (tenantId ?? cepId) as string
    } else {
      try {
        const { data } = await bareAxios.get(`${API_URL}/tenants/`, {
          headers: session?.accessToken
            ? { Authorization: `Bearer ${session.accessToken}` }
            : undefined,
        })
        const firstTenant = data?.data?.items?.[0]
        const fallbackId = firstTenant?.id
        if (fallbackId) {
          request.headers = request.headers ?? {}
          request.headers['x-tenant-id'] = fallbackId
          const { setTenant } = useTenantStore.getState()
          const fallbackName = firstTenant?.name || null
          setTenant(fallbackId, fallbackName)
        }
      } catch {
        console.error('Failed to fetch tenants for fallback x-tenant-id')
      }
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
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    }
    return Promise.reject(customError)
  },
)

export { axiosInstance }
