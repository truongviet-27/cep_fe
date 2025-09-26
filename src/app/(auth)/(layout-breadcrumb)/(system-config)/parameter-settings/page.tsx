/* eslint-disable */
'use client'

import { RightOutlined } from '@ant-design/icons'
import { Create } from '@components/crud/create'
import { useForm } from '@refinedev/antd'
import { useList } from '@refinedev/core'
import type { ParameterSettingControllerIndexResponse } from '@sdk/hey-api'
import { Form, message, Radio, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTranslations } from 'next-intl'

import ActionButtons from '@/components/common/action-button'
import CommonTable from '@/components/common/table'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { PRIMARY } from '@/utility/color'
import { PARAMETER_SETTING_EXCLUDE } from '@utility/permission'

const { Title } = Typography

export default function Page() {
  const t = useTranslations()

  const { data, isLoading } = useList<ParameterSettingControllerIndexResponse>()

  const { formProps, formLoading, saveButtonProps, onFinish, form } =
    useForm<ParameterSettingControllerIndexResponse>({
      action: 'create',
    })

  const handleOnFinish = (values: any) => {
    onFinish(values?.data)
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('system_config.system_config')}
        </Title>
      ),
    },
    {
      title: (
        <Title level={5}>{t('parameter_settings.parameter_settings')}</Title>
      ),
    },
  ]

  const handleCancel = () => {
    message.info(t('system_config.cancel_message'))
    form?.setFieldValue('data', data?.data)
  }

  const columns: ColumnsType<ParameterSettingControllerIndexResponse> = [
    {
      title: t('system_config.setting_item'),
      dataIndex: 'name',
      key: 'settingItem',
      width: 400,
      align: 'center',
    },
    {
      title: t('system_config.initial_setting'),
      key: 'is_manage',
      width: 400,
      align: 'center',
      render: (cur, _, index) => {
        return (
          <>
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
                  <Radio
                    value={false}
                    disabled={PARAMETER_SETTING_EXCLUDE.has(cur.resource)}
                  >
                    {t('parameter_settings.not_manage')}
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </>
        )
      },
    },
    {
      title: t('parameter_settings.description'),
      dataIndex: 'description',
      key: 'description',
      align: 'center',
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
