import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import React, { Suspense } from 'react'

import { RefineContext } from './_refine_context'

export const metadata: Metadata = {
  title: 'eeERP',
  description: 'eeERP',
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang="en" translate="no">
      <body>
        <Suspense>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <RefineContext>{children}</RefineContext>
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  )
}
