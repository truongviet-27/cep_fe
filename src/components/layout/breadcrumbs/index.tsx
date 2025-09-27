'use client'

import type { BreadcrumbProps } from 'antd'
import { Breadcrumb } from 'antd'
import React from 'react'

const Breadcrumbs: React.FC<BreadcrumbProps> = (props) => {
  return <Breadcrumb {...props} />
}

export default Breadcrumbs
