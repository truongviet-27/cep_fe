'use client'

import { RightOutlined } from '@ant-design/icons'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import { CommonButton } from '@components/common/common-button'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { BooleanField, useTable } from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { useModal } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { segmentOptions } from '@utility/options'
import { Modal, Table, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import type { SegmentedValue } from 'rc-segmented'
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

  const segmentLabelByValue: Record<SegmentedValue, string> =
    Object.fromEntries(segmentOptions.map((o) => [o.value, o.label])) as Record<
      SegmentedValue,
      string
    >

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
      <CommonTable {...tableProps} rowKey="id">
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
          title={<b>_</b>}
          render={(value) => <BooleanField value={value} />}
        />
        <Table.Column
          dataIndex="segment"
          title={t('code_issue_settings.fields.segment')}
          render={(value: SegmentedValue) =>
            segmentLabelByValue[value] ?? String(value)
          }
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
              <CommonButton
                type={'edit'}
                onClick={() => {
                  show()
                  setEditId(record?.id ?? null)
                }}
              />
            </div>
          )}
        />
      </CommonTable>

      <Modal
        open={visible}
        onCancel={close}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        width={'70vh'}
      >
        {editId && <CodeIssueSettingEdit id={editId} modalProps={modalProps} />}
      </Modal>
    </List>
  )
}
