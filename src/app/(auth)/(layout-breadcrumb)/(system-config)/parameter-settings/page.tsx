/* eslint-disable */
'use client'

import { RightOutlined } from '@ant-design/icons'
import { Create } from '@components/crud/create'
import { useForm } from '@refinedev/antd'
import { GetListResponse, useList } from '@refinedev/core'
import type {
  ParameterResourceEnum,
  ParameterSettingControllerIndexResponse,
} from '@sdk/hey-api'
import { Form, message, Radio, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTranslations } from 'next-intl'

import ActionButtons from '@/components/common/action-button'
import CommonTable from '@/components/common/table'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { PRIMARY } from '@/utility/color'
import { ParameterSettingType } from '@interfaces/permission'
import { useUserStore } from '@stores/useUserStore'
import { PARAMETER_SETTING_EXCLUDE } from '@utility/permission'
import { sortBy } from 'lodash'
import boldText from '@utility/bold-text'

type ParameterItemType = {
  parameter_id?: number
  resource?: ParameterResourceEnum
  code?: string
  name?: string
  is_manage?: boolean
}

const { Title } = Typography

export default function Page() {
  const t = useTranslations()

  const { data, isLoading } = useList<ParameterSettingControllerIndexResponse>({
    queryOptions: {
      select: (data) => {
        return {
          ...data,
          data: sortBy(data.data, ({ resource }: ParameterItemType) => {
            return resource && !PARAMETER_SETTING_EXCLUDE.has(resource)
          }),
        } as GetListResponse<ParameterSettingControllerIndexResponse>
      },
    },
  })

  const { formProps, formLoading, saveButtonProps, onFinish, form } = useForm({
    action: 'create',
    onMutationSuccess: ({ data }) => {
      const parameterSettingUpdated: ParameterSettingType =
        new Map() as ParameterSettingType
      const dataResponse = data?.items || []
      dataResponse.forEach(
        ({
          resource,
          is_manage,
        }: {
          resource: ParameterResourceEnum
          is_manage: boolean
        }) => {
          parameterSettingUpdated.set(resource, is_manage)
        },
      )

      useUserStore.getState().setParameterSettings(parameterSettingUpdated)
    },
  })

  const handleOnFinish = (values: any) => {
    onFinish(values?.data)
  }

  const breadcrumbItems = [
    {
      title: boldText(t('system_config.system_config')),
    },
    {
      title: boldText(t('parameter_settings.parameter_settings'), PRIMARY),
    },
  ]

  const handleCancel = () => {
    message.info(t('system_config.cancel_message'))
    form?.resetFields()
  }

  const columns: ColumnsType<ParameterSettingControllerIndexResponse> = [
    {
      title: t('system_config.setting_item'),
      dataIndex: 'name',
      key: 'settingItem',
      width: 400,
      align: 'left',
      className: '!px-4',
    },
    {
      title: t('system_config.initial_setting'),
      key: 'is_manage',
      width: 400,
      align: 'left',
      className: '!px-4',
      render: (cur, _, index) => {
        return (
          <div className={'!h-5'}>
            <Form.Item name={[index, 'id']} initialValue={cur?.id} hidden />

            <Form.Item name={[index, 'is_manage']} initialValue={cur.is_manage}>
              <Radio.Group>
                <Space size={'large'}>
                  <Radio
                    value={true}
                    defaultChecked={PARAMETER_SETTING_EXCLUDE.has(cur.resource)}
                  >
                    {t('parameter_settings.is_manage')}
                  </Radio>
                  {!PARAMETER_SETTING_EXCLUDE.has(cur.resource) && (
                    <Radio value={false}>
                      {t('parameter_settings.not_manage')}
                    </Radio>
                  )}
                </Space>
              </Radio.Group>
            </Form.Item>
          </div>
        )
      },
    },
    {
      title: t('parameter_settings.description'),
      dataIndex: 'description',
      key: 'description',
      align: 'left',
      className: '!px-4',
      render: (text) => (
        <div className="text-sm whitespace-pre-line text-gray-600">{text}</div>
      ),
    },
  ]

  return (
    <Create
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      isLoading={isLoading || formLoading}
      hiddenButtonBack
      rightFooterButtons={
        <ActionButtons
          onCancel={handleCancel}
          saveButtonProps={saveButtonProps}
          loading={isLoading || formLoading}
          cancelText={t('buttons.cancel')}
          saveText={t('permission_settings.buttons.save')}
        />
      }
    >
      <Form {...formProps} onFinish={handleOnFinish}>
        <CommonTable
          dataSource={data?.data || []}
          columns={columns}
          pagination={false}
          bordered
          size="middle"
          className="mt-6"
          rowKey="id"
        />
      </Form>
    </Create>
  )
}
