/* eslint-disable */
'use client'

import {
  DownOutlined,
  FileImageOutlined,
  RightOutlined,
} from '@ant-design/icons'
import styles from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/styles.module.css'
import { DetailItem } from '@components/common/detail-item'
import ShowMoreInfo from '@components/common/show-more-info'
import CommonTable from '@components/common/table'
import { Show } from '@components/crud/show'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useGo, useParsed, useShow, useTranslate } from '@refinedev/core'
import {
  type Customer,
  ParameterResourceEnum,
  PermissionEnum,
} from '@sdk/hey-api/types.gen'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { FORMAT_DATE, FORMAT_DATE_TIME } from '@utility/instances'
import { Button, Collapse, Space, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

const { Title } = Typography
const { Panel } = Collapse

export default function CustomerShowPage() {
  const t = useTranslate()
  const { parameterSettings, hasFullAccessModule } = useUserStore(
    (state) => state,
  )

  const { queryResult } = useShow<Customer>()
  const { data, isLoading } = queryResult
  const record = data?.data
  const go = useGo()
  const { params } = useParsed()

  const deliveryColumns = [
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.delivery.code')}
        </span>
      ),
      dataIndex: 'delivery_address_code',
      key: 'delivery_address_code',
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.delivery.name')}
        </span>
      ),
      dataIndex: 'delivery_address_name',
      key: 'delivery_address_name',
      render: (text: string) => (text == 'T' ? '△' : text),
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.delivery.address')}
        </span>
      ),
      dataIndex: 'address',
      key: 'address',
      render: (text: string) => (text == 'T' ? '△' : text),
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.delivery.contact_person')}
        </span>
      ),
      dataIndex: 'contact_person_name',
      key: 'contact_person_name',
      render: (text: string) => (text == 'T' ? '△' : text),
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.delivery.phone')}
        </span>
      ),
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => (text == 'T' ? '△' : text),
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.delivery.email')}
        </span>
      ),
      dataIndex: 'mail',
      key: 'mail',
      render: (text: string) => (text == 'T' ? '△' : text),
    },
  ]

  const researchColumns = [
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.document_name')}
        </span>
      ),
      dataIndex: 'material_name',
      key: 'material_name',
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.judgement')}
        </span>
      ),
      dataIndex: 'judgement',
      key: 'judgement',
      width: 150,
      render: (text: string) => (text == 'T' ? '△' : text),
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.file')}
        </span>
      ),
      dataIndex: 'files',
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
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 180,
      render: (date: string) => date && dayjs(date).format(FORMAT_DATE),
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
      title: boldText(t('business_partner.business_partner')),
    },
    { title: boldText(t('customers.show.show'), PRIMARY) },
  ]

  console.log(record)
  return (
    <Show
      isLoading={isLoading}
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      rightFooterButtons={
        <Space>
          <Button
            type="primary"
            disabled={
              params?.disable ||
              !hasFullAccessModule(PermissionEnum.CUSTOMER_EDIT)
            }
            onClick={() =>
              data?.data.id &&
              go({
                to: {
                  resource: 'customers',
                  action: 'edit',
                  id: data?.data.id,
                },
              })
            }
          >
            {t('buttons.edit')}
          </Button>
        </Space>
      }
      footerButtons={
        <ShowMoreInfo
          descriptions={[
            {
              title: t('common.created_by'),
              value:
                (record?.author?.name ?? '--') +
                ' ' +
                dayjs(record?.created_at).format(FORMAT_DATE_TIME),
            },
            {
              title: t('common.updated_by'),
              value:
                (record?.editor?.name ?? '--') +
                ' ' +
                dayjs(record?.updated_at).format(FORMAT_DATE_TIME),
            },
          ]}
        />
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
              {parameterSettings?.get?.(ParameterResourceEnum.RANKS) && (
                <DetailItem label={t('customers.fields.unit_price_rank_code')}>
                  {record?.rank?.name}
                </DetailItem>
              )}
              <DetailItem label={t('customers.fields.credit_rank')}>
                {record?.fax}
              </DetailItem>
              <DetailItem label={t('customers.fields.anti_social_rank')}>
                {record?.company_research_information?.[1]?.judgement == 'T'
                  ? '△'
                  : record?.company_research_information?.[1]?.judgement}
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
                {record?.date_of_establishment &&
                  dayjs(record?.date_of_establishment).format(FORMAT_DATE)}
              </DetailItem>
              <DetailItem label={t('customers.show.department_in_charge')}>
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
          i18n: 'customers.show.delivery_destinations',
          children: (
            <CommonTable
              dataSource={record?.delivery_addresses}
              columns={deliveryColumns}
              pagination={false}
              rowKey="id"
            />
          ),
        })}

        {collapseWrapper({
          i18n: 'customers.show.corporate_research',
          children: (
            <CommonTable
              dataSource={record?.company_research_information}
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
