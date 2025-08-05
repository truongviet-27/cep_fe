import { Show, type ShowProps } from '@refinedev/antd'
import type { ActionButtonRenderer } from '@refinedev/ui-types/dist/types/crud'
import React from 'react'

type CommonShowProps = Omit<ShowProps, 'footerButtons'> & {
  footerButtons: ActionButtonRenderer
  title: React.ReactNode
  isLoading: boolean
}

export const CommonShow: React.FC<CommonShowProps> = ({
  footerButtons,
  ...rest
}) => {
  return (
    <Show
      {...rest}
      goBack={null}
      headerButtons={<></>}
      breadcrumb={null}
      footerButtons={footerButtons}
      footerButtonProps={{
        className: 'w-full justify-end pr-4',
      }}
    />
  )
}
