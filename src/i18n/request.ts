'use server'

import { getRequestConfig } from 'next-intl/server'

import { getUserLocale } from '@/i18n'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default getRequestConfig(async () => {
  const locale = await getUserLocale()
  const messages = await import(
    `../../public/locales/${locale}/common.json`
  ).catch(() => import(`../../public/locales/${DEFAULT_LOCALE}/common.json`))

  return {
    locale,
    messages: messages.default,
  }
})
