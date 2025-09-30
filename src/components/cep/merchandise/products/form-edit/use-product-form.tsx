import { useForm } from '@refinedev/antd'
import { useParsed } from '@refinedev/core'
import { type ProductDetail, type StoreProductInput } from '@sdk/hey-api'

export type ProductFormType = {
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
} & StoreProductInput

function useProductForm() {
  const { params } = useParsed()

  const methods = useForm<ProductFormType>({
    resource: 'products',
    id: params?.id,
    redirect: params?.id ? false : 'list',
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
            packagings: packagings.map((packaging) => ({
              ...packaging,
              cost_price: data.cost_price || 0,
            })),
          } as unknown as ProductFormType,
        }
      },
    },
  })

  return [
    {
      methods,
      isLoadingSubmit: methods.saveButtonProps.loading,
      isUpdateMode: !!params?.id,
    },
  ] as const
}

export default useProductForm
