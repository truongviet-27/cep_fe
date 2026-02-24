import type { ProductPackagingInputType } from '@interfaces/products'
import { useForm } from '@refinedev/antd'
import { useGo, useParsed } from '@refinedev/core'
import type { ProductDetail, StoreProductInput } from '@sdk/hey-api'

export type ProductComboFormType = {
  unit: string
  category: string
  name_lk?: string
  category_level_1?: number
  category_level_2?: number
  category_level_3?: number
  author?: {
    id?: number
    name?: string
  }
  editor?: {
    id?: number
    name?: string
  }
  created_at?: string
  updated_at?: string
  products?: [
    {
      id: string
      code: string
      name: string
      unit_name: string
      quantity: number
      cost_price: number
      selling_price: number
    },
  ]
  image_file_url?: string
  image_file_key?: string
  image_name?: string
} & StoreProductInput

function useProductComboForm() {
  const { params } = useParsed()
  const go = useGo()

  const methods = useForm<ProductComboFormType>({
    resource: 'product-combos',
    id: params?.id,
    redirect: false,
    mutationMode: 'pessimistic',
    onMutationSuccess: () => {
      if (params?.id) {
        go({
          to: { resource: 'product-combos', action: 'show', id: params.id },
        })
      } else {
        go({ to: '/products?tab=combo' })
      }
    },
    queryOptions: {
      select: (response) => {
        const data = response.data as unknown as ProductDetail
        const packagings = data?.packagings || []

        return {
          data: {
            ...data,
            category: data?.category?.category_path,
            category_id: data?.category?.id,
            unit: data?.unit?.name,
            unit_id: data?.unit?.id,
            packagings: packagings.map((packaging) => {
              return {
                ...packaging,
                cost_price: data.cost_price || 0,
              }
            }),
          } as unknown as ProductComboFormType,
        }
      },
    },
  })

  const handleOnSubmit = (values: ProductComboFormType) => {
    const packagings = (values?.packagings || []).map(
      (packaging: ProductPackagingInputType) => {
        return {
          ...packaging,
        }
      },
    )

    const valuesConverted = {
      ...values,
      packagings,
    }

    methods.onFinish(valuesConverted)
  }

  return [
    {
      methods,
      isLoadingSubmit: methods.saveButtonProps.loading,
      isUpdateMode: !!params?.id,
    },
    { handleOnSubmit },
  ] as const
}

export default useProductComboForm
