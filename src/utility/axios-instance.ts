import axios from 'axios'

export const axiosInstance = axios.create({
  // baseURL: 'localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '19cc7eb2bebf4562b3bf7e2d81e7cbb7',
  },
})

axiosInstance.interceptors.request.use((config) => {
  // const token = Cookies.get(TOKEN_KEY)
  //
  // if (token && config.headers) {
  //   config.headers['Authorization'] = `Bearer ${token}`
  // }
  return config
})
