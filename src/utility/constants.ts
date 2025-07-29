import type { ResourceProps } from '@refinedev/core/src/contexts/resource/types'

export const RESOURCE: ResourceProps[] = [
  {
    name: 'blog-posts',
    list: '/blog-posts',
    create: '/blog-posts/create',
    edit: '/blog-posts/edit/:id',
    show: '/blog-posts/show/:id',
    meta: {
      canDelete: true,
    },
  },
  {
    name: 'categories',
    list: '/categories',
    create: '/categories/create',
    edit: '/categories/edit/:id',
    show: '/categories/show/:id',
    meta: {
      canDelete: true,
    },
  },
]
