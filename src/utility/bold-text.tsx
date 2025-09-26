import { BLACK } from '@utility/color'
import { Typography } from 'antd'
import { type ReactNode } from 'react'

const { Text } = Typography

export default function boldText(
  text: string | ReactNode,
  color: string = BLACK,
) {
  return (
    <Text
      strong
      style={{
        color: color,
        fontWeight: 900,
      }}
    >
      {text}
    </Text>
  )
}
