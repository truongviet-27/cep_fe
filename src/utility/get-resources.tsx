/* eslint-disable */
import { DashboardOutlined, TeamOutlined } from '@ant-design/icons'
import { ResourceProps } from '@refinedev/core'

export const getResources = (t: any): ResourceProps[] => [
  {
    name: 'dashboard',
    list: '/dashboard',
    meta: {
      label: t('menu.dashboard'),
      icon: <DashboardOutlined />,
    },
  },
  {
    name: 'tenants',
    list: '/tenants',
    meta: {
      label: t('menu.tenants'),
      icon: <TeamOutlined />,
    },
  },
  {
    name: 'projects',
    list: '/projects',
    edit: '/projects/edit/:id',
    create: '/projects/create',
    show: '/projects/show/:id',
  },
]
