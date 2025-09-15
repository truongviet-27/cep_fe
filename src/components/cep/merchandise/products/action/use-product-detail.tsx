import { useDebounce } from '@hook/use-debounce'
import { useForm } from '@refinedev/antd'
import { useList, useShow, useTable, useTranslate } from '@refinedev/core'
import type { Rank } from '@sdk/hey-api'
import type { Category } from '@utility/renderCategories'
import { useCallback, useState } from 'react'

export type FormType = {
  code: string
  name: string
  short_name: string
  barcode: string
  category: string
  unit: string
  costPrice: number
  sellingPrice: number
  note: string
  info: Info[]
  price: []

  // add field new
  name_lk?: string
  category_level_1?: number
  category_level_2?: number
  category_level_3?: number
}
type Info = {
  packageCode: string
  packageName: string
  status: string
  quantity: number
  unit: string
  standardPrice: number | null
  salesPrice: number | null
  standardPrint: boolean
}
function useProductDetail() {
  const t = useTranslate()
  const methods = useForm({
    defaultFormValues: {
      code: '',
      name: '',
      short_name: '',
      barcode: '',
      category: '',
      unit: '',
      costPrice: '',
      sellingPrice: '',
      note: '',
      info: [],
      price: [],
    },
  })

  const { form } = methods

  const { getFieldValue, setFieldValue } = form

  const [isAppend, setIsAppend] = useState(false)

  const {} = useShow({
    resource: 'products',
    id: 1,
    queryOptions: {
      enabled: false,
    },
  })

  const { tableQuery } = useTable<Rank>({
    resource: 'ranks',
  })

  console.log(tableQuery.data?.data, 'dataRanks')
  const name_lk_value = useDebounce(getFieldValue('name_lk'), 500)

  const { data: dataProductCategories } = useList<Category>({
    resource: 'product-categories',
    filters: [
      {
        field: 'name_lk',
        operator: 'eq',
        value: name_lk_value,
      },
    ],
    queryOptions: {
      enabled: !!name_lk_value,
    },
  })

  const handleChooseCategory = useCallback(
    (level: number, currentPath: string[], currentCat: Category[]) => {
      const fullPath = currentPath.join(' > ')
      setFieldValue('category', fullPath)
      if (level == 1) {
        setFieldValue('category_level_1', currentCat[0].id)
        setFieldValue('category_level_2', undefined)
        setFieldValue('category_level_3', undefined)
      } else if (level === 2) {
        setFieldValue('category_level_1', currentCat[0].id)
        setFieldValue('category_level_2', currentCat[1].id)
        setFieldValue('category_level_3', undefined)
      } else {
        setFieldValue('category_level_1', currentCat[0].id)
        setFieldValue('category_level_2', currentCat[1].id)
        setFieldValue('category_level_3', currentCat[2].id)
      }
    },
    [dataProductCategories],
  )

  const onSubmit = () => {
    console.log('xxxxxxxxxxxxxxx')
  }

  return [
    {
      methods,
      isAppend,
      dataProductCategories,
      dataRanks: tableQuery?.data?.data ?? [],
    },
    { t, onSubmit, setIsAppend, handleChooseCategory },
  ] as const
}

export default useProductDetail
