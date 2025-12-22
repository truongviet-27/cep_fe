/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CrudFilter } from '@refinedev/core'
import { useList } from '@refinedev/core'
import { SEARCH_TIMEOUT } from '@utility/constant'
import type { Category } from '@utility/renderCategories'
import debounce from 'lodash/debounce'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

export const useController = () => {
  const t = useTranslations()
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

  // Thêm category mặc định "なし" vào đầu danh sách
  const categoriesWithDefault = useMemo(() => {
    const defaultCategory: Category = {
      id: null as any,
      order: 0,
      parent_id: null,
      level: 1,
      name: t('products.fields.default_category'),
      closed: false,
      children: [],
    }

    if (!categories?.data) {
      return {
        ...categories,
        data: [defaultCategory],
      }
    }

    return {
      ...categories,
      data: [defaultCategory, ...categories.data],
    }
  }, [categories])

  const options = useMemo(
    () =>
      categoriesWithDefault?.data.map((item) => ({
        value: item.name,
        label: item.name,
      })),
    [categoriesWithDefault],
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
      categories: categoriesWithDefault,
    },
    { setSearchText, setAllowFetchData },
  ]
}
