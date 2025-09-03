type SegmentValue = 'none' | 'year' | 'year_month' | 'year_month_day_range'

export const segmentOptions: { value: SegmentValue; label: string }[] = [
  { value: 'none', label: '未設定' },
  { value: 'year', label: '年(YY)' },
  { value: 'year_month', label: '年月(YYMM)' },
  { value: 'year_month_day_range', label: '年月日(YYMMDD)' },
]
