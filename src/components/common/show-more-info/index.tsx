import { Typography } from 'antd'
import React from 'react'

const { Text } = Typography

type MoreInfoType = {
  descriptions: {
    title: React.ReactNode
    value: React.ReactNode
  }[]
}

function ShowMoreInfo(props: MoreInfoType) {
  const { descriptions } = props

  return (
    <div className="flex w-full flex-col items-start justify-start self-start">
      {descriptions.map(({ title, value }, index) => (
        <div key={index}>
          <Text type="secondary">
            {title}: {value}
          </Text>
        </div>
      ))}
    </div>
  )
}

export default ShowMoreInfo
