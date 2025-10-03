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

export enum IssueMethod {
  Manual = 'manual',
  Automatic = 'automatic',
}
