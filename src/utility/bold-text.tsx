import { BLACK } from '@utility/color'
import { Typography } from 'antd'

const { Text } = Typography

export default function boldText(text: string, color: string = BLACK) {
  return (
    <Text
      strong
      style={{
        color: color,
      }}
    >
      {text}
    </Text>
  )
}
