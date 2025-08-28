'use client'

import { PRIMARY } from '@utility/color'
import { last } from 'lodash'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import * as React from 'react'

type H1Props = React.HTMLAttributes<HTMLHeadingElement> & {
  i18n?: string
}

export default function AutoHeading({ i18n, ...props }: H1Props) {
  const t = useTranslations()
  const pathname = usePathname()

  const slugs = pathname.split('/')

  const slug = slugs.filter(Boolean).join('.')?.replace(/-/g, '_') ?? ''
  const defaultKey =
    slugs.length <= 2 ? `${slug}.${slug}` : `${slug}.${last(slugs)}`

  return (
    <h1 {...props} className="text-xl font-medium" style={{ color: PRIMARY }}>
      {t(i18n ?? defaultKey)}
    </h1>
  )
}
