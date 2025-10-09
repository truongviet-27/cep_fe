/* eslint-disable */
'use client'

import { EditOutlined, RightOutlined } from '@ant-design/icons'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { BooleanField, useModalForm, useTable } from '@refinedev/antd'
import { BaseRecord, useResource } from '@refinedev/core'
import { ParameterResourceEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { DARK_RED, GREY, PRIMARY } from '@utility/color'
import { segmentOptions } from '@utility/options'
import { Button, Modal, Table, Tag, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import type { SegmentedValue } from 'rc-segmented'

const { Title } = Typography

export default function Page() {
  const t = useTranslations()
  const parameterSettings = useUserStore((state) => state.parameterSettings)

  const { tableProps } = useTable({
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
        onRow={(record) => ({
          className: getRowClassName(record),
        })}
      >
        <Table.Column
          dataIndex="name"
          title={t('code_issue_settings.fields.name')}
        />

        <Table.Column
          dataIndex="issue_method"
          title={t('code_issue_settings.fields.issue_method')}
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
          title={t('code_issue_settings.fields.prefix')}
        />
        <Table.Column
          dataIndex={['hash_dash']}
          title={<b>_</b>}
          render={(value) => value && <BooleanField value={!!value} />}
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
          render={(value: SegmentedValue) => <Tag>{value}</Tag>}
          title={t('code_issue_settings.fields.preview_code')}
        />
        <Table.Column
          align={'center'}
          title={t('table.actions')}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Button
              size={'small'}
              onClick={() => {
                show(record.id)
              }}
              icon={<EditOutlined />}
            />
          )}
        />
      </CommonTable>

      <Modal
        open={open}
        onCancel={close}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        width={'60vh'}
      >
        <CodeIssueSettingEdit modalProps={modalFormProps} />
      </Modal>
    </List>
  )
}
