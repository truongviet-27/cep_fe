'use client'

import { PRIMARY } from '@utility/color'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import * as React from 'react'

type H1Props = React.HTMLAttributes<HTMLHeadingElement> & {
  i18n?: string
}

export default function AutoHeading({ i18n, ...props }: H1Props) {
  const t = useTranslations()
  const pathname = usePathname()
  const slug =
    pathname.split('/').filter(Boolean).pop()?.replace(/-/g, '_') ?? ''
  const defaultKey = `${slug}.${slug}`

  return (
    <h1 {...props} className="text-xl font-medium" style={{ color: PRIMARY }}>
      {t(i18n ?? defaultKey)}
    </h1>
  )
}
