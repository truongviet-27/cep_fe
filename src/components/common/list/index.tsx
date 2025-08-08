import { List, type ListProps } from '@refinedev/antd'
import React from 'react'

import CommonCard from '@/components/common/card'

type CommonListProps = Omit<ListProps, 'footerButtons'> & {
  title: React.ReactNode
}

export const CommonList: React.FC<CommonListProps> = ({
  children,
  ...rest
}) => {
  return (
    <List {...rest} headerButtons={<></>} breadcrumb={null}>
      <CommonCard>{children}</CommonCard>
    </List>
  )
}
