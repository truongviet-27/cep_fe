'use client'

import React from 'react'
import { type AuthProvider, Refine } from '@refinedev/core'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useNotificationProvider } from '@refinedev/antd'

import routerProvider from '@refinedev/nextjs-router'

import { dataProvider } from '@providers/data-provider'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import '@refinedev/antd/dist/reset.css'
import { AppIcon } from '@components/app-icon'
import { RESOURCE } from '@utility/constants'

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
  const { data, status } = useSession()
  const to = usePathname()

  if (status === 'loading') {
    return <span>loading...</span>
  }

  const authProvider: AuthProvider = {
    login: async () => {
      signIn('keycloak', {
        callbackUrl: to ? to.toString() : '/',
        redirect: true,
      })

      return {
        success: true,
      }
    },
    logout: async () => {
      signOut({
        redirect: true,
        callbackUrl: '/login',
      })

      return {
        success: true,
      }
    },
    onError: async (error) => {
      if (error.response?.status === 401) {
        return {
          logout: true,
        }
      }

      return {
        error,
      }
    },
    check: async () => {
      if (status === 'unauthenticated') {
        return {
          authenticated: false,
          redirectTo: '/login',
        }
      }

      return {
        authenticated: true,
      }
    },
    getPermissions: async () => {
      return null
    },
    getIdentity: async () => {
      if (data?.user) {
        const { user } = data
        return {
          name: user.name,
          avatar: user.image,
        }
      }

      return null
    },
  }

  return (
    <RefineKbarProvider>
      <AntdRegistry>
        <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider}
          notificationProvider={useNotificationProvider}
          authProvider={authProvider}
          resources={RESOURCE}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            useNewQueryKeys: true,
            title: { text: 'CEP', icon: <AppIcon /> },
          }}
        >
          {props.children}
          <RefineKbar />
        </Refine>
      </AntdRegistry>
    </RefineKbarProvider>
  )
}
