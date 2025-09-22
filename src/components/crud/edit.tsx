import React from 'react'
import {
  useBack,
  useGo,
  useMutationMode,
  useNavigation,
  useRefineContext,
  useResource,
  useRouterType,
  useToPath,
  useTranslate,
  useUserFriendlyName,
} from '@refinedev/core'
import type { EditProps } from '@refinedev/antd'
import {
  AutoSaveIndicator,
  DeleteButton,
  type DeleteButtonProps,
  ListButton,
  type ListButtonProps,
  PageHeader,
  RefreshButton,
  type RefreshButtonProps,
  SaveButton,
  type SaveButtonProps,
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
 * `<Edit>` provides us a layout for displaying the page.
 * It does not contain any logic but adds extra functionalities like a refresh button.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/basic-views/edit} for more details.
 */
export const Edit: React.FC<EditProps & CustomProps> = ({
  title,
  saveButtonProps: saveButtonPropsFromProps,
  mutationMode: mutationModeProp,
  recordItemId,
  children,
  deleteButtonProps: deleteButtonPropsFromProps,
  canDelete,
  resource: resourceFromProps,
  isLoading = false,
  dataProviderName,
  // breadcrumb: breadcrumbFromProps,
  wrapperProps,
  headerProps,
  contentProps,
  // headerButtonProps,
  // headerButtons,
  footerButtonProps,
  footerButtons,
  isAutoHeading = true,
  i18nHeading,
  hiddenButtonBack = false,
  rightFooterButtons,
  // goBack: goBackFromProps,
  autoSaveProps,
}) => {
  const translate = useTranslate()
  const { options: { breadcrumb: globalBreadcrumb } = {} } = useRefineContext()
  const { mutationMode: mutationModeContext } = useMutationMode()
  const mutationMode = mutationModeProp ?? mutationModeContext

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

  // const breadcrumb =
  //   typeof breadcrumbFromProps === "undefined"
  //     ? globalBreadcrumb
  //     : breadcrumbFromProps;

  const hasList = resource?.list && !recordItemId
  const isDeleteButtonVisible =
    canDelete ??
    ((resource?.meta?.canDelete ?? resource?.canDelete) ||
      deleteButtonPropsFromProps)

  const listButtonProps: ListButtonProps | undefined = hasList
    ? {
        ...(isLoading ? { disabled: true } : {}),
        resource: routerType === 'legacy' ? resource?.route : identifier,
      }
    : undefined

  const refreshButtonProps: RefreshButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    resource: routerType === 'legacy' ? resource?.route : identifier,
    recordItemId: id,
    dataProviderName,
  }

  const deleteButtonProps: DeleteButtonProps | undefined = isDeleteButtonVisible
    ? {
        ...(isLoading ? { disabled: true } : {}),
        resource: routerType === 'legacy' ? resource?.route : identifier,
        mutationMode,
        onSuccess: () => {
          if (routerType === 'legacy') {
            legacyGoList(resource?.route ?? resource?.name ?? '')
          } else {
            go({ to: goListPath })
          }
        },
        recordItemId: id,
        dataProviderName,
        ...deleteButtonPropsFromProps,
      }
    : undefined

  const saveButtonProps: SaveButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    ...saveButtonPropsFromProps,
  }

  const defaultHeaderButtons = (
    <>
      {autoSaveProps && <AutoSaveIndicator {...autoSaveProps} />}
      {hasList && <ListButton {...listButtonProps} />}
      <RefreshButton {...refreshButtonProps} />
    </>
  )

  const defaultFooterButtons = (
    <>
      {isDeleteButtonVisible && <DeleteButton {...deleteButtonProps} />}
      <SaveButton {...saveButtonProps} />
    </>
  )

  return (
    <div {...(wrapperProps ?? {})}>
      <PageHeader
        // backIcon={goBackFromProps}
        // onBack={
        //   action !== "list" && typeof action !== "undefined"
        //     ? routerType === "legacy"
        //       ? goBack
        //       : back
        //     : undefined
        // }
        title={
          title ??
          translate(
            `${identifier}.titles.edit`,
            `Edit ${getUserFriendlyName(
              resource?.meta?.label ??
                resource?.options?.label ??
                resource?.label ??
                identifier,
              'singular',
            )}`,
          )
        }
        // extra={
        //   <Space wrap {...(headerButtonProps ?? {})}>
        //     {headerButtons
        //       ? typeof headerButtons === "function"
        //         ? headerButtons({
        //             defaultButtons: defaultHeaderButtons,
        //             listButtonProps,
        //             refreshButtonProps,
        //           })
        //         : headerButtons
        //       : defaultHeaderButtons}
        //   </Space>
        // }
        // breadcrumb={
        //   typeof breadcrumb !== "undefined" ? (
        //     <>{breadcrumb}</> ?? undefined
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
                style={{
                  float: 'right',
                  marginRight: 24,
                }}
                {...(footerButtonProps ?? {})}
              >
                {typeof footerButtons === 'function' ? (
                  footerButtons({
                    defaultButtons: defaultFooterButtons,
                    deleteButtonProps,
                    saveButtonProps,
                  })
                ) : (
                  <>
                    {footerButtons}
                    {
                      <Space
                        size={4}
                        style={{ paddingTop: footerButtons ? 60 : undefined }}
                      >
                        {!hiddenButtonBack && (
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
                        )}
                        {rightFooterButtons}
                      </Space>
                    }
                  </>
                )}
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
