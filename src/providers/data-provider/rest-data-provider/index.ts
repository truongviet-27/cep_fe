import type { DataProvider } from '@refinedev/core'
import type { AxiosInstance } from 'axios'
import { isArray } from 'lodash'
import { stringify } from 'query-string'

import { axiosInstance, generateFilter, generateSort } from './utils'

type MethodTypes = 'get' | 'delete' | 'head' | 'options'
type MethodTypesWithBody = 'post' | 'put' | 'patch'

export const customDataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance,
): Omit<
  Required<DataProvider>,
  'createMany' | 'updateMany' | 'deleteMany'
> => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${apiUrl}/${resource}`

    const { current = 1, pageSize = 10, mode = 'server' } = pagination ?? {}

    const { headers: headersFromMeta, method } = meta ?? {}
    const requestMethod = (method as MethodTypes) ?? 'get'

    const queryFilters = generateFilter(filters)

    const query: {
      _page?: number
      _per_page?: number
      _sort?: string
      _order?: string
    } = {}

    if (mode === 'server') {
      query._page = current
      query._per_page = pageSize
    }

    const generatedSort = generateSort(sorters)
    if (generatedSort) {
      const { _sort, _order } = generatedSort
      query._sort = _sort.join(',')
      query._order = _order.join(',')
    }

    const combinedQuery = { ...query, ...queryFilters }
    const urlWithQuery = Object.keys(combinedQuery).length
      ? `${url}?${stringify(combinedQuery)}`
      : url

    const { data, headers } = await httpClient[requestMethod](urlWithQuery, {
      headers: headersFromMeta,
    })

    const total = +headers['x-total-count']

    return {
      data: isArray(data?.data) ? data?.data : data?.data?.items || [],
      ...data?.data?.meta,
      total: data?.data?.meta?.total ?? total,
    }
  },

  getMany: async ({ resource, ids, meta }) => {
    const { headers, method } = meta ?? {}
    const requestMethod = (method as MethodTypes) ?? 'get'

    const { data } = await httpClient[requestMethod](
      `${apiUrl}/${resource}?${stringify({ id: ids })}`,
      { headers },
    )

    return {
      data: data?.data,
    }
  },

  create: async ({ resource, variables, meta }) => {
    const url = `${apiUrl}/${resource}`

    const { headers, method } = meta ?? {}
    const requestMethod = (method as MethodTypesWithBody) ?? 'post'

    const { data } = await httpClient[requestMethod](url, variables, {
      headers,
    })

    return {
      data: data?.data,
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    let url = `${apiUrl}/${resource}/${id}`

    if (meta?.action === 'restore') {
      url += '/restore'
    }

    const { headers, method } = meta ?? {}
    const requestMethod = (method as MethodTypesWithBody) ?? 'patch'

    const { data } = await httpClient[requestMethod](url, variables, {
      headers,
    })

    return {
      data: data?.data,
    }
  },

  getOne: async ({ resource, id, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`

    const { headers, method } = meta ?? {}
    const requestMethod = (method as MethodTypes) ?? 'get'

    try {
      const { data } = await httpClient[requestMethod](url, { headers })

      return {
        data: data?.data,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.status === 404) {
        console.log('redirect_to_404')
        if (typeof window !== 'undefined') {
          window.location.href = '/404'
        }
      }
      throw error
    }
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`

    const { headers, method } = meta ?? {}
    const requestMethod = (method as MethodTypesWithBody) ?? 'delete'

    const { data } = await httpClient[requestMethod](url, {
      data: variables,
      headers,
    })

    return {
      data: data?.data,
    }
  },

  getApiUrl: () => {
    return apiUrl
  },

  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
  }) => {
    let requestUrl = `${url}?`

    if (sorters) {
      const generatedSort = generateSort(sorters)
      if (generatedSort) {
        const { _sort, _order } = generatedSort
        const sortQuery = {
          _sort: _sort.join(','),
          _order: _order.join(','),
        }
        requestUrl = `${requestUrl}&${stringify(sortQuery)}`
      }
    }

    if (filters) {
      const filterQuery = generateFilter(filters)
      requestUrl = `${requestUrl}&${stringify(filterQuery)}`
    }

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`
    }

    let axiosResponse
    switch (method) {
      case 'put':
      case 'post':
      case 'patch':
        axiosResponse = await httpClient[method](url, payload, {
          headers,
        })
        break
      case 'delete':
        axiosResponse = await httpClient.delete(url, {
          data: payload,
          headers: headers,
        })
        break
      default:
        axiosResponse = await httpClient.get(requestUrl, {
          headers,
        })
        break
    }

    const { data } = axiosResponse

    return Promise.resolve({ data: data?.data })
  },
})
