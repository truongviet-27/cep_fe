import { useShow } from '@refinedev/core'
import type { ProductDetail } from '@sdk/hey-api'
import { useParams } from 'next/navigation'

function useProductDetail() {
  const { code } = useParams<{ code: string }>()

  const { query: productResponse } = useShow<ProductDetail>({
    resource: 'products',
    id: Number(code),
    queryOptions: {
      enabled: !!code,
    },
  })

  return {
    product: productResponse.data?.data,
    isLoading: productResponse.isLoading,
  } as const
}

export default useProductDetail
