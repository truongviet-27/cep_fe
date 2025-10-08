'use client'

import { RightOutlined, WarningOutlined } from '@ant-design/icons'
import { DetailItem } from '@components/common/detail-item'
import ShowMoreInfo from '@components/common/show-more-info'
import CommonTable from '@components/common/table'
import { Show } from '@components/crud/show'
import Breadcrumbs from '@components/layout/breadcrumbs'
import type { IDepartments } from '@interfaces/departments'
import { DeleteButton, EditButton, EmailField, useTable } from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { useGo, useShow, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { FORMAT_DATE_TIME } from '@utility/instances'
import { Space, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import React from 'react'

const { Title, Text } = Typography

export default function Page() {
  const t = useTranslate()
  const { queryResult } = useShow<IDepartments>()
  const go = useGo()

  const departmentData = queryResult?.data?.data

  const { tableProps } = useTable({
    resource: 'employees',
    filters: {
      permanent: [
        {
          field: 'department_id',
          operator: 'eq',
          value: departmentData?.id,
        },
      ],
    },
  })

  const renderFieldNotSet = (value?: string | null | undefined) => {
    return (
      <Space>
        <Text>{value ? value : t('common.not_set')}</Text>
        {!value && <WarningOutlined style={{ color: '#AC3C00' }} />}
      </Space>
    )
  }

  const getRowClassName = (record: BaseRecord) => {
    return !record.email || !record.code ? 'bg-gray-200' : ''
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('departments.departments')}
        </Title>
      ),
    },
    { title: <Title level={5}>{t('departments.show.show')}</Title> },
  ]

  return (
    <Show
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={t('departments.show.show')}
      footerButtons={
        <div>
          <ShowMoreInfo
            descriptions={[
              {
                title: t('approve_routes.show.creator'),
                value: `${departmentData?.author?.name ?? '---'} ${dayjs(
                  departmentData?.created_at,
                ).format(FORMAT_DATE_TIME)}`,
              },
              {
                title: t('common.updated_by'),
                value: departmentData?.editor?.name
                  ? `${departmentData.editor.name} ${dayjs(
                      departmentData.updated_at,
                    ).format(FORMAT_DATE_TIME)}`
                  : '---',
              },
            ]}
          />
          <div className="mt-4 flex w-full justify-start pb-4">
            <DeleteButton
              icon={null}
              size={'small'}
              onSuccess={() => go({ type: 'replace', to: '/departments' })}
            />
          </div>
        </div>
      }
      rightFooterButtons={<EditButton icon={null} type={'primary'} />}
    >
      <div className="flex flex-col space-y-6">
        <DetailItem label={t('departments.fields.code')}>
          {departmentData?.code}
        </DetailItem>
        <DetailItem label={t('departments.fields.name')}>
          {departmentData?.name}
        </DetailItem>
        <DetailItem label={t('departments.fields.number_of_employee')}>
          {departmentData?.number_of_employee}
        </DetailItem>
      </div>

      {departmentData?.id && (
        <div className="mt-8">
          <CommonTable
            {...tableProps}
            rowKey="id"
            onRow={(record) => ({
              className: getRowClassName(record),
            })}
            size="small"
          >
            <Table.Column
              dataIndex="code"
              title={t('employees.fields.code')}
              render={(value, record) => (
                <Link
                  style={{ textDecoration: 'underline' }}
                  href={`/employees/show/${record?.id}`}
                >
                  {value}
                </Link>
              )}
            />
            <Table.Column dataIndex="name" title={t('employees.fields.name')} />
            <Table.Column
              dataIndex={['email']}
              title={t('employees.fields.email')}
              render={(value) => <EmailField value={value} />}
            />
            <Table.Column
              dataIndex={['role', 'display_name']}
              title={t('employees.fields.role')}
              render={(value) => renderFieldNotSet(value)}
            />
            <Table.Column
              title={t('table.actions')}
              dataIndex="actions"
              render={(_, record: BaseRecord) => (
                <Space>
                  <EditButton
                    resource="employees"
                    hideText
                    size="small"
                    recordItemId={record.id}
                  />
                </Space>
              )}
              width={100}
            />
          </CommonTable>
        </div>
      )}
    </Show>
  )
}
