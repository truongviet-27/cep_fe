import type { CrudFilter } from '@refinedev/core'
import { useList } from '@refinedev/core'
import { SEARCH_TIMEOUT } from '@utility/constant'
import type { Category } from '@utility/renderCategories'
import debounce from 'lodash/debounce'
import { useMemo, useState } from 'react'

export const useController = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [isAllowFetchData, setIsAllowFetchData] = useState<boolean>(false)

  const filters = useMemo(
    () =>
      [
        {
          field: 'name_lk',
          operator: 'eq',
          value: searchText,
        },
      ] as CrudFilter[],
    [searchText],
  )

  const {
    data: categories,
    isFetching,
    isLoading,
  } = useList<Category>({
    resource: 'product-categories',
    filters: filters,
    queryOptions: {
      enabled: isAllowFetchData,
    },
  })

  const options = useMemo(
    () =>
      categories?.data.map((item) => ({
        value: item.name,
        label: item.name,
      })),
    [categories],
  )

  const debounceFetcher = useMemo(() => {
    return debounce((value: string) => {
      setSearchText(value)
    }, SEARCH_TIMEOUT)
  }, [])

  const setAllowFetchData = () => {
    setIsAllowFetchData(true)
  }

  return [
    {
      options,
      searchText,
      isLoading: isFetching || isLoading,
      debounceFetcher,
      categories,
    },
    { setSearchText, setAllowFetchData },
  ]
}
