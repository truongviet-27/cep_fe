/* eslint-disable */
'use client'

import { DetailItem } from '@components/common/detail-item'
import { Show } from '@components/crud/show'
import { useShow, useTranslate } from '@refinedev/core'
import { Button, Collapse, Space, Typography } from 'antd'
import React from 'react'
import styles from '@app/(auth)/(layout-breadcrumb)/customers/styles.module.css'
import {
  DownOutlined,
  FileImageOutlined,
  RightOutlined,
} from '@ant-design/icons'
import CommonTable from '@components/common/table'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { PRIMARY } from '@utility/color'
import type { Customer } from '@sdk/hey-api/types.gen' // SỬA LẠI: Import type từ SDK

const { Title, Text } = Typography
const { Panel } = Collapse

export default function CustomerShowPage() {
  const t = useTranslate()

  const { queryResult } = useShow<Customer>() // SỬA LẠI: Dùng type Customer từ SDK
  const { data, isLoading } = queryResult
  const record = data?.data // SỬA LẠI: Bỏ mock data, chỉ dùng data từ API

  const researchColumns = [
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.document_name')}
        </span>
      ),
      dataIndex: 'material_name', // SỬA LẠI: Dùng dataIndex
      key: 'material_name',
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.judgement')}
        </span>
      ),
      dataIndex: 'judgement', // SỬA LẠI: Dùng dataIndex
      key: 'judgement',
      width: 150,
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.file')}
        </span>
      ),
      dataIndex: 'files', // SỬA LẠI: Dùng dataIndex
      key: 'files',
      render: (files: Array<{ name: string; url: string }>) => (
        <Space direction="vertical" size="small">
          {files?.map((file) => (
            <a
              key={file.name}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileImageOutlined style={{ marginRight: 8 }} />
              {file.name}
            </a>
          ))}
        </Space>
      ),
    },
    {
      title: (
        <span className={styles.tableTitle}>{t('common.updated_by')}</span>
      ),
      dataIndex: ['editor', 'name'], // SỬA LẠI: Lấy dữ liệu lồng nhau
      key: 'editor',
      width: 120,
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.last_updated')}
        </span>
      ),
      dataIndex: 'updated_at', // SỬA LẠI: Dùng dataIndex
      key: 'updated_at',
      width: 180,
    },
  ]

  const collapseWrapper = ({
    i18n,
    children,
  }: {
    i18n: string
    children: React.ReactNode
  }) => (
    <Collapse
      defaultActiveKey={['1']}
      expandIconPosition="end"
      expandIcon={({ isActive }) => (
        <DownOutlined
          style={{ transition: '0.3s' }}
          rotate={isActive ? 180 : 0}
        />
      )}
    >
      <Panel header={<Title level={5}>{t(i18n)}</Title>} key="1">
        <div className={'space-y-6'}>{children}</div>
      </Panel>
    </Collapse>
  )

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('customers.customers')}
        </Title>
      ),
    },
    { title: <Title level={5}>{t('customers.show.show')}</Title> },
  ]

  return (
    <Show
      isLoading={isLoading}
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      rightFooterButtons={
        <Space>
          <Button type="primary">{t('buttons.edit')}</Button>
        </Space>
      }
      footerButtons={
        <div>
          {/* SỬA LẠI: Đường dẫn tới người tạo và ngày tạo */}
          <Text type="secondary" className="mr-8">
            {t('common.created_by')}: {record?.author?.name} (
            {record?.created_at})
          </Text>
          <Text type="secondary">
            {/* SỬA LẠI: Đường dẫn tới người sửa và ngày sửa */}
            {t('common.updated_by')}:{' '}
            {record?.editor?.name
              ? `${record.editor.name} (${record.updated_at})`
              : t('common.not_set')}
          </Text>
        </div>
      }
    >
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {collapseWrapper({
          children: (
            <>
              <DetailItem label={t('customers.fields.code')}>
                {record?.customer_code}
              </DetailItem>
              <DetailItem label={t('customers.fields.name')}>
                {record?.name}
              </DetailItem>
              <DetailItem label={t('customers.fields.name_kana')}>
                {record?.customer_name_by_kana}
              </DetailItem>
              <DetailItem label={t('customers.fields.country')}>
                {record?.country}
              </DetailItem>
              <DetailItem label={t('customers.fields.corporate_number')}>
                {record?.corporate_number}
              </DetailItem>
              <DetailItem label={t('customers.fields.unit_price_rank')}>
                {/* SỬA LẠI: Lấy tên rank từ object lồng nhau */}
                {record?.rank?.name}
              </DetailItem>
              {/* LƯU Ý: Các trường này không có trong type Customer của SDK */}
              <DetailItem label={t('customers.fields.credit_rank')}>
                N/A
              </DetailItem>
              <DetailItem label={t('customers.fields.anti_social_rank')}>
                N/A
              </DetailItem>
            </>
          ),
          i18n: 'customers.show.basic_info',
        })}

        {collapseWrapper({
          children: (
            <div className={'space-y-6'}>
              <DetailItem label={t('customers.show.postal_code')}>
                {record?.post_code}
              </DetailItem>
              <DetailItem label={t('customers.show.address')}>
                {record?.address}
              </DetailItem>
              <DetailItem label={t('customers.show.building_name')}>
                {record?.building}
              </DetailItem>
              <DetailItem label={t('customers.show.phone')}>
                {record?.phone}
              </DetailItem>
              <DetailItem label={t('customers.show.fax')}>
                {record?.fax}
              </DetailItem>
              <DetailItem label={t('customers.delivery.email')}>
                {record?.mail}
              </DetailItem>
              <DetailItem label={t('customers.show.listing_classification')}>
                {record?.listing_classification}
              </DetailItem>
              <DetailItem label={t('customers.show.industry')}>
                {record?.industry}
              </DetailItem>
              <DetailItem label={t('customers.show.date_of_establishment')}>
                {record?.date_of_establishment}
              </DetailItem>
              <DetailItem label={t('customers.show.department_in_charge')}>
                {/* SỬA LẠI: Đây là một chuỗi, không phải mảng */}
                {record?.department_in_charge}
              </DetailItem>
            </div>
          ),
          i18n: 'customers.show.address_contact',
        })}

        {collapseWrapper({
          children: (
            <div className={'space-y-6'}>
              <DetailItem label={t('customers.show.contact_name')}>
                {record?.person_in_charge_name}
              </DetailItem>
              <DetailItem label={t('customers.show.contact_department')}>
                {record?.person_in_charge_department}
              </DetailItem>
              <DetailItem label={t('customers.show.contact_email')}>
                {record?.person_in_charge_mail}
              </DetailItem>
              <DetailItem label={t('customers.show.contact_phone')}>
                {record?.person_in_charge_phone}
              </DetailItem>
            </div>
          ),
          i18n: 'customers.show.accounting_contact',
        })}

        {/*{collapseWrapper({*/}
        {/*  children: (*/}
        {/*    <div className={'space-y-6'}>*/}
        {/*      <DetailItem label={t('customers.show.contact_name')}>*/}
        {/*        {record?.accounting_contact?.name}*/}
        {/*      </DetailItem>*/}

        {/*      <DetailItem label={t('customers.show.contact_department')}>*/}
        {/*        {record?.accounting_contact?.department}*/}
        {/*      </DetailItem>*/}

        {/*      <DetailItem label={t('customers.show.contact_email')}>*/}
        {/*        {record?.accounting_contact?.email}*/}
        {/*      </DetailItem>*/}

        {/*      <DetailItem label={t('customers.show.contact_phone')}>*/}
        {/*        {record?.accounting_contact?.phone}*/}
        {/*      </DetailItem>*/}
        {/*    </div>*/}
        {/*  ),*/}
        {/*  i18n: 'customers.show.accounting_contact',*/}
        {/*})}*/}

        {collapseWrapper({
          i18n: 'customers.show.corporate_research',
          children: (
            <CommonTable
              dataSource={record?.company_research_information} // SỬA LẠI: Dùng đúng tên trường
              columns={researchColumns}
              pagination={false}
              rowKey="id"
            />
          ),
        })}
      </Space>
    </Show>
  )
}
