'use client'

import '@refinedev/antd/dist/reset.css'

import { AntdRegistry } from '@ant-design/nextjs-registry'
import LoadingPage from '@components/common/loading-page'
import keyCloakProvider from '@providers/keycloak-provider'
import { useNotificationProvider } from '@refinedev/antd'
import { type I18nProvider, Refine } from '@refinedev/core'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'
import routerProvider from '@refinedev/nextjs-router'
import { usePathname } from 'next/navigation'
import { SessionProvider, useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import React from 'react'

import { setUserLocale } from '@/i18n'
import { dataProvider } from '@/providers/data-provider'
import { getResources } from '@/utility/get-resources'

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
  const to = usePathname()
  const t = useTranslations()

  if (status === 'loading') {
    return <LoadingPage />
  }

  const resources = getResources(t)

  const i18nProvider: I18nProvider = {
    translate: (
      key: string,
      options?: Record<string, string | number | Date> | undefined,
    ) => t(key, options),
    getLocale: useLocale,
    changeLocale: setUserLocale,
  }

  const authProvider = keyCloakProvider({ session, to })

  return (
    <RefineKbarProvider>
      <AntdRegistry>
        <Refine
          i18nProvider={i18nProvider}
          routerProvider={routerProvider}
          dataProvider={dataProvider}
          notificationProvider={useNotificationProvider}
          authProvider={authProvider}
          resources={resources}
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
