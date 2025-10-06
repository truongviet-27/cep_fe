import {
  ExpirationDate,
  PaymentDueDate,
  QuotaStatus,
} from '@components/cep/estimates/quotas/enum'
import dayjs from 'dayjs'

type QuotaStatusInfo = {
  background: string
  color: string
  text: string
}

export function getQuotaStatusStyle(status: QuotaStatus): QuotaStatusInfo {
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

export function getPaymentDueDateLabel(
  value: PaymentDueDate,
  t: (key: string) => string,
): string {
  switch (value) {
    case PaymentDueDate.MONTHLY_25:
      return t('tenant_settings.paymentDueDate.options.monthly_25th')
    case PaymentDueDate.MONTHLY_10:
      return t('tenant_settings.paymentDueDate.options.monthly_10th')
    case PaymentDueDate.NET_30_FROM_DELIVERY:
      return t('tenant_settings.paymentDueDate.options.30_days_after_delivery')
    case PaymentDueDate.NET_30_FROM_INVOICE:
      return t('tenant_settings.paymentDueDate.options.30_days_after_invoice')
    case PaymentDueDate.END_OF_MONTH_NEXT:
      return t('tenant_settings.paymentDueDate.options.eom_next_eom')
    case PaymentDueDate.END_OF_MONTH_AFTER_NEXT:
      return t('tenant_settings.paymentDueDate.options.eom_next_next_eom')
    default:
      return value
  }
}

export function getExpirationDate(
  value: ExpirationDate,
  t: (key: string) => string,
): string {
  switch (value) {
    case ExpirationDate.DAYS_7:
      return t('tenant_settings.validityPeriod.options.days_7')
    case ExpirationDate.DAYS_14:
      return t('tenant_settings.validityPeriod.options.days_14')
    case ExpirationDate.DAYS_30:
      return t('tenant_settings.validityPeriod.options.days_30')
    case ExpirationDate.DAYS_45:
      return t('tenant_settings.validityPeriod.options.days_45')
    case ExpirationDate.DAYS_60:
      return t('tenant_settings.validityPeriod.options.days_60')
    case ExpirationDate.MONTHS_3:
      return t('tenant_settings.validityPeriod.options.months_3')
    case ExpirationDate.MONTHS_6:
      return t('tenant_settings.validityPeriod.options.months_6')
    case ExpirationDate.YEARS_1:
      return t('tenant_settings.validityPeriod.options.year_1')
    default:
      return value // fallback
  }
}

export function getExpiryDate(
  value: string,
  baseDate?: string | Date | null,
): Date {
  const start = dayjs(baseDate ?? new Date())

  if (!value) return start.toDate()

  const [unit, amountStr] = value.split('_')
  const amount = parseInt(amountStr, 10)

  if (isNaN(amount)) return start.toDate()

  switch (unit) {
    case 'days':
      return start.add(amount, 'day').toDate()
    case 'months':
      return start.add(amount, 'month').toDate()
    case 'years':
      return start.add(amount, 'year').toDate()
    default:
      return start.toDate()
  }
}

export const getActionPermissions = (
  status: QuotaStatus,
  isAuthor: boolean,
  isApprover: boolean,
) => {
  let permissions = true

  switch (status) {
    case QuotaStatus.Creating:
    case QuotaStatus.Approved:
    case QuotaStatus.Rejected:
      if (isAuthor) {
        permissions = false
      }
      break

    case QuotaStatus.WaitingApproval:
    case QuotaStatus.Completed:
    case QuotaStatus.Cancelled:
      if (isApprover) {
        permissions = false
      }
      break

    case QuotaStatus.SentToCustomer:
      if (isAuthor || isApprover) {
        permissions = false
      }
      break

    default:
      break
  }

  return permissions
}
