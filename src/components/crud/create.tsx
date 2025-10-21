import React from 'react'
import {
  useBack,
  useNavigation,
  useRefineContext,
  useResource,
  useRouterType,
  useTranslate,
  useUserFriendlyName,
} from '@refinedev/core'
import type { CreateProps } from '@refinedev/antd'
import { PageHeader, SaveButton, type SaveButtonProps } from '@refinedev/antd'
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
 * `<Create>` provides us a layout to display the page.
 * It does not contain any logic but adds extra functionalities like action buttons and giving titles to the page.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/basic-views/create} for more details.
 */
export const Create: React.FC<CreateProps & CustomProps> = ({
  title,
  saveButtonProps: saveButtonPropsFromProps,
  children,
  resource: resourceFromProps,
  isLoading = false,
  breadcrumb: breadcrumbFromProps,
  wrapperProps,
  headerProps,
  contentProps,
  // headerButtonProps,
  // headerButtons,
  footerButtonProps,
  footerButtons,
  // goBack: goBackFromProps,
  isAutoHeading = true,
  rightFooterButtons,
  hiddenButtonBack = false,
  i18nHeading,
}) => {
  const translate = useTranslate()
  const { options: { breadcrumb: globalBreadcrumb } = {} } = useRefineContext()

  const routerType = useRouterType()
  const back = useBack()
  const { goBack } = useNavigation()
  const getUserFriendlyName = useUserFriendlyName()

  const { resource, action, identifier } = useResource(resourceFromProps)

  // const breadcrumb =
  //   typeof breadcrumbFromProps === 'undefined'
  //     ? globalBreadcrumb
  //     : breadcrumbFromProps

  const saveButtonProps: SaveButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    ...saveButtonPropsFromProps,
    htmlType: 'submit',
  }

  const defaultFooterButtons = <SaveButton {...saveButtonProps} />

  return (
    <div {...(wrapperProps ?? {})}>
      <PageHeader
        // backIcon={goBackFromProps}
        // onBack={
        //   action !== 'list' || typeof action !== 'undefined'
        //     ? routerType === 'legacy'
        //       ? goBack
        //       : back
        //     : undefined
        // }
        title={
          title ??
          translate(
            `${identifier}.titles.create`,
            `Create ${getUserFriendlyName(
              resource?.meta?.label ??
                resource?.options?.label ??
                resource?.label ??
                identifier,
              'singular',
            )}`,
          )
        }
        // breadcrumb={
        //   typeof breadcrumb !== 'undefined' ? <>{breadcrumb}</> : <Breadcrumb />
        // }
        // extra={
        //   <Space wrap {...(headerButtonProps ?? {})}>
        //     {headerButtons
        //       ? typeof headerButtons === 'function'
        //         ? headerButtons({
        //             defaultButtons: null,
        //           })
        //         : headerButtons
        //       : null}
        //   </Space>
        // }
        {...(headerProps ?? {})}
      >
        <Spin spinning={isLoading}>
          <Card
            bordered={false}
            styles={{
              body: { padding: 18 },
            }}
            actions={[
              <Space
                key="action-buttons"
                style={{ float: 'right', marginRight: 24 }}
                {...(footerButtonProps ?? {})}
              >
                <>
                  {footerButtons}
                  {
                    <Space
                      size={4}
                      style={{
                        paddingTop: footerButtons ? 60 : undefined,
                      }}
                    >
                      {!hiddenButtonBack && (
                        <Button
                          type="default"
                          onClick={goBack}
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
