import type { CodeIssueSettingResponse } from '@sdk/hey-api'

const pad = (n: number, len: number) =>
  String(Math.max(0, n)).padStart(Math.max(1, len), '0')

const Y = (d: Date) => d.getFullYear().toString().slice(2)
const YM = (d: Date) =>
  `${Y(d)}${(d.getMonth() + 1).toString().padStart(2, '0')}`
const YMD = (d: Date) =>
  `${Y(d)}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}`

/**
 * Sinh preview code theo setting.
 * @param setting       CodeIssueSetting
 */
export function buildCodePreviewFromSetting({
  current_serial_number,
  segment,
  updated_at,
  serial_length,
  hash_dash,
  prefix,
}: CodeIssueSettingResponse): string {
  const useDash = !!hash_dash
  const sep = useDash ? '-' : ''
  const pr = (prefix ?? '').trim()
  const today = new Date(updated_at ?? new Date())

  // Tạo phần segment theo type
  let segmentPart = ''
  switch (segment) {
    case 'year': {
      segmentPart = Y(today)
      break
    }
    case 'year_range': {
      segmentPart = `${Y(today)}-`
      break
    }
    case 'year_month': {
      segmentPart = YM(today)
      break
    }
    case 'year_month_range': {
      segmentPart = `${YM(today)}-`
      break
    }
    case 'year_month_day': {
      segmentPart = YMD(today)
      break
    }
    case 'year_month_day_range': {
      segmentPart = `${YMD(today)}-`
      break
    }
    case 'none':
    default:
      segmentPart = ''
  }

  // Số thứ tự kế tiếp
  const digits = serial_length ?? 2
  const serial = pad((current_serial_number ?? 0) + 1, digits)
  const segmentPart_Serial = segmentPart + serial

  // Ghép các phần
  const parts = [pr, segmentPart_Serial].filter(Boolean)

  return useDash ? parts.join(sep) : parts.join('')
}
