import { ConsumptionTaxEnum } from '@sdk/hey-api'

export const SEARCH_TIMEOUT = 500 // this is the timeout for search debounce

export const CONSUMPTION_TAX: Record<string, { value: string; label: string }> =
  {
    [ConsumptionTaxEnum.EXCLUSIVE]: {
      value: ConsumptionTaxEnum.EXCLUSIVE,
      label: '外税',
    },
    // [ConsumptionTaxEnum.INCLUSIVE]: {
    //   value: ConsumptionTaxEnum.INCLUSIVE,
    //   label: '内税',
    // },
    [ConsumptionTaxEnum.EXTERNAL]: {
      value: ConsumptionTaxEnum.EXTERNAL,
      label: '非課税',
    },
  } as const

export const DEPARTMENT_DEFAULT = '全社'
export const EXPIRATION_DATE: Record<string, { value: string; label: string }> =
  {
    days_7: {
      value: 'days_7',
      label: '7日',
    },
    days_14: {
      value: 'days_14',
      label: '14日',
    },
    days_30: {
      value: 'days_30',
      label: '30日',
    },
    days_45: {
      value: 'days_45',
      label: '45日',
    },
    days_60: {
      value: 'days_60',
      label: '60日',
    },
    months_3: {
      value: 'months_3',
      label: '3月',
    },
    months_6: {
      value: 'months_6',
      label: '6月',
    },
    years_1: {
      value: 'years_1',
      label: '1年',
    },
  }

export const PAYMENT_DUE_DATE: Record<
  string,
  { value: string; label: string }
> = {
  monthly_25: {
    value: 'monthly_25',
    label: '毎月25日',
  },
  monthly_10: {
    value: 'monthly_10',
    label: '毎月10日',
  },
  net_30_from_delivery: {
    value: 'net_30_from_delivery',
    label: '納品日後30日',
  },
  net_30_from_invoice: {
    value: 'net_30_from_invoice',
    label: '請求日後30日',
  },
  end_of_month_next: {
    value: 'end_of_month_next',
    label: '月末締め、翌月末支払い',
  },
  end_of_month_after_next: {
    value: 'end_of_month_after_next',
    label: '月末締め、翌々月末支払い',
  },
}
