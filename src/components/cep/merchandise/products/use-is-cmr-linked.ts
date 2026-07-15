import { dataProvider } from '@providers/data-provider'
import { useApiUrl } from '@refinedev/core'
import { useEffect, useState } from 'react'

interface CmrLinkResponse {
  has_link?: boolean
  api_key_masked?: string | null
}

/** Product list only — does not touch order-management code. */
export function useIsCmrLinked(): boolean {
  const apiUrl = useApiUrl()
  const [isCmrLinked, setIsCmrLinked] = useState(false)

  useEffect(() => {
    const fetchCmrLinkStatus = async () => {
      try {
        const response = await dataProvider.custom<CmrLinkResponse>({
          url: `${apiUrl}/oms-api-link`,
          method: 'get',
        })
        const payload = response.data
        setIsCmrLinked(Boolean(payload?.has_link ?? payload?.api_key_masked))
      } catch {
        setIsCmrLinked(false)
      }
    }

    void fetchCmrLinkStatus()
  }, [apiUrl])

  return isCmrLinked
}
