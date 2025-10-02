import { QuotaStatus } from '@components/cep/estimates/quotas/enum'

type QuotaStatusInfo = {
  background: string
  color: string
  text: string
}

function getQuotaStatusStyle(status: QuotaStatus): QuotaStatusInfo {
  switch (status) {
    case QuotaStatus.Creating:
      return { background: '#E2E2E2', color: '#666666', text: '下書き' }

    case QuotaStatus.WaitingApproval:
      return { background: '#FFFFC7', color: '#D2A904', text: '承認待' }

    case QuotaStatus.Approved:
      return { background: '#DAEDFF', color: '#0066CC', text: '承認済' }

    case QuotaStatus.Rejected:
      return { background: '#FFDFBF', color: '#FF8400', text: '差戻' }

    case QuotaStatus.SentToCustomer:
      return { background: '#DAEDFF', color: '#0066CC', text: '送信済' }

    case QuotaStatus.Completed:
      return { background: '#DFFFEB', color: '#22874D', text: '受注' }

    case QuotaStatus.Cancelled:
      return { background: '#FFDFDF', color: '#FF0000', text: '失注' }

    default:
      return { background: '#FFFFFF', color: '#000000', text: '' }
  }
}

export default getQuotaStatusStyle
