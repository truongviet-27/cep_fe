'use server'

import { getRequestConfig } from 'next-intl/server'

import { getUserLocale } from '@/i18n'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default getRequestConfig(async () => {
  const locale = await getUserLocale()
  const loadMessages = async (ns = 'common') => {
    return await import(`../../public/locales/${locale}/${ns}.json`).catch(
      () => import(`../../public/locales/${DEFAULT_LOCALE}/${ns}.json`),
    )
  }

  const [common, product, validation, quota_templates] = await Promise.all([
    loadMessages('common'),
    loadMessages('product'),
    loadMessages('validation'),
    loadMessages('quota-template'),
  ])

  return {
    locale,
    messages: {
      ...common.default,
      products: product.default,
      validation: validation.default,
      quota_templates: quota_templates.default,
    },
  }
})
