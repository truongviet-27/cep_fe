import { useList } from '@refinedev/core'
import type { Category } from '@utility/renderCategories'
import { useState } from 'react'

export const useProductCategorySearchController = () => {
  const [searchText, setSearchText] = useState<string>('')

  const { data: categories } = useList<Category>({
    resource: 'product-categories',
    filters: [
      {
        field: 'name_lk',
        operator: 'eq',
        value: searchText,
      },
    ],
    // queryOptions: {
    //   enabled: !!name_lk_value,
    // },
  })

  return [{ categories, searchText }, { setSearchText }]
}
