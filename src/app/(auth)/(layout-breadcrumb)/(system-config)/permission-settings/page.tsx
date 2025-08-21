'use client'

import { RightOutlined } from '@ant-design/icons'
import AutoHeading from '@components/common/auto-heading'
import { Create } from '@components/crud/create'
import { Checkbox, message, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

import { defaultSettingsData } from '@/app/(auth)/(layout-breadcrumb)/(system-config)/permission-settings/mockData'
import ActionButtons from '@/components/common/action-button'
import CommonTable from '@/components/common/table'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import type { SettingItem } from '@/interfaces/config'
import { PRIMARY } from '@/utility/color'

const { Title } = Typography

export default function Page() {
  const t = useTranslations()
  const [settings, setSettings] = useState<SettingItem[]>(defaultSettingsData)
  const [loading, setLoading] = useState(false)

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('system_config.system_config')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('system_config.permission_settings')}</Title>,
    },
  ]

  const handleCancel = () => {
    setSettings(defaultSettingsData)
    message.info(t('system_config.cancelMessage'))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      message.success(t('system_config.saveSuccessMessage'))
    } catch (error) {
      message.error(t('system_config.saveErrorMessage'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<SettingItem> = [
    {
      title: t('system_config.settingItem'),
      dataIndex: 'settingItem',
      key: 'settingItem',
      width: 300,
      align: 'center',
    },
    {
      title: t('system_config.employee'),
      key: 'employee',
      width: 200,
      align: 'center',
      render: () => <Checkbox />,
    },
    {
      title: t('system_config.manager'),
      key: 'manager',
      width: 200,
      align: 'center',
      render: () => <Checkbox />,
    },
    {
      title: t('system_config.purpose'),
      dataIndex: 'purpose',
      key: 'purpose',
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
      isLoading={loading}
      footerButtons={
        <ActionButtons
          onCancel={handleCancel}
          onSave={handleSave}
          loading={loading}
          cancelText={t('buttons.cancel')}
          saveText={t('buttons.saveSettings')}
        />
      }
    >
      <AutoHeading i18n={'system_config.permission_settings'} />
      <CommonTable
        columns={columns}
        dataSource={settings}
        pagination={false}
        bordered
        size="middle"
        className="mt-6"
      />
    </Create>
  )
}
