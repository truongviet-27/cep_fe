import type { ResourceProps } from '@refinedev/core'

export const resource: ResourceProps[] = [
  {
    name: 'estimates',
    list: '/estimates',
  },
  {
    name: 'estimates',
    list: '/estimates',
    show: '/estimates/:id',
    create: '/estimates/:id',
    edit: '/estimates/:id',
    meta: {
      parent: 'estimates',
      canDelete: true,
      canCreate: true,
    },
  },

  {
    name: 'approve',
    list: '/estimates/approve',
    show: '/estimates/approve/:id',
    create: '/estimates/approve/:id',
    edit: '/estimates/approve/:id',
    meta: {
      parent: 'estimates',
      canDelete: true,
      canCreate: true,
    },
  },
  {
    name: 'customers',
    list: '/customers',
  },
  {
    name: 'customers',
    list: '/customers',
    show: '/customers/:id',
    create: '/customers/:id',
    edit: '/customers/:id',
    meta: {
      parent: 'customers',
      canDelete: true,
      canCreate: true,
    },
  },
  // {
  //   name: 'projects',
  //   list: '/projects',
  //   edit: '/projects/edit/:id',
  //   create: '/projects/create',
  //   show: '/projects/show/:id',
  // },
  {
    name: 'products',
    list: '/products',
  },
  {
    name: 'products',
    list: '/products',
    show: '/products/:code',
    create: '/products/create',
    edit: '/products/:code',
    meta: {
      parent: 'products',
      canDelete: true,
      canCreate: true,
    },
  },
  {
    name: 'departments',
    list: '/departments',
    show: '/departments/show/:id',
    create: '/departments/create',
    edit: '/departments/edit/:id',
    meta: {
      canDelete: true,
      canCreate: true,
      canEdit: true,
    },
  },
  {
    name: 'employees',
    list: '/employees',
    edit: '/employees/edit/:id',
    create: '/employees/create',
    show: '/employees/show/:id',
    meta: {
      canDelete: true,
      canCreate: true,
      canEdit: true,
    },
  },
  {
    name: 'import-history',
    list: '/import-history',
  },
  {
    name: 'system-config',
  },
  {
    name: 'parameter-settings',
    list: '/parameter-settings',
    meta: {
      parent: 'system-config',
    },
  },
  {
    name: 'permission-settings',
    list: '/permission-settings',
    meta: {
      parent: 'system-config',
    },
  },
  {
    name: 'code-issue-settings',
    list: '/code-issue-settings',
    show: '/code-issue-settings/show/:id',
    edit: '/code-issue-settings/edit/:id',
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
      canCreate: true,
    },
  },
  {
    name: 'product-categories',
    list: '/product-categories',
    show: '/product-categories/:id',
    create: '/product-categories/:id',
    edit: '/product-categories/:id',
    meta: {
      parent: 'system-config',
      canDelete: true,
      canCreate: true,
    },
  },
  {
    name: 'tags',
    list: '/tags',
    show: '/tags/:id',
    create: '/tags/:id',
    edit: '/tags/:id',
    meta: {
      parent: 'system-config',
      canDelete: true,
      canCreate: true,
    },
  },
  {
    name: 'mail-templates',
    list: '/mail-templates',
    meta: {
      parent: 'system-config',
    },
  },
]
