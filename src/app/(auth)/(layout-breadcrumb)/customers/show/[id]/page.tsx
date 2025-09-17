'use client'

import { DetailItem } from '@components/common/detail-item'
import CommonTable from '@components/common/table'
import { Show } from '@components/crud/show'
import { mockCustomerDetail } from '@mockApi/customer'
import { useShow, useTranslate } from '@refinedev/core'
import type { TableColumnsType } from 'antd'
import { Button, Collapse, Descriptions, Space, Tag, Typography } from 'antd'
import React, { useMemo } from 'react'

const { Title, Text } = Typography
const { Panel } = Collapse

// Type cho bảng Corporate Research
interface ICorporateResearch {
  key: string
  document_name: string
  judgement: string
  files: { name: string; url: string }[]
  updated_by: string
  last_updated: string
}

// Type chi tiết cho khách hàng
interface ICustomerDetail {
  id: string
  code: string
  name: string
  name_kana: string
  country: string
  corporate_number: string
  unit_price_rank: { rank: string; date: string }
  credit_rank: { rank: string; date: string }
  anti_social_rank: { rank: string; date: string }
  postal_code: string
  address: string
  building_name: string
  phone: string
  fax: string
  email: string
  listing_status: string
  industry: string
  establishment_date: string
  departments: string[]
  accounting_contact: {
    name: string
    department: string
    email: string
    phone: string
  }
  corporate_research: ICorporateResearch[]
  created_by: { name: string; date: string }
  updated_by: { name: string | null; date: string | null }
}

