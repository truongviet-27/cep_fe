import type { ResourceProps } from '@refinedev/core'

export const resource: ResourceProps[] = [
  {
    name: 'estimates',
  },
  // {
  //   name: 'estimates',
  //   list: '/estimates',
  //   meta: {
  //     parent: 'estimates',
  //   },
  // },
  {
    name: 'quotas',
    list: '/quotas',
    show: '/quotas/show/:id',
    create: '/quotas/create',
    edit: '/quotas/edit/:id',
    clone: '/quotas/clone/:id',
    meta: {
      parent: 'estimates',
      // canDelete: true,
      // canCreate: true,
      // canEdit: true,
    },
  },
  {
    name: 'quota-templates',
    list: '/quota-templates',
    show: '/quota-templates/show/:id',
    create: '/quota-templates/create',
    edit: '/quota-templates/edit/:id',
    meta: {
      parent: 'estimates',
      // canDelete: true,
      // canCreate: true,
      // canEdit: true,
    },
  },
  {
    name: 'agreed-prices',
    list: '/agreed-prices',
    show: '/agreed-prices/quota/:id',
    create: '/agreed-prices/create',
    edit: '/agreed-prices/edit/:id',
    meta: {
      parent: 'estimates',
      // canDelete: true,
      // canCreate: true,
      // canEdit: true,
    },
  },
  {
    name: 'agreed-prices/customer',
    show: '/agreed-prices/customer/:id',
  },
  {
    name: 'business_partner',
  },
  {
    name: 'customers',
    list: '/customers',
    show: '/customers/show/:id',
    create: '/customers/create',
    edit: '/customers/edit/:id',
    meta: {
      parent: 'business_partner',
      canDelete: true,
      canCreate: true,
    },
  },
  {
    name: 'merchandise',
    list: '/merchandise',
  },
  {
    name: 'products',
    list: '/products',
    show: '/products/show/:id',
    create: '/products/create',
    edit: '/products/edit/:id',
    meta: {
      parent: 'merchandise',
      canDelete: true,
      canCreate: true,
      canEdit: true,
    },
  },
  {
    name: 'approve-routes',
    list: '/approve-routes',
    show: '/approve-routes/show/:id',
    create: '/approve-routes/create',
    edit: '/approve-routes/edit/:id',
    meta: {
      parent: 'merchandise',
      canDelete: true,
      canCreate: true,
      canEdit: true,
    },
  },
  {
    name: 'ranks',
    list: '/ranks',
    show: '/ranks/show:id',
    create: '/ranks/create',
    edit: '/ranks/edit:id',
    meta: {
      parent: 'merchandise',
      canDelete: true,
      canCreate: true,
    },
  },
  {
    name: 'price-groups',
    list: '/price-groups',
    meta: {
      parent: 'merchandise',
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
    name: 'tenant-settings',
    list: '/tenant-settings',
    meta: {
      parent: 'system-config',
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
