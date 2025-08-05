import { Edit, type EditProps } from '@refinedev/antd'
import React from 'react'

type CommonEditProps = Omit<EditProps, 'footerButtons'> & {
  footerButtons: React.ReactNode
  title: React.ReactNode
  isLoading: boolean
}

export const CommonEdit: React.FC<CommonEditProps> = ({
  footerButtons,
  ...rest
}) => {
  return (
    <Edit
      {...rest}
      goBack={null}
      headerButtons={<></>}
      breadcrumb={null}
      footerButtons={footerButtons}
    />
  )
}