export default function CustomerShowPage() {
  const t = useTranslate()

  const { queryResult } = useShow<ICustomerDetail>()
  const { data, isLoading } = queryResult
  const record = data?.data ?? mockCustomerDetail

  const researchColumns: TableColumnsType<ICorporateResearch> = useMemo(
    () => [
      {
        title: t('customers.show.research.document_name'),
        dataIndex: 'document_name',
        key: 'document_name',
      },
      {
        title: t('customers.show.research.judgement'),
        dataIndex: 'judgement',
        key: 'judgement',
      },
      {
        title: t('customers.show.research.file'),
        dataIndex: 'files',
        key: 'files',
        render: (files: { name: string; url: string }[]) => (
          <Space direction="vertical">
            {files.map((file) => (
              <Button
                type="link"
                key={file.name}
                href={file.url}
                target="_blank"
              >
                {file.name}
              </Button>
            ))}
          </Space>
        ),
      },
      {
        title: t('common.updated_by'),
        dataIndex: 'updated_by',
        key: 'updated_by',
      },
      {
        title: t('customers.show.research.last_updated'),
        dataIndex: 'last_updated',
        key: 'last_updated',
      },
    ],
    [t],
  )

  return (
    <Show
      isLoading={isLoading}
      title={
        <Title level={4}>
          {t('customers.customers')} - {t('buttons.edit')}
        </Title>
      }
      rightFooterButtons={
        <Space>
          <Button type="primary">{t('buttons.edit')}</Button>
        </Space>
      }
      footerButtons={
        <div>
          <Text type="secondary" className="mr-8">
            {t('common.created_by')}: {record?.created_by.name} (
            {record?.created_by.date})
          </Text>
          <Text type="secondary">
            {t('common.updated_by')}:{' '}
            {record?.updated_by?.name
              ? `${record.updated_by.name} (${record.updated_by.date})`
              : t('common.not_set')}
          </Text>
        </div>
      }
    >
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        <Collapse defaultActiveKey={['1']} expandIconPosition="end">
          <Panel
            header={<Title level={5}>{t('customers.show.basic_info')}</Title>}
            key="1"
          >
            <div className={'space-y-6'}>
              <DetailItem label={t('customers.fields.code')}>
                {record?.code}
              </DetailItem>

              <DetailItem label={t('customers.fields.name')}>
                {record?.name}
              </DetailItem>

              <DetailItem label={t('customers.fields.name_kana')}>
                {record?.name_kana}
              </DetailItem>

              <DetailItem label={t('customers.fields.country')}>
                {record?.country}
              </DetailItem>

              <DetailItem label={t('customers.fields.corporate_number')}>
                {record?.corporate_number}
              </DetailItem>

              <DetailItem label={t('customers.fields.unit_price_rank')}>
                {record?.unit_price_rank.rank}
                <Text className="ml-4 text-gray-500">
                  {t('customers.show.last_confirmed_date')}:{' '}
                  {record?.unit_price_rank.date}
                </Text>
              </DetailItem>

              <DetailItem label={t('customers.fields.credit_rank')}>
                {record?.credit_rank.rank}
                <Text className="ml-4 text-gray-500">
                  {t('customers.show.last_confirmed_date')}:{' '}
                  {record?.credit_rank.date}
                </Text>
              </DetailItem>

              <DetailItem label={t('customers.fields.anti_social_rank')}>
                {record?.anti_social_rank.rank}
                <Text className="ml-4 text-gray-500">
                  {t('customers.show.last_confirmed_date')}:{' '}
                  {record?.anti_social_rank.date}
                </Text>
              </DetailItem>
            </div>
          </Panel>
        </Collapse>

        <Collapse defaultActiveKey={['1']} expandIconPosition="end">
          <Panel
            header={
              <Title level={5}>{t('customers.show.address_contact')}</Title>
            }
            key="1"
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label={t('customers.show.postal_code')}>
                {record?.postal_code}
              </Descriptions.Item>
              <Descriptions.Item label={t('customers.show.address')}>
                {record?.address}
              </Descriptions.Item>
              <Descriptions.Item label={t('customers.show.building_name')}>
                {record?.building_name}
              </Descriptions.Item>
              <Descriptions.Item label={t('customers.show.phone')}>
                {record?.phone}
              </Descriptions.Item>
              <Descriptions.Item label={t('customers.show.fax')}>
                {record?.fax}
              </Descriptions.Item>
              <Descriptions.Item label={t('customers.show.email')}>
                {record?.email}
              </Descriptions.Item>
              <Descriptions.Item label={t('customers.show.listing_status')}>
                {record?.listing_status}
              </Descriptions.Item>
              <Descriptions.Item label={t('customers.show.industry')}>
                {record?.industry}
              </Descriptions.Item>
              <Descriptions.Item label={t('customers.show.establishment_date')}>
                {record?.establishment_date}
              </Descriptions.Item>
              <Descriptions.Item label={t('customers.fields.department')}>
                {record?.departments.map((dep) => (
                  <Tag key={dep}>{dep}</Tag>
                ))}
              </Descriptions.Item>
            </Descriptions>
          </Panel>
        </Collapse>

        <Collapse defaultActiveKey={['1']} expandIconPosition="end">
          <Panel
            header={
              <Title level={5}>{t('customers.show.accounting_contact')}</Title>
            }
            key="1"
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label={t('customers.show.contact_name')}>
                {record?.accounting_contact.name}
              </Descriptions.Item>
              <Descriptions.Item label={t('customers.show.contact_department')}>
                {record?.accounting_contact.department}
              </Descriptions.Item>
              <Descriptions.Item label={t('customers.show.contact_email')}>
                {record?.accounting_contact.email}
              </Descriptions.Item>
              <Descriptions.Item label={t('customers.show.contact_phone')}>
                {record?.accounting_contact.phone}
              </Descriptions.Item>
            </Descriptions>
          </Panel>
        </Collapse>

        <Collapse defaultActiveKey={['1']} expandIconPosition="end">
          <Panel
            header={
              <Title level={5}>{t('customers.show.corporate_research')}</Title>
            }
            key="1"
          >
            <CommonTable
              dataSource={record?.corporate_research}
              columns={researchColumns}
              pagination={false}
              rowKey="key"
            />
          </Panel>
        </Collapse>
      </Space>
    </Show>
  )
}
