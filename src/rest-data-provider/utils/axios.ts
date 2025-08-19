import { getSessionOnce } from '@lib/get-session-once'
import type { HttpError } from '@refinedev/core'
import useTenantStore from '@stores/useTenantStore'
import axios from 'axios'
import { signIn } from 'next-auth/react'

const axiosInstance = axios.create()

let signingIn = false
const ensureSignIn = async () => {
  if (!signingIn) {
    signingIn = true
    try {
      await signIn()
    } finally {
      signingIn = false
    }
  }
}

axiosInstance.interceptors.request.use(
  async (request) => {
    const session = await getSessionOnce()
    const { tenantId } = useTenantStore.getState()

    if (session?.error) {
      await ensureSignIn()
      return Promise.reject(new axios.Cancel(session?.error))
    }

    if (session?.accessToken) {
      request.headers = request.headers ?? {}
      request.headers['Authorization'] = `Bearer ${session.accessToken}`
    }
    if (tenantId) {
      request.headers = request.headers ?? {}
      request.headers['tenant-id'] = tenantId
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

    if (error.response?.status === 401) {
      await ensureSignIn()
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
