'use client'

import { useParsed } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { last } from 'lodash'
import { useTranslations } from 'next-intl'
import * as React from 'react'

export type AutoHeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  i18n?: string
}

export default function AutoHeading({ i18n, ...props }: AutoHeadingProps) {
  const t = useTranslations()

  const { pathname, id } = useParsed()

  const basePath =
    id && pathname?.endsWith(`/${id}`)
      ? pathname.slice(0, pathname.length - `/${id}`.length)
      : pathname

  const slugs = basePath ? basePath.split('/') : []

  const slug = slugs.filter(Boolean).join('.')?.replace(/-/g, '_') ?? ''
  const defaultKey =
    slugs.length <= 2 ? `${slug}.${slug}` : `${slug}.${last(slugs)}`

  return (
    <h1 style={{ color: PRIMARY, fontWeight: 700, fontSize: 16 }} {...props}>
      {t(i18n ?? defaultKey)}
    </h1>
  )
}
