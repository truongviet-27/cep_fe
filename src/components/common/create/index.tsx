import { Create, type CreateProps } from '@refinedev/antd'
import React from 'react'

type CommonCreateProps = Omit<CreateProps, 'footerButtons'> & {
  footerButtons: React.ReactNode
  title: React.ReactNode
  isLoading: boolean
}

export const CommonCreate: React.FC<CommonCreateProps> = ({
  footerButtons,
  ...rest
}) => {
  return (
    <Create
      {...rest}
      goBack={null}
      headerButtons={<></>}
      breadcrumb={null}
      footerButtons={footerButtons}
    />
  )
}
