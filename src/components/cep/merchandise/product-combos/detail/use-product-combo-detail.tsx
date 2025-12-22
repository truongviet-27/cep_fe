import { useShow } from '@refinedev/core'
import type { ProductDetail } from '@sdk/hey-api'
import { useParams } from 'next/navigation'

export interface ComboProductComponent {
  product_id: number
  code: string
  name: string
  unit: string
  quantity: number
  // ... thêm các trường khác nếu cần
}

// Mở rộng ProductDetail để bao gồm mảng products đã được xử lý
export interface ProductComboDetail extends ProductDetail {
  products: ComboProductComponent[] // Đây là trường bạn muốn thêm
}

function useProductComboDetail() {
  const { code } = useParams<{ code: string }>()

  const { query: comboResponse } = useShow<ProductComboDetail>({
    resource: 'product-combos',
    id: Number(code),
    queryOptions: {
      enabled: !!code,
    },
  })

  return {
    product: comboResponse.data?.data,
    isLoading: comboResponse.isLoading,
  } as const
}

export default useProductComboDetail
