'use client'

import { RightOutlined } from '@ant-design/icons'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { BooleanField, EditButton, useTable } from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { useModal } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Modal, Table, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'

const { Title } = Typography

export default function Page() {
  const t = useTranslations()
  const { tableProps } = useTable({
    syncWithLocation: true,
  })

  const modalProps = useModal()

  const { show, close, visible } = modalProps

  const [editId, setEditId] = React.useState<number | string | null>(null)

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
        <Title level={5}>{t('code_issue_settings.code_issue_settings')}</Title>
      ),
    },
  ]

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="code"
          title={t('code_issue_settings.fields.code')}
        />
        <Table.Column
          dataIndex="name"
          title={t('code_issue_settings.fields.name')}
        />
        <Table.Column
          dataIndex="issue_method"
          title={t('code_issue_settings.fields.issue_method')}
        />
        <Table.Column
          dataIndex="prefix"
          title={t('code_issue_settings.fields.prefix')}
        />
        <Table.Column
          dataIndex={['hash_dash']}
          title={t('code_issue_settings.fields.hash_dash')}
          render={(value) => <BooleanField value={value} />}
        />
        <Table.Column
          dataIndex="segment"
          title={t('code_issue_settings.fields.segment')}
        />
        <Table.Column
          dataIndex="serial_length"
          title={t('code_issue_settings.fields.serial_length')}
        />
        <Table.Column
          dataIndex="total"
          title={t('code_issue_settings.fields.total')}
        />
        <Table.Column
          dataIndex="preview_code"
          title={t('code_issue_settings.fields.preview_code')}
        />
        <Table.Column
          title={t('table.actions')}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <div className={'w-8'}>
              <EditButton
                hideText
                size="small"
                recordItemId={record.id}
                onClick={(e) => {
                  e.preventDefault()
                  show()
                  setEditId(record?.id ?? null)
                }}
              />
            </div>
          )}
        />
      </Table>

      <Modal
        open={visible}
        onCancel={close}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
      >
        {editId && <CodeIssueSettingEdit id={editId} modalProps={modalProps} />}
      </Modal>
    </List>
  )
}
