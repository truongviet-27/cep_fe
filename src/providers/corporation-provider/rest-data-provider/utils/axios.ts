import type { HttpError } from '@refinedev/core'
import axios from 'axios'

const axiosInstance = axios.create()

axiosInstance.interceptors.request.use(
  (config) => {
    config.params = {
      ...(config.params || {}),
      id: 'Kd4y5Y2BQgn52',
    }

    return config
  },
  (error) => Promise.reject(error),
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
