'use client'

import { defaultSettingsData } from '@app/(auth)/(layout-breadcrumb)/system-config/fakeAPI'
import ActionButtons from '@components/common/action-button'
import type { SettingItem } from '@type/config'
import { message, Radio, Table, Tabs } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

export default function SystemConfigPage() {
  const t = useTranslations('systemConfig')
  const t_buttons = useTranslations('buttons')
  const [settings, setSettings] = useState<SettingItem[]>(defaultSettingsData)
  const [loading, setLoading] = useState(false)

  const handleSettingChange = (
    key: string,
    value: 'manage' | 'notManage' | 'use' | 'notUse',
  ) => {
    setSettings((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, currentValue: value } : item,
      ),
    )
  }

  const handleCancel = () => {
    setSettings(defaultSettingsData)
    message.info(t('cancelMessage'))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      message.success(t('saveSuccessMessage'))
    } catch (error) {
      message.error(t('saveErrorMessage'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<SettingItem> = [
    {
      title: t('settingItem'),
      dataIndex: 'settingItem',
      key: 'settingItem',
      width: 200,
      // className: 'bg-gray-50',
    },
    {
      title: t('initialSetting'),
      key: 'initialSetting',
      width: 200,
      // className: 'bg-gray-50',
      render: (_, record) => (
        <Radio.Group
          value={record.currentValue}
          onChange={(e) => handleSettingChange(record.key, e.target.value)}
        >
          <div className="space-y-2">
            <Radio value="notManage" className="block">
              {record.settingItem.includes('マスタ')
                ? t('notManage')
                : t('notUse')}
            </Radio>
            <Radio value="manage" className="block text-blue-500">
              {record.settingItem.includes('マスタ') ? t('manage') : t('use')}
            </Radio>
          </div>
        </Radio.Group>
      ),
    },
    {
      title: t('purpose'),
      dataIndex: 'purpose',
      key: 'purpose',
      render: (text) => (
        <div className="text-sm whitespace-pre-line text-gray-600">{text}</div>
      ),
    },
  ]

  const renderSettingsTable = () => (
    <div>
      <Table
        columns={columns}
        dataSource={settings}
        pagination={false}
        bordered
        size="middle"
        className="mb-6"
        onRow={() => {
          return {
            className: 'cursor-pointer',
            // onClick: () => {
            //   console.log('Clicked on row:', record.key)
            // },
          }
        }}
      />
      <ActionButtons
        onCancel={handleCancel}
        onSave={handleSave}
        loading={loading}
        cancelText={t_buttons('cancel')}
        saveText={t_buttons('saveSettings')}
      />
    </div>
  )

  const renderPlaceholderContent = (title: string) => (
    <div>
      <div className="py-8 text-center text-gray-500">{title}</div>
      <ActionButtons
        onCancel={handleCancel}
        onSave={handleSave}
        loading={loading}
        cancelText={t_buttons('cancel')}
        saveText={t_buttons('saveSettings')}
      />
    </div>
  )

  const tabItems = [
    {
      key: '1',
      label: t('quickStart'),
      children: renderSettingsTable(),
    },
    {
      key: '2',
      label: t('advanced'),
      children: renderPlaceholderContent(t('advancedContent')),
    },
    {
      key: '3',
      label: t('enterprise'),
      children: renderPlaceholderContent(t('enterpriseContent')),
    },
  ]

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-xl font-medium">{t('pageTitle')}</h1>
      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        className="parameter-settings-tabs"
      />
    </div>
  )
}
