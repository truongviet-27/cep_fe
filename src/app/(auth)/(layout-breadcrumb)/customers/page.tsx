/* eslint-disable */
'use client'

import { RightOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import {
  CreateButton,
  DeleteButton,
  EditButton,
  useSelect,
  useTable,
} from '@refinedev/antd'
import {
  type BaseRecord,
  useGo,
  useTranslate,
  useUpdate,
} from '@refinedev/core'
import {
  ParameterResourceEnum,
  PermissionEnum,
  SimpleCustomer,
} from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { CSV_LINK, PRIMARY } from '@utility/color'
import { FORMAT_DATE } from '@utility/instances'
import {
  antiSocialCheckOptions,
  countryOptions,
  creditCheckOptions,
  searchDateTypeOptions,
} from '@utility/options'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  TableColumnsType,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import React, { useMemo } from 'react'
import AutoHeading from '@components/common/auto-heading'
import { cn } from '@utility/cn'

const { RangePicker } = DatePicker
const { Title } = Typography

interface ICustomer {
  id: string
  code: string
  name: string
  country: string
  department: string
  unit_price_rank: string
  credit_rank: string
  anti_social_check_date: string
  registration_date: string
  suspension_date: string | null
}

export default function CustomerListPage() {
  const t = useTranslate()
  const go = useGo()

  const { mutate, isLoading } = useUpdate()
  const { parameterSettings, hasFullAccessModule } = useUserStore(
    (state) => state,
  )

  const isFullAccess = hasFullAccessModule(PermissionEnum.CUSTOMER_EDIT)
  const allowRankResource = parameterSettings.get(ParameterResourceEnum.RANKS)

  const { selectProps: departmentSelectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
  })

  const { selectProps: ranksSelectProps } = useSelect({
    resource: 'ranks',
    optionLabel: 'name',
    optionValue: 'id',
    queryOptions: {
      enabled: allowRankResource,
    },
  })

  const { tableProps, setFilters, searchFormProps } = useTable<ICustomer>({
    syncWithLocation: true,
    onSearch: (values: any) => [
      {
        field: 'q',
        operator: 'null',
        value: values?.q,
      },
      {
        field: 'country',
        operator: 'null',
        value: values?.country,
      },
      {
        field: 'person_in_charge_department',
        operator: 'contains',
        value: values?.person_in_charge_department,
      },
      {
        field: 'price_rank_id',
        operator: 'null',
        value: values?.price_rank_id,
      },
      {
        field: 'credit_rank',
        operator: 'null',
        value: values?.credit_rank,
      },
      {
        field: 'anti_social_rank',
        operator: 'null',
        value: values?.anti_social_rank,
      },
      {
        field: 'search_date_type',
        operator: 'null',
        value: values?.search_date_type,
      },
      {
        field: 'date_start',
        operator: 'null',
        value: values.date_range?.[0]
          ? dayjs(values.date_range[0]).format(FORMAT_DATE)
          : undefined,
      },
      {
        field: 'date_end',
        operator: 'null',
        value: values.date_range?.[1]
          ? dayjs(values.date_range[1]).format(FORMAT_DATE)
          : undefined,
      },
    ],
  })

  const handleSearch = (values: any) => {
    setFilters([
      {
        field: 'q',
        operator: 'null',
        value: values?.q,
      },
      {
        field: 'country',
        operator: 'null',
        value: values?.country,
      },
      {
        field: 'person_in_charge_department',
        operator: 'contains',
        value: values?.person_in_charge_department,
      },
      {
        field: 'price_rank_id',
        operator: 'null',
        value: values?.price_rank_id,
      },
      {
        field: 'credit_rank',
        operator: 'null',
        value: values?.credit_rank,
      },
      {
        field: 'anti_social_rank',
        operator: 'null',
        value: values?.anti_social_rank,
      },
      {
        field: 'search_date_type',
        operator: 'null',
        value: values?.search_date_type,
      },
      {
        field: 'date_start',
        operator: 'null',
        value: values.date_range?.[0]
          ? dayjs(values.date_range[0]).format('YYYY-MM-DD')
          : undefined,
      },
      {
        field: 'date_end',
        operator: 'null',
        value: values.date_range?.[1]
          ? dayjs(values.date_range[1]).format('YYYY-MM-DD')
          : undefined,
      },
    ])
  }

  const getRowClassName = (record: BaseRecord) => {
    return record.deleted_at ? '!bg-gray-200' : ''
  }

  const columns: TableColumnsType<SimpleCustomer> = useMemo(
    () => [
      {
        title: t('customers.fields.code'),
        dataIndex: 'customer_code',
        key: 'customer_code',
        render: (text, record) => (
          <Link
            href={`/customers/show/${record.id}`}
            key={record.id}
            style={{ textDecoration: 'underline' }}
          >
            {text}
          </Link>
        ),
      },
      {
        title: t('customers.fields.name'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('customers.fields.country'),
        dataIndex: 'country',
        key: 'country',
      },
      {
        title: t('customers.fields.department'),
        dataIndex: 'department_in_charge',
        key: 'person_in_charge_department',
      },
      {
        title: t('customers.fields.unit_price_rank'),
        dataIndex: 'price_rank_code',
        key: 'price_rank_code',
        render: (text, record) => (
          <Link href={`/customers/show/${record.id}`} className="!underline">
            {text}
          </Link>
        ),
      },
      {
        title: (
          <div>
            <AutoHeading
              i18n={'customers.fields.credit_rank'}
              style={{ fontSize: '14px' }}
            />
            <AutoHeading
              i18n={'code_issue_settings.fields.updated_at'}
              style={{ fontSize: 12 }}
            />
          </div>
        ),
        dataIndex: 'credit_rank',
        key: 'credit_rank',
      },
      {
        title: (
          <div>
            <AutoHeading
              i18n={'customers.fields.anti_social_check_date'}
              style={{ fontSize: '14px' }}
            />
            <AutoHeading
              i18n={'code_issue_settings.fields.updated_at'}
              style={{ fontSize: 12 }}
            />
          </div>
        ),
        dataIndex: 'anti_social_rank_update_at',
        key: 'anti_social_rank_update_at',
        width: 150,
      },
      {
        title: t('customers.fields.registration_date'),
        dataIndex: 'created_at',
        key: 'created_at',
        render: (_, record) => dayjs(record?.created_at).format(FORMAT_DATE),
      },
      {
        title: t('customers.fields.suspension_date'),
        dataIndex: 'deleted_at',
        key: 'deleted_at',
        render: (_, record) =>
          record?.deleted_at && dayjs(record?.deleted_at).format(FORMAT_DATE),
      },
      {
        title: t('customers.fields.actions'),
        key: 'actions',
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <Space>
            {!record.deleted_at && (
              <EditButton
                icon={null}
                recordItemId={record.id}
                size={'small'}
                disabled={!isFullAccess}
              >
                {t('buttons.edit')}
              </EditButton>
            )}
            &nbsp;
            <Button
              size="small"
              danger={!record.deleted_at}
              type={record.deleted_at ? 'default' : 'primary'}
              icon={
                record.deleted_at ? (
                  <EditButton
                    loading={isLoading}
                    onClick={() =>
                      mutate({
                        resource: 'customers',
                        id: record.id,
                        values: {},
                        meta: { action: 'restore' },
                      })
                    }
                    icon={null}
                    recordItemId={record.id}
                    size={'small'}
                    type={'primary'}
                    disabled={!isFullAccess}
                  >
                    {t('buttons.resume')}
                  </EditButton>
                ) : (
                  <DeleteButton
                    icon={null}
                    danger
                    recordItemId={record.id}
                    size={'small'}
                    type={'primary'}
                    className={isFullAccess ? '' : '!bg-gray-100'}
                    disabled={!isFullAccess}
                  >
                    {t('buttons.suspend')}
                  </DeleteButton>
                )
              }
            />
          </Space>
        ),
      },
    ],
    [t, go],
  )

  const handleClear = () => {
    searchFormProps.form?.resetFields()
    setFilters([], 'replace')
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('business_partner.business_partner')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('customers.list.list')}</Title>,
    },
  ]

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={'customers.list.list'}
    >
      <Form
        colon={false}
        {...searchFormProps}
        layout="vertical"
        onFinish={handleSearch}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.filters.code_name'))}
              name="q"
            >
              <Input placeholder={t('placeholders.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.country'))}
              name="country"
            >
              <Select
                placeholder={t('placeholders.select')}
                options={countryOptions}
                showSearch
                filterOption={true}
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.department'))}
              name="department_id"
            >
              <Select
                {...departmentSelectProps}
                placeholder={t('placeholders.select')}
                style={{ maxWidth: 560 }}
              />
            </Form.Item>
          </Col>
          {allowRankResource && (
            <Col xs={24} md={4}>
              <Form.Item
                label={boldText(t('ranks.fields.code'))}
                name="unit_price_rank"
              >
                <Select
                  {...ranksSelectProps}
                  placeholder={t('placeholders.select')}
                />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.credit_rank'))}
              name="credit_rank"
            >
              <Select
                placeholder={t('placeholders.select')}
                options={creditCheckOptions}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.anti_social_rank'))}
              name="anti_social_rank"
            >
              <Select
                placeholder={t('placeholders.select')}
                options={antiSocialCheckOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.filters.date_range'))}
              name="search_date_type"
            >
              <Select
                placeholder={t('customers.fields.registration_date')}
                options={searchDateTypeOptions}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label={<></>} name="date_range">
              <RangePicker
                className="w-full"
                placeholder={[FORMAT_DATE, FORMAT_DATE]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item label={<></>}>
              <Space>
                <Button type="primary" htmlType="submit" onClick={handleSearch}>
                  {t('buttons.search')}
                </Button>
                <Button onClick={handleClear}>{t('buttons.clear')}</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Row justify="end" className="mb-4">
        <Space direction={'vertical'}>
          <CreateButton icon={null} disabled={!isFullAccess}>
            {t('buttons.create_new')}
          </CreateButton>
          <Link
            href={isFullAccess ? '/customers/csv' : '#'}
            className={isFullAccess ? '!underline' : '!text-gray-400'}
            style={{ color: CSV_LINK }}
          >
            {t('projects.csv_upload.title')}
          </Link>
        </Space>
      </Row>

      <CommonTable
        onRow={(record) => ({
          className: getRowClassName(record),
        })}
        {...tableProps}
        rowKey="id"
        columns={columns as any}
      />
    </List>
  )
}
