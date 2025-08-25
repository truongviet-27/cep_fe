type SegmentValue = 'none' | 'year_month' | 'year_month_day_range'

export const segmentOptions: { value: SegmentValue; label: string }[] = [
  { value: 'none', label: 'YY' },
  { value: 'year_month', label: 'YYYY/MM' },
  { value: 'year_month_day_range', label: 'YYY/MM/DD' },
]
