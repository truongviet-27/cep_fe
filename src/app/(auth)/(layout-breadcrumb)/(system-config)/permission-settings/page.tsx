'use client'

import { RightOutlined } from '@ant-design/icons'
import { defaultSettingsData } from '@app/(auth)/(layout-breadcrumb)/(system-config)/permission-settings/mockData'
import ActionButtons from '@components/common/action-button'
import CommonCard from '@components/common/common-card'
import Breadcrumbs from '@components/layout/breadcrumbs'
import type { SettingItem } from '@type/config'
import { PRIMARY } from '@utility/color'
import { Checkbox, message, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

const { Title } = Typography

export default function Page() {
  const t = useTranslations()
  const [settings, setSettings] = useState<SettingItem[]>(defaultSettingsData)
  const [loading, setLoading] = useState(false)

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('breadcrumb.system')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('systemConfig.permissionSettings')}</Title>,
    },
  ]

  const handleCancel = () => {
    setSettings(defaultSettingsData)
    message.info(t('systemConfig.cancelMessage'))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      message.success(t('systemConfig.saveSuccessMessage'))
    } catch (error) {
      message.error(t('systemConfig.saveErrorMessage'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<SettingItem> = [
    {
      title: t('systemConfig.settingItem'),
      dataIndex: 'settingItem',
      key: 'settingItem',
      width: 300,
      align: 'center',
    },
    {
      title: t('systemConfig.employee'),
      key: 'employee',
      width: 200,
      align: 'center',
      render: () => <Checkbox />,
    },
    {
      title: t('systemConfig.manager'),
      key: 'manager',
      width: 200,
      align: 'center',
      render: () => <Checkbox />,
    },
    {
      title: t('systemConfig.purpose'),
      dataIndex: 'purpose',
      key: 'purpose',
      align: 'center',
      render: (text) => (
        <div className="text-sm whitespace-pre-line text-gray-600">{text}</div>
      ),
    },
  ]

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />

      <CommonCard>
        <h1 className="mb-6 text-xl font-medium">
          {t('systemConfig.permissionSettings')}
        </h1>
        <Table
          columns={columns}
          dataSource={settings}
          pagination={false}
          bordered
          size="middle"
          className="mb-6"
        />
        <ActionButtons
          onCancel={handleCancel}
          onSave={handleSave}
          loading={loading}
          cancelText={t('buttons.cancel')}
          saveText={t('buttons.saveSettings')}
        />
      </CommonCard>
    </div>
  )
}
