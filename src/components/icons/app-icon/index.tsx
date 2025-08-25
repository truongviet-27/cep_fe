'use client'

import { PRIMARY } from '@utility/color'
import { Grid, Typography } from 'antd'
import React from 'react'

const { Title } = Typography
const { useBreakpoint } = Grid

interface AppIconProps {
  level?: 1 | 2 | 3 | 4 | 5
  fullText?: string
  smallText?: string
}

export const AppIcon: React.FC<AppIconProps> = ({
  level = 5,
  fullText = 'eeRP',
  smallText = 'e',
}) => {
  const screens = useBreakpoint()
  const text = screens.xs ? smallText : fullText

  return (
    <Title
      level={level}
      style={{
        color: PRIMARY,
        display: 'flex',
        alignItems: 'center',
        margin: 0,
      }}
      aria-label={fullText}
      title={fullText}
    >
      {text}
    </Title>
  )
}
