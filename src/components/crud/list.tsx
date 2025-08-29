import React from 'react'
import { useResource, useTranslate, useUserFriendlyName } from '@refinedev/core'
import type { ListProps } from '@refinedev/antd'
import { PageHeader } from '@refinedev/antd'
import AutoHeading from '@components/common/auto-heading'
import { Button } from 'antd'
import { PRIMARY } from '@utility/color'

type CustomProps = {
  isAutoHeading?: boolean
  footer?: React.ReactNode
}

/**
 * `<List>` provides us a layout for displaying the page.
 * It does not contain any logic but adds extra functionalities like a refresh button.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/basic-views/list} for more details.
 */
export const List: React.FC<ListProps & CustomProps> = ({
  canCreate,
  title,
  children,
  createButtonProps: createButtonPropsFromProps,
  resource: resourceFromProps,
  wrapperProps,
  contentProps,
  isAutoHeading = true,
  footer,
  // headerProps,
  // breadcrumb: breadcrumbFromProps,
  // headerButtonProps,
  // headerButtons,
}) => {
  const translate = useTranslate()
  // const { options: { breadcrumb: globalBreadcrumb } = {} } = useRefineContext()

  // const routerType = useRouterType()
  const getUserFriendlyName = useUserFriendlyName()

  const { resource, identifier } = useResource(resourceFromProps)

  // const isCreateButtonVisible =
  //   canCreate ??
  //   ((resource?.canCreate ?? !!resource?.create) || createButtonPropsFromProps)

  // const breadcrumb =
  //   typeof breadcrumbFromProps === 'undefined'
  //     ? globalBreadcrumb
  //     : breadcrumbFromProps

  // const createButtonProps: CreateButtonProps | undefined = isCreateButtonVisible
  //   ? {
  //       size: 'middle',
  //       resource: routerType === 'legacy' ? resource?.route : identifier,
  //       ...createButtonPropsFromProps,
  //     }
  //   : undefined

  // const defaultExtra = isCreateButtonVisible ? (
  //   <CreateButton {...createButtonProps} />
  // ) : null

  return (
    <div {...(wrapperProps ?? {})}>
      <PageHeader
        title={
          title ??
          translate(
            `${identifier}.titles.list`,
            getUserFriendlyName(
              resource?.meta?.label ??
                resource?.options?.label ??
                resource?.label ??
                identifier,
              'plural',
            ),
          )
        }
        // extra={
        //   headerButtons ? (
        //     <Space wrap {...headerButtonProps}>
        //       {typeof headerButtons === 'function'
        //         ? headerButtons({
        //             defaultButtons: defaultExtra,
        //             createButtonProps,
        //           })
        //         : headerButtons}
        //     </Space>
        //   ) : (
        //     defaultExtra
        //   )
        // }
        // breadcrumb={
        //   typeof breadcrumb !== 'undefined' ? (
        //     (<>{breadcrumb}</> ?? undefined)
        //   ) : (
        //     <Breadcrumb />
        //   )
        // }
        // {...(headerProps ?? {})}
      >
        <div
          className="min-h-[82vh] rounded-lg bg-white p-6 shadow-sm"
          {...(contentProps ?? {})}
        >
          <div className={'mb-4 flex items-center justify-between'}>
            {isAutoHeading && <AutoHeading />}
            {/*{defaultExtra}*/}
          </div>
          {children}
          <div className={'mt-15 flex justify-end space-x-3'}>
            {footer}
            <Button
              type="default"
              style={{
                background: '#fff',
                borderColor: PRIMARY,
                color: PRIMARY,
                fontWeight: 600,
              }}
            >
              戻る
            </Button>
          </div>
        </div>
      </PageHeader>
    </div>
  )
}
