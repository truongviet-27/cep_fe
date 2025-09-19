import { useForm } from '@refinedev/antd'
import {
  useCreate,
  useGo,
  useShow,
  useTable,
  useTranslate,
} from '@refinedev/core'
import type { Rank, StoreProductInput } from '@sdk/hey-api'

export type ProductFormType = {
  unit: string
  category: string
  name_lk?: string
  category_level_1?: number
  category_level_2?: number
  category_level_3?: number
} & StoreProductInput

function useProductForm() {
  const t = useTranslate()
  const go = useGo()
  const methods = useForm<ProductFormType>({
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
      packagings: [],
      price: [],
    },
  })

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

  const { mutate: onCreateProduct, isPending: isLoadingSubmit } = useCreate({
    resource: 'products',
  })

  const onSubmit = (values: ProductFormType) => {
    onCreateProduct(
      {
        values,
      },
      {
        onSuccess: () => {
          go({ to: '/products' })
        },
      },
    )
  }

  return [
    {
      methods,
      dataRanks: tableQuery?.data?.data ?? [],
      isLoadingSubmit,
    },
    { t, onSubmit },
  ] as const
}

export default useProductForm
