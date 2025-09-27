'use client'

import { PRIMARY } from '@utility/color'
import { Grid, Typography } from 'antd'
import React, { useLayoutEffect } from 'react'

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
  const [text, setText] = React.useState<string>(fullText)

  function countFalse<T extends Record<string, boolean>>(obj: T): number {
    let n = 0
    for (const v of Object.values(obj)) if (!v) n++
    return n
  }

  useLayoutEffect(() => {
    if (countFalse(screens) > 2) {
      setText(smallText)
    } else {
      setText(fullText)
    }
  }, [screens])

  return (
    <Title
      level={level}
      style={{
        color: PRIMARY,
        display: 'flex',
        alignItems: 'center',
        margin: 0,
        marginRight: 30,
      }}
      aria-label={fullText}
      title={fullText}
    >
      {text}
    </Title>
  )
}
