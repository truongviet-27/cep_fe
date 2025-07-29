'use client'

import { Breadcrumb } from 'antd'

interface BreadcrumbProps {
  items: { title: string }[]
}

export default function Breadcrumbs({ items }: Readonly<BreadcrumbProps>) {
  return (
    <div className="px-6 py-4">
      <Breadcrumb items={items} className="text-blue-500" />
    </div>
  )
}
