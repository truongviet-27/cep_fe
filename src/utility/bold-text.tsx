import { BLACK } from '@utility/color'
import { Typography } from 'antd'
import { type ReactNode } from 'react'

const { Text } = Typography

export default function boldText(
  text: string | ReactNode,
  color: string = BLACK,
  fontSize: number = 14,
) {
  return (
    <Text
      strong
      style={{
        color: color,
        fontWeight: 900,
        fontSize,
      }}
    >
      {text}
    </Text>
  )
}
