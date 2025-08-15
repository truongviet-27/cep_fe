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
    name: 'systemConfig',
  },
  {
    name: 'permissionSettings',
    list: '/permission-settings',
    meta: {
      parent: 'systemConfig',
    },
  },
  {
    name: 'numberingAssignmentSettings',
    list: '/numbering-assignment-settings',
    meta: {
      parent: 'systemConfig',
    },
  },
  {
    name: 'productCategorySettings',
    list: '/product-category',
    meta: {
      parent: 'systemConfig',
    },
  },
]
