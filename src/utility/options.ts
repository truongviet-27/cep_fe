type SegmentValue =
  | 'none'
  | 'year'
  | 'year_range'
  | 'year_month'
  | 'year_month_range'
  | 'year_month_day'
  | 'year_month_day_range'

export const segmentOptions: { value: SegmentValue; label: string }[] = [
  { value: 'none', label: 'なし' },
  { value: 'year', label: '年(YY)' },
  { value: 'year_range', label: '年（YY—）' },
  { value: 'year_month', label: '年月（YYMM)' },
  { value: 'year_month_range', label: '年月—（YYMM—）' },
  { value: 'year_month_day', label: '年月日（YYMMDD）' },
  { value: 'year_month_day_range', label: '年月日—（YYMMDD—）' },
]
