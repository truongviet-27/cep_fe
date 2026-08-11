import { dataProvider } from '@providers/data-provider'
import { useApiUrl } from '@refinedev/core'
import { useEffect, useState } from 'react'

interface CmrLinkResponse {
  has_link?: boolean
  api_key_masked?: string | null
  cmr_shop_id?: string | null
  data?: {
    has_link?: boolean
    api_key_masked?: string | null
    cmr_shop_id?: string | null
  }
}

export type CmrLinkStatus = {
  isCmrLinked: boolean
  cmrShopId: string | null
}

function normalizeCmrLinkPayload(payload: CmrLinkResponse | null | undefined) {
  const data =
    payload && typeof payload === 'object' && 'has_link' in payload
      ? payload
      : payload?.data

  const shopId = data?.cmr_shop_id

  return {
    isCmrLinked: Boolean(data?.has_link ?? data?.api_key_masked),
    cmrShopId:
      shopId !== null && shopId !== undefined && String(shopId).trim() !== ''
        ? String(shopId)
        : null,
  }
}

/** Product list only — does not touch order-management code. */
export function useIsCmrLinked(): CmrLinkStatus {
  const apiUrl = useApiUrl()
  const [status, setStatus] = useState<CmrLinkStatus>({
    isCmrLinked: false,
    cmrShopId: null,
  })

  useEffect(() => {
    const fetchCmrLinkStatus = async () => {
      try {
        const response = await dataProvider.custom<CmrLinkResponse>({
          url: `${apiUrl}/oms-api-link`,
          method: 'get',
        })
        setStatus(normalizeCmrLinkPayload(response.data))
      } catch {
        setStatus({ isCmrLinked: false, cmrShopId: null })
      }
    }

    void fetchCmrLinkStatus()
  }, [apiUrl])

  return status
}
