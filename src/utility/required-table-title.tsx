import { RED } from '@utility/color'
import { type ReactNode } from 'react'

export default function requiredTableTitle(
  text: ReactNode,
  className?: string,
) {
  return (
    <span className={className}>
      {text}
      <span style={{ color: RED }}>&nbsp;*</span>
    </span>
  )
}
