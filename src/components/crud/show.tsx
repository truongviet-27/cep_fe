import React from 'react'
import {
  useBack,
  useGo,
  useNavigation,
  useRefineContext,
  useResource,
  useRouterType,
  useToPath,
  useTranslate,
  useUserFriendlyName,
} from '@refinedev/core'
import type { ShowProps } from '@refinedev/antd'
import {
  DeleteButton,
  type DeleteButtonProps,
  EditButton,
  type EditButtonProps,
  ListButton,
  type ListButtonProps,
  PageHeader,
  RefreshButton,
  type RefreshButtonProps,
} from '@refinedev/antd'
import { Button, Card, Space, Spin } from 'antd'
import AutoHeading from '@components/common/auto-heading'
import { PRIMARY } from '@utility/color'

type CustomProps = {
  isAutoHeading?: boolean
  i18nHeading?: string
  hiddenButtonBack?: boolean
  rightFooterButtons?: React.ReactNode
}

/**
 * `<Show>` provides us a layout for displaying the page.
 * It does not contain any logic but adds extra functionalities like a refresh button.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/basic-views/show} for more details.
 */
export const Show: React.FC<ShowProps & CustomProps> = ({
  title,
  canEdit,
  canDelete,
  deleteButtonProps: deleteButtonPropsFromProps,
  isLoading = false,
  children,
  resource: resourceFromProps,
  recordItemId,
  dataProviderName,
  breadcrumb: breadcrumbFromProps,
  contentProps,
  headerProps,
  wrapperProps,
  // headerButtons,
  footerButtons,
  footerButtonProps,
  headerButtonProps,
  i18nHeading,
  isAutoHeading = true,
  rightFooterButtons,
  hiddenButtonBack,
  goBack: goBackFromProps,
}) => {
  const translate = useTranslate()
  const { options: { breadcrumb: globalBreadcrumb } = {} } = useRefineContext()

  const routerType = useRouterType()
  const back = useBack()
  const go = useGo()
  const { goBack, list: legacyGoList } = useNavigation()
  const getUserFriendlyName = useUserFriendlyName()

  const {
    resource,
    action,
    id: idFromParams,
    identifier,
  } = useResource(resourceFromProps)

  const goListPath = useToPath({
    resource,
    action: 'list',
  })

  const id = recordItemId ?? idFromParams

  const breadcrumb =
    typeof breadcrumbFromProps === 'undefined'
      ? globalBreadcrumb
      : breadcrumbFromProps

  const hasList = resource?.list && !recordItemId
  const isDeleteButtonVisible =
    canDelete ??
    ((resource?.meta?.canDelete ?? resource?.canDelete) ||
      deleteButtonPropsFromProps)

  const isEditButtonVisible = canEdit ?? resource?.canEdit ?? !!resource?.edit

  const listButtonProps: ListButtonProps | undefined = hasList
    ? {
        resource: routerType === 'legacy' ? resource?.route : identifier,
      }
    : undefined
  const editButtonProps: EditButtonProps | undefined = isEditButtonVisible
    ? {
        ...(isLoading ? { disabled: true } : {}),
        type: 'primary',
        resource: routerType === 'legacy' ? resource?.route : identifier,
        recordItemId: id,
      }
    : undefined
  const deleteButtonProps: DeleteButtonProps | undefined = isDeleteButtonVisible
    ? {
        ...(isLoading ? { disabled: true } : {}),
        resource: routerType === 'legacy' ? resource?.route : identifier,
        recordItemId: id,
        onSuccess: () => {
          if (routerType === 'legacy') {
            legacyGoList(resource?.route ?? resource?.name ?? '')
          } else {
            go({ to: goListPath })
          }
        },
        dataProviderName,
        ...deleteButtonPropsFromProps,
      }
    : undefined
  const refreshButtonProps: RefreshButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    resource: routerType === 'legacy' ? resource?.route : identifier,
    recordItemId: id,
    dataProviderName,
  }

  const defaultHeaderButtons = (
    <>
      {hasList && <ListButton {...listButtonProps} />}
      {isEditButtonVisible && <EditButton {...editButtonProps} />}
      {isDeleteButtonVisible && <DeleteButton {...deleteButtonProps} />}
      <RefreshButton {...refreshButtonProps} />
    </>
  )

  return (
    <div {...(wrapperProps ?? {})}>
      <PageHeader
        // backIcon={goBackFromProps}
        // onBack={
        //   action !== 'list' && typeof action !== 'undefined'
        //     ? routerType === 'legacy'
        //       ? goBack
        //       : back
        //     : undefined
        // }
        title={
          title ??
          translate(
            `${identifier}.titles.show`,
            `Show ${getUserFriendlyName(
              resource?.meta?.label ??
                resource?.options?.label ??
                resource?.label ??
                identifier,
              'singular',
            )}`,
          )
        }
        // extra={
        //   <Space key="extra-buttons" wrap {...(headerButtonProps ?? {})}>
        //     {headerButtons
        //       ? typeof headerButtons === 'function'
        //         ? headerButtons({
        //             defaultButtons: defaultHeaderButtons,
        //             deleteButtonProps,
        //             editButtonProps,
        //             listButtonProps,
        //             refreshButtonProps,
        //           })
        //         : headerButtons
        //       : defaultHeaderButtons}
        //   </Space>
        // }
        // breadcrumb={
        //   typeof breadcrumb !== 'undefined' ? (
        //     (<>{breadcrumb}</> ?? undefined)
        //   ) : (
        //     <Breadcrumb />
        //   )
        // }
        {...(headerProps ?? {})}
      >
        <Spin spinning={isLoading}>
          <Card
            bordered={false}
            actions={[
              <Space
                key="footer-buttons"
                wrap
                style={
                  footerButtons
                    ? {
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingLeft: 24,
                        paddingRight: 24,
                      }
                    : {
                        float: 'right',
                        marginRight: 24,
                      }
                }
                {...footerButtonProps}
              >
                <>
                  {footerButtons}
                  {!hiddenButtonBack && (
                    <Space
                      size={4}
                      style={{
                        paddingTop: footerButtons ? 40 : undefined,
                      }}
                    >
                      {
                        <Button
                          type="default"
                          onClick={() => go({ to: goListPath })}
                          style={{
                            background: '#fff',
                            borderColor: PRIMARY,
                            color: PRIMARY,
                            fontWeight: 600,
                          }}
                        >
                          戻る
                        </Button>
                      }
                      {rightFooterButtons}
                    </Space>
                  )}
                </>
              </Space>,
            ]}
            {...(contentProps ?? {})}
          >
            {isAutoHeading && <AutoHeading i18n={i18nHeading} />}
            {children}
          </Card>
        </Spin>
      </PageHeader>
    </div>
  )
}
