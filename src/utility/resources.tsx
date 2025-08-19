import type { ResourceProps } from '@refinedev/core'

export const resource: ResourceProps[] = [
  {
    name: 'estimates',
    list: '/estimates',
  },
  {
    name: 'customers',
    list: '/customers',
  },
  {
    name: 'projects',
    list: '/projects',
    edit: '/projects/edit/:id',
    create: '/projects/create',
    show: '/projects/show/:id',
  },
  {
    name: 'products',
    list: '/products',
  },
  {
    name: 'departments',
    list: '/departments',
  },
  {
    name: 'employees',
    list: '/employees',
  },
  {
    name: 'system-config',
  },
  {
    name: 'permission-settings',
    list: '/permission-settings',
    meta: {
      parent: 'system-config',
    },
  },
  {
    name: 'code-issue-setting',
    list: '/code-issue-setting',
    show: '/code-issue-setting/show/:id',
    edit: '/code-issue-setting/edit/:id',
    meta: {
      parent: 'system-config',
    },
  },
  {
    name: 'product-units',
    list: '/product-units',
    show: '/product-units/:id',
    create: '/product-units/:id',
    edit: '/product-units/:id',
    meta: {
      parent: 'system-config',
      canDelete: true,
    },
  },
]
