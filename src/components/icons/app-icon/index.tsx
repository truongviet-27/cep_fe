'use client'

import { PRIMARY } from '@utility/color'
import { Typography } from 'antd'
import React from 'react'

const { Title } = Typography

interface AppIconProps {
  level?: 2 | 5 | 1 | 3 | 4
}

export const AppIcon: React.FC<AppIconProps> = ({ level }) => {
  return (
    <Title style={{ color: PRIMARY, display: 'flex' }} level={level}>
      eeRP
    </Title>
  )
}
