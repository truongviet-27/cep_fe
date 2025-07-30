'use client'

import type { BreadcrumbProps } from 'antd'
import { Breadcrumb } from 'antd'
import React from 'react'

const Breadcrumbs: React.FC<BreadcrumbProps> = (props) => {
  return (
    <div className="px-6 py-2 pl-10">
      <Breadcrumb {...props} />
    </div>
  )
}

export default Breadcrumbs
