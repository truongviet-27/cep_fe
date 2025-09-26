/* eslint-disable simple-import-sort/imports */
'use client'

import { setUserLocale } from '@/i18n'
import { dataProvider } from '@/providers/data-provider'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import LoadingPage from '@components/common/loading-page'
import { NProgressProvider } from '@components/common/progress-provider'
import { accessControlProvider } from '@lib/accessControlProvider'
import authProvider from '@providers/keycloak-provider'
import { useNotificationProvider } from '@refinedev/antd'
import '@refinedev/antd/dist/reset.css'
import { type I18nProvider, Refine } from '@refinedev/core'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'
import routerProvider from '@refinedev/nextjs-router'
import { resource } from '@utility/resources'
import { SessionProvider, useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import React from 'react'
import { useBootstrap } from './controller'

type RefineContextProps = {
  defaultMode?: string
}

export const RefineContext = (
  props: React.PropsWithChildren<RefineContextProps>,
) => {
  return (
    <SessionProvider>
      <App {...props} />
    </SessionProvider>
  )
}

const App = (props: React.PropsWithChildren) => {
  const session = useSession()
  const { status } = session
  const t = useTranslations()

  const { isLoading } = useBootstrap()

  if (status === 'loading' || isLoading) {
    return <LoadingPage />
  }

  const i18nProvider: I18nProvider = {
    translate: (
      key: string,
      options?: Record<string, string | number | Date>,
    ) => {
      const i18nKey = key.replace(/-/g, '_')
      return t(i18nKey, options)
    },
    getLocale: useLocale,
    changeLocale: setUserLocale,
  }
  return (
    <RefineKbarProvider>
      <AntdRegistry>
        <NProgressProvider />
        <Refine
          i18nProvider={i18nProvider}
          routerProvider={routerProvider}
          dataProvider={dataProvider}
          notificationProvider={useNotificationProvider}
          authProvider={authProvider}
          resources={resource}
          accessControlProvider={accessControlProvider}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            useNewQueryKeys: true,
            title: { icon: null },
          }}
        >
          {props.children}
          <RefineKbar />
        </Refine>
      </AntdRegistry>
    </RefineKbarProvider>
  )
}
