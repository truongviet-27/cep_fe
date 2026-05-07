/* eslint-disable */
'use client'

import { RightOutlined } from '@ant-design/icons'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { BooleanField, useModalForm, useTable } from '@refinedev/antd'
import { BaseRecord, useResource, useTranslate } from '@refinedev/core'
import { ParameterResourceEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { DARK_RED, GREY, PRIMARY } from '@utility/color'
import { segmentOptions } from '@utility/options'
import { Button, Modal, Table, Tag } from 'antd'
import { useTranslations } from 'next-intl'
import type { SegmentedValue } from 'rc-segmented'

export default function Page() {
  const t = useTranslations()
  const tRefine = useTranslate()
  const parameterSettings = useUserStore((state) => state.parameterSettings)

  const { tableProps } = useTable({
    pagination: { pageSize: 20 },
    syncWithLocation: true,
    queryOptions: {
      select: (data) => {
        return {
          ...data,
          data: data.data.filter(
            (item) =>
              !(
                item.code === 'products' &&
                !parameterSettings?.get?.(ParameterResourceEnum.PRODUCTS)
              ),
          ),
        }
      },
    },
  })

  const { resource } = useResource()

  const modalFormProps = useModalForm({
    action: 'edit',
    resource: resource?.name,
    autoResetFormWhenClose: true,
    warnWhenUnsavedChanges: false,
    defaultFormValues: {
      hash_dash: true,
    },
  })

  const { show, close, open } = modalFormProps

  const editingId = modalFormProps.id
  const editingRecord = tableProps.dataSource?.find(
    (item) => item.id === editingId,
  )
  const currentType = editingRecord?.code

  const segmentLabelByValue: Record<SegmentedValue, string> =
    Object.fromEntries(segmentOptions.map((o) => [o.value, o.label])) as Record<
      SegmentedValue,
      string
    >

  const breadcrumbItems = [
    {
      title: boldText(t('system_config.system_config')),
    },
    {
      title: boldText(t('code_issue_settings.code_issue_settings'), PRIMARY),
    },
  ]

  const getRowClassName = (record: BaseRecord) => {
    return record.issue_method === 'manual' ? 'bg-gray-200' : ''
  }

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
    >
      <CommonTable
        {...tableProps}
        rowKey="id"
        scroll={undefined}
        onRow={(record) => ({
          className: getRowClassName(record),
        })}
      >
        <Table.Column
          dataIndex="name"
          title={
            <div style={{ textAlign: 'center' }}>
              {t('code_issue_settings.fields.name')}
            </div>
          }
          align={'left'}
          width="13%"
        />

        <Table.Column
          dataIndex="issue_method"
          title={
            <div style={{ textAlign: 'center' }}>
              {t('code_issue_settings.fields.issue_method')}
            </div>
          }
          width="8%"
          render={(value: 'manual' | 'automatic') => {
            const colorMap: Record<'manual' | 'automatic', string> = {
              automatic: DARK_RED,
              manual: GREY,
            }

            const text = t(`code_issue_settings.fields.enum_issue.${value}`)
            const color = colorMap[value] || 'default'

            return <Tag color={color}>{text}</Tag>
          }}
        />
        <Table.Column
          dataIndex="prefix"
          title={
            <div style={{ textAlign: 'center' }}>
              {t('code_issue_settings.fields.prefix')}
            </div>
          }
          align={'left'}
          width="7%"
        />
        <Table.Column
          dataIndex={['hash_dash']}
          title={
            <div style={{ textAlign: 'center' }}>
              {t('code_issue_settings.fields.hash')}
            </div>
          }
          width="5%"
          render={(value) => value && <BooleanField value={!!value} />}
        />
        <Table.Column
          dataIndex="segment"
          title={
            <div style={{ textAlign: 'center' }}>
              {t('code_issue_settings.fields.segment')}
            </div>
          }
          width="20%"
          render={(value: SegmentedValue) =>
            segmentLabelByValue[value] ?? String(value)
          }
          align={'left'}
        />
        <Table.Column
          dataIndex="serial_length"
          title={
            <div style={{ textAlign: 'center' }}>
              {t('code_issue_settings.fields.serial_length')}
            </div>
          }
          align={'right'}
          width="7%"
        />
        <Table.Column
          dataIndex="current_serial_number"
          title={
            <div style={{ textAlign: 'center' }}>
              {t('code_issue_settings.fields.total')}
            </div>
          }
          align={'right'}
          width="6%"
        />
        <Table.Column
          dataIndex="preview_code"
          width="13%"
          render={(value: SegmentedValue) => <Tag>{value}</Tag>}
          title={
            <div style={{ textAlign: 'center' }}>
              {t('code_issue_settings.fields.preview_code')}
            </div>
          }
          align={'left'}
        />
        <Table.Column
          align={'center'}
          title={
            <div style={{ textAlign: 'center' }}>{t('table.actions')}</div>
          }
          dataIndex="actions"
          width="5%"
          render={(_, record: BaseRecord) => (
            <Button
              size="small"
              icon={null}
              autoInsertSpace={false}
              onClick={() => {
                show(record.id)
              }}
              style={{
                color: '#FFFFFF',
                background: '#1FDB51',
              }}
            >
              {tRefine('buttons.edit')}
            </Button>
          )}
        />
      </CommonTable>

      <Modal
        open={open}
        onCancel={close}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        width={'35vw'}
      >
        <CodeIssueSettingEdit modalProps={modalFormProps} type={currentType} />
      </Modal>
    </List>
  )
}
