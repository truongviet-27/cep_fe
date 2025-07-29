'use client'

import { defaultSettingsData } from '@app/[locale]/(auth)/system-config/fakeAPI'
import ActionButtons from '@components/common/action-button'
import type { SettingItem } from '@type/config'
import { message, Radio, Table, Tabs } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useState } from 'react'

export default function SystemConfigList() {
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
    message.info('変更をキャンセルしました')
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      message.success('設定を保存しました')
    } catch (error) {
      message.error('保存に失敗しました')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<SettingItem> = [
    {
      title: '設定項目',
      dataIndex: 'settingItem',
      key: 'settingItem',
      width: 200,
      // className: 'bg-gray-50',
    },
    {
      title: '初期設定',
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
                ? '管理しない'
                : '利用しない'}
            </Radio>
            <Radio value="manage" className="block text-blue-500">
              {record.settingItem.includes('マスタ') ? '管理する' : '利用する'}
            </Radio>
          </div>
        </Radio.Group>
      ),
    },
    {
      title: '変更目的',
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
      />
    </div>
  )

  const tabItems = [
    {
      key: '1',
      label: '1. クイックスタート用設定',
      children: renderSettingsTable(),
    },
    {
      key: '2',
      label: '2. 高度設定（プロ用）',
      children: renderPlaceholderContent('高度設定の内容'),
    },
    {
      key: '3',
      label: '3. エンタープライズ向け設定',
      children: renderPlaceholderContent('エンタープライズ設定の内容'),
    },
  ]

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-xl font-medium">パラメータ設定</h1>
      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        className="parameter-settings-tabs"
      />
    </div>
  )
}
