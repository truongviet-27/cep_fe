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
import { Form, message, Radio, Select, Space, Typography } from 'antd'
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
        const allowedNames = [
          '単価ランクマスタ',
          '承認ルート設定',
          '税額の端数処理',
        ]
        const filteredData = data.data.filter((item: any) =>
          allowedNames.includes(item.name),
        )
        return {
          ...data,
          data: sortBy(filteredData, ({ resource }: ParameterItemType) => {
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

    onMutationError: () => {
      form?.resetFields()
    },
  })

  const handleOnFinish = (values: any) => {
    const transformedData = values?.data?.map((item: any) => {
      if (item.value !== undefined) {
        return {
          id: item.id,
          value: item.value,
        }
      }
      return {
        id: item.id,
        is_manage: item.is_manage,
      }
    })
    onFinish(transformedData)
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
      title: (
        <div style={{ textAlign: 'center' }}>
          {t('system_config.setting_item')}
        </div>
      ),
      dataIndex: 'name',
      key: 'settingItem',
      width: 400,
      align: 'left',
      className: '!px-4',
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          {t('system_config.initial_setting')}
        </div>
      ),
      key: 'is_manage',
      width: 400,
      align: 'left',
      className: '!px-4',
      render: (cur, _, index) => {
        const isTaxRoundingMethod = cur?.resource === 'tax_rounding_method'

        return (
          <div className={'!h-5'}>
            <Form.Item name={[index, 'id']} initialValue={cur?.id} hidden />

            {isTaxRoundingMethod ? (
              <Form.Item
                name={[index, 'value']}
                initialValue={cur?.value || 'round_down'}
              >
                <Select
                  style={{ width: '50%' }}
                  options={[
                    {
                      value: 'round_down',
                      label: t('tenant_settings.taxRounding.options.roundDown'),
                    },
                    {
                      value: 'round_up',
                      label: t('tenant_settings.taxRounding.options.roundUp'),
                    },
                    {
                      value: 'round_nearest',
                      label: t('tenant_settings.taxRounding.options.round'),
                    },
                  ]}
                />
              </Form.Item>
            ) : (
              <Form.Item
                name={[index, 'is_manage']}
                initialValue={cur.is_manage}
              >
                <Radio.Group>
                  <Space size={'large'}>
                    <Radio
                      value={true}
                      defaultChecked={PARAMETER_SETTING_EXCLUDE.has(
                        cur.resource,
                      )}
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
            )}
          </div>
        )
      },
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          {t('parameter_settings.description')}
        </div>
      ),
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
