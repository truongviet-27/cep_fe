import type { ProductPackagingInputType } from '@interfaces/products'
import { useForm } from '@refinedev/antd'
import { useList, useParsed } from '@refinedev/core'
import type { ProductDetail, Rank, StoreProductInput } from '@sdk/hey-api'
import { ParameterResourceEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { isNumber } from 'lodash'

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
  image_file_url?: string
  image_file_key?: string
  image_name?: string
} & StoreProductInput

function useProductForm() {
  const { params } = useParsed()
  const parameterSettings = useUserStore((state) => state.parameterSettings)

  const methods = useForm<ProductFormType>({
    resource: 'products',
    id: params?.id,
    redirect: 'show',
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
              const ranks: Record<string, number> = {}
              ;(packaging.rank_prices || []).forEach(({ rank_id, price }) => {
                if (rank_id && isNumber(rank_id) && isNumber(price)) {
                  ranks[`rank_${rank_id}`] = price
                }
              })

              return {
                ...packaging,
                ...ranks,
                cost_price: data.cost_price || 0,
              }
            }),
          } as unknown as ProductFormType,
        }
      },
    },
  })

  const { data: ranks } = useList<Rank>({
    resource: 'ranks',
    queryOptions: {
      enabled: parameterSettings?.get?.(ParameterResourceEnum.RANKS),
    },
  })

  const handleOnSubmit = (values: ProductFormType) => {
    const packagings = (values?.packagings || []).map(
      (packaging: ProductPackagingInputType) => {
        const rank_prices: Array<{
          rank_id: number
          price: number
        }> = []
        ranks?.data?.forEach(({ id }) => {
          if (!id) return

          rank_prices.push({
            rank_id: id,
            price: (packaging?.[`rank_${id}`] ?? 0) as number,
          })
        })

        return {
          ...packaging,
          rank_prices,
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
      ranks,
    },
    { handleOnSubmit },
  ] as const
}

export default useProductForm
