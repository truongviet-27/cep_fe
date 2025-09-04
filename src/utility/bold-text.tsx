import { Typography } from 'antd'

const { Text } = Typography

export default function boldText(text: string) {
  return <Text strong>{text}</Text>
}
