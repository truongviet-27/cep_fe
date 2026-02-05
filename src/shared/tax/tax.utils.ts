import type { RoundingMethodEnumType } from '@/sdk/hey-api/types.gen'
import { RoundingMethodEnumType as RoundingMethodEnum } from '@/sdk/hey-api/types.gen'

export const calculateTax = (
  rawTax: number,
  method: RoundingMethodEnumType,
): number => {
  switch (method) {
    case RoundingMethodEnum.ROUND_UP:
      return Math.ceil(rawTax)
    case RoundingMethodEnum.ROUND_DOWN:
      return Math.floor(rawTax)
    case RoundingMethodEnum.ROUND_NEAREST:
      return Math.round(rawTax)
    default:
      return Math.ceil(rawTax) // mac dinh la cell
  }
}
