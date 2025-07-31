'use client'

import '@refinedev/antd/dist/reset.css'

import { AntdRegistry } from '@ant-design/nextjs-registry'
import { setUserLocale } from '@i18n'
import { dataProvider } from '@providers/data-provider'
import { useNotificationProvider } from '@refinedev/antd'
import { type I18nProvider, Refine } from '@refinedev/core'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'
import routerProvider from '@refinedev/nextjs-router'
import { getResources } from '@utility/get-resources'
import { SessionProvider, useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import React from 'react'

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
  const { status } = useSession()
  // const to = usePathname()

  const t = useTranslations()

  const resources = getResources(t)

  const i18nProvider: I18nProvider = {
    translate: (
      key: string,
      options?: Record<string, string | number | Date> | undefined,
    ) => t(key, options),
    getLocale: useLocale,
    changeLocale: setUserLocale,
  }

  if (status === 'loading') {
    return <span>loading...</span>
  }

  // const authProvider: AuthProvider = {
  //   login: async () => {
  //     signIn('keycloak', {
  //       callbackUrl: to ? to.toString() : '/',
  //       redirect: true,
  //     })
  //
  //     return {
  //       success: true,
  //     }
  //   },
  //   logout: async () => {
  //     signOut({
  //       redirect: true,
  //       callbackUrl: `/login`,
  //     })
  //
  //     return {
  //       success: true,
  //     }
  //   },
  //   onError: async (error) => {
  //     if (error.response?.status === 401) {
  //       return {
  //         logout: true,
  //       }
  //     }
  //
  //     return {
  //       error,
  //     }
  //   },
  //   check: async () => {
  //     if (status === 'unauthenticated') {
  //       return {
  //         authenticated: false,
  //         redirectTo: `/login`,
  //       }
  //     }
  //
  //     return {
  //       authenticated: true,
  //     }
  //   },
  //   getPermissions: async () => {
  //     return null
  //   },
  //   getIdentity: async () => {
  //     if (data?.user) {
  //       const { user } = data
  //       return {
  //         name: user.name,
  //         avatar: user.image,
  //       }
  //     }
  //
  //     return null
  //   },
  // }

  return (
    <RefineKbarProvider>
      <AntdRegistry>
        <Refine
          i18nProvider={i18nProvider}
          routerProvider={routerProvider}
          dataProvider={dataProvider}
          notificationProvider={useNotificationProvider}
          // authProvider={authProvider}
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
