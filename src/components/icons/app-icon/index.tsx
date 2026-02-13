'use client'

import { useGo } from '@refinedev/core'
import Image from 'next/image'
import React from 'react'

import EerpLogo from './eerp_logo.svg'

interface AppIconProps {
  level?: 1 | 2 | 3 | 4 | 5
  fullText?: string
  smallText?: string
}

export const AppIcon: React.FC<AppIconProps> = ({ fullText = 'eeRP' }) => {
  const go = useGo()

  return (
    <Image
      src={EerpLogo}
      alt={fullText}
      className="h-auto max-h-[30px] w-auto cursor-pointer"
      priority
      onClick={() => {
        go({
          to: '/',
        })
      }}
    />
  )
}
