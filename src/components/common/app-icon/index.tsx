'use client'

import { Typography } from 'antd'
import React from 'react'

const { Title } = Typography

interface AppIconProps {
  level?: 2 | 5 | 1 | 3 | 4
}

export const AppIcon: React.FC<AppIconProps> = ({ level }) => {
  return (
    <Title style={{ color: '#2D51C2', display: 'flex' }} level={level}>
      eeRP
    </Title>
  )
}
