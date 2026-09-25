import { RED } from '@utility/color'
import { Fragment, type ReactNode } from 'react'

export default function requiredLabel(text: ReactNode) {
  return (
    <Fragment>
      {text}
      <span style={{ color: RED }}>&nbsp;*</span>
    </Fragment>
  )
}
