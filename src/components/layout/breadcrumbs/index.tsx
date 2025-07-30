'use client'

import { Breadcrumb } from 'antd'
import type {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from 'antd/es/breadcrumb/Breadcrumb'

interface BreadcrumbProps {
  items: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]
}

export default function Breadcrumbs({ items }: Readonly<BreadcrumbProps>) {
  return (
    <div className="px-6 py-4">
      <Breadcrumb items={items} />
    </div>
  )
}
