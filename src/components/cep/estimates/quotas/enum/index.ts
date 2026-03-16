/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum QuotaStatus {
  Creating = 'creating',
  WaitingApproval = 'waiting_approval',
  Approved = 'approved',
  Rejected = 'rejected',
  SentToCustomer = 'sent_to_customer',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Total = 'total',
}
/* eslint-enable @typescript-eslint/no-duplicate-enum-values */

export enum TaxRoundingMethod {
  RoundDown = 'round_down',
  RoundUp = 'round_up',
  RoundNearest = 'round_nearest',
}

export const STATUS_DISABLED_WHEN_OFF_APPROVE_ROUTE: string[] = [
  QuotaStatus.Rejected,
  QuotaStatus.WaitingApproval,
]

export enum IssueMethod {
  Manual = 'manual',
  Automatic = 'automatic',
}

export enum PaymentDueDate {
  MONTHLY_25 = 'monthly_25',
  MONTHLY_10 = 'monthly_10',
  NET_30_FROM_DELIVERY = 'net_30_from_delivery',
  NET_30_FROM_INVOICE = 'net_30_from_invoice',
  END_OF_MONTH_NEXT = 'end_of_month_next',
  END_OF_MONTH_AFTER_NEXT = 'end_of_month_after_next',
}

export enum ExpirationDate {
  DAYS_7 = 'days_7',
  DAYS_14 = 'days_14',
  DAYS_30 = 'days_30',
  DAYS_45 = 'days_45',
  DAYS_60 = 'days_60',
  MONTHS_3 = 'months_3',
  MONTHS_6 = 'months_6',
  YEARS_1 = 'years_1',
}

export enum CustomerTerm {
  ShortTerm = 'short_term',
  LongTerm = 'long_term',
}

export const TRANSACTION_TYPES = [
  {
    labelKey: 'quotas.transaction_type.short_term_service',
    value: 'short_term_service',
  },
  {
    labelKey: 'quotas.transaction_type.short_term_merchandise',
    value: 'short_term_merchandise',
  },
  {
    labelKey: 'quotas.transaction_type.long_term_service',
    value: 'long_term_service',
  },
  {
    labelKey: 'quotas.transaction_type.long_term_merchandise',
    value: 'long_term_merchandise',
  },
]
