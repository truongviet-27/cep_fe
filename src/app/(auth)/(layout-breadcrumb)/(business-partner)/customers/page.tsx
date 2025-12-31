/* eslint-disable */
'use client'

import { ExclamationCircleOutlined, RightOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import {
  CreateButton,
  DeleteButton,
  EditButton,
  useModalForm,
  useTable,
} from '@refinedev/antd'
import {
  type BaseRecord,
  useGo,
  useNotification,
  useTranslate,
  useUpdate,
} from '@refinedev/core'
import {
  ParameterResourceEnum,
  PermissionEnum,
  Rank,
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
  Modal,
  Row,
  Select,
  Space,
  TableColumnsType,
  Tooltip,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import AutoHeading from '@components/common/auto-heading'
import { SelectPagination } from '@components/common/select-pagination'
import { RankModalEdit } from '@app/(auth)/(layout-breadcrumb)/(merchandise)/ranks/edit/modal'

const { RangePicker } = DatePicker
const { Title, Text } = Typography

interface ICustomer {
  id: string
  code: string
  name: string
  country: string
  department: string
  unit_price_rank_code: string
  credit_rank: string
  anti_social_check_date: string
  registration_date: string
  suspension_date: string | null
}

export default function CustomerListPage() {
  const t = useTranslate()
  const go = useGo()
  const [isShow, setIsShow] = useState(true)

  const { mutate, isLoading } = useUpdate()
  const { parameterSettings, hasFullAccessModule } = useUserStore(
    (state) => state,
  )

  const notification = useNotification()

  const isFullAccess = hasFullAccessModule(PermissionEnum.CUSTOMER_EDIT)
  const allowRankResource = parameterSettings?.get?.(
    ParameterResourceEnum.RANKS,
  )

  const modalFormProps = useModalForm<Rank>({
    action: 'edit',
    resource: 'ranks',
    autoResetFormWhenClose: true,
    warnWhenUnsavedChanges: false,
    autoResetForm: true,
  })

  const {
    show: editModalShow,
    close: editModalClose,
    open: editModalOpen,
  } = modalFormProps

  const { tableProps, setFilters, searchFormProps, setCurrent } =
    useTable<ICustomer>({
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
          field: 'department_in_charge_id',
          operator: 'null',
          value: values?.department_in_charge_id,
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
    setCurrent(1)
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
        field: 'department_in_charge_id',
        operator: 'null',
        value: values?.department_in_charge_id,
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
    return record.deleted_at ? '!bg-gray-300' : ''
  }

  const columns: TableColumnsType<SimpleCustomer> = useMemo(
    () => [
      {
        title: t('customers.fields.code'),
        dataIndex: 'customer_code',
        key: 'customer_code',
        width: 130,
        render: (text, record) => (
          <Link
            href={
              record.deleted_at
                ? `/customers/show/${record.id}?disable=true`
                : `/customers/show/${record.id}`
            }
            key={record.id}
            style={{
              textDecoration: 'underline',
              whiteSpace: 'nowrap',
              display: 'inline-block',
            }}
          >
            {text}
          </Link>
        ),
      },
      {
        title: t('customers.fields.name'),
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        width: '35%',
        ellipsis: true,
      },
      {
        title: t('customers.fields.country'),
        dataIndex: 'country',
        key: 'country',
        align: 'left',
        width: 100,
        render: (country) =>
          country && <div className="min-w-[100px]">{country}</div>,
      },
      {
        title: t('customers.fields.department'),
        dataIndex: 'department_in_charge',
        key: 'person_in_charge_department',
        align: 'left',
        ellipsis: true,
        render: (department) => {
          if (!department) return null
          return (
            <Space
              size={4}
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              {department.name}
              {department.deleted_at && (
                <Tooltip title={t('departments.is_deleted')} color="red">
                  <ExclamationCircleOutlined style={{ color: 'red' }} />
                </Tooltip>
              )}
            </Space>
          )
        },
      },
      {
        title: t('customers.fields.unit_price_rank_code'),
        dataIndex: 'rank',
        key: 'rank',
        width: 80,
        render: (rank) =>
          rank?.code ? (
            <Link
              href={`/ranks`}
              className="!underline"
              onClick={(event) => {
                event.preventDefault()
                editModalShow(rank.id)
              }}
            >
              {rank?.code}
            </Link>
          ) : (
            <>-</>
          ),
      },
      {
        title: (
          <div>
            <AutoHeading
              i18n={'customers.fields.credit_rank'}
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            />
            <AutoHeading
              i18n={'code_issue_settings.fields.updated_at'}
              style={{ fontSize: 12 }}
            />
          </div>
        ),
        dataIndex: 'credit_rank',
        key: 'credit_rank',
        width: 110,
        render: (_, record) => (
          <Space direction={'vertical'} className="min-w-[100px]">
            <Text strong>{record?.credit_rank}</Text>
            <Text className={'!font-light !italic'}>
              {record?.credit_rank_update_at &&
                dayjs(record?.credit_rank_update_at).format(FORMAT_DATE)}
            </Text>
          </Space>
        ),
      },
      {
        title: (
          <div>
            <AutoHeading
              i18n={'customers.fields.anti_social_check_date'}
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            />
            <AutoHeading
              i18n={'code_issue_settings.fields.updated_at'}
              style={{ fontSize: 12 }}
            />
          </div>
        ),
        dataIndex: 'anti_social_rank_update_at',
        key: 'anti_social_rank_update_at',
        width: 100,
        render: (_, record) => (
          <Space direction={'vertical'} className="min-w-[100px]">
            <Text strong>
              {record?.anti_social_rank === 'T'
                ? '△'
                : record?.anti_social_rank}
            </Text>
            <Text className={'!font-light !italic'}>
              {record?.anti_social_rank_update_at &&
                dayjs(record.anti_social_rank_update_at).format(FORMAT_DATE)}
            </Text>
          </Space>
        ),
      },
      {
        title: t('customers.fields.registration_date'),
        dataIndex: 'created_at',
        key: 'created_at',
        width: 100,
        render: (text) =>
          text && (
            <div className="min-w-[100px]">
              {dayjs(text).format(FORMAT_DATE)}
            </div>
          ),
      },
      {
        title: t('customers.fields.suspension_date'),
        dataIndex: 'deleted_at',
        key: 'deleted_at',
        align: 'left',
        width: 100,
        render: (text) =>
          text && (
            <div className="min-w-[100px]">
              {dayjs(text).format(FORMAT_DATE)}
            </div>
          ),
      },
      {
        title: t('customers.fields.actions'),
        key: 'actions',
        align: 'center',
        dataIndex: 'actions',
        width: 130,
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
            {record.deleted_at ? (
              <Button
                size="small"
                type="primary"
                loading={isLoading}
                disabled={!isFullAccess}
                onClick={() => {
                  mutate({
                    resource: 'customers',
                    id: record.id,
                    values: {},
                    meta: { action: 'restore' },
                  })
                }}
              >
                {t('buttons.resume')}
              </Button>
            ) : (
              <DeleteButton
                icon={null}
                danger
                confirmOkText={t('buttons.suspend')}
                recordItemId={record.id}
                size={'small'}
                type={'primary'}
                className={isFullAccess ? '' : '!bg-gray-100'}
                disabled={!isFullAccess}
                successNotification={false}
                onSuccess={() => {
                  if (notification && notification.open) {
                    notification.open({
                      type: 'success',
                      message: t('customers.suspend_success_title'),
                      description: t('customers.suspend_success_desc', {
                        code: record.customer_code,
                      }),
                      key: `delete-${record.id}`,
                    })
                  }
                }}
              >
                {t('buttons.suspend')}
              </DeleteButton>
            )}
          </Space>
        ),
      },
    ],
    [t, go, isFullAccess, isLoading, mutate, editModalShow],
  )

  const handleClear = () => {
    searchFormProps.form?.resetFields()
    setFilters([], 'replace')
  }

  const breadcrumbItems = [
    {
      title: boldText(t('business_partner.business_partner')),
    },
    {
      title: boldText(t('customers.list.list'), PRIMARY),
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
                allowClear
                placeholder={t('placeholders.select')}
                options={countryOptions}
                showSearch
                filterOption={true}
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <SelectPagination
              selectProps={{
                resource: 'departments',
              }}
              formItemProps={{
                label: boldText(t('customers.fields.department')),
                name: 'department_in_charge_id',
              }}
              selectComponentProps={{
                placeholder: t('placeholders.select'),
                style: { maxWidth: 560, minWidth: '150px' },
              }}
            />
          </Col>
          {allowRankResource && (
            <Col xs={24} md={4}>
              <SelectPagination
                formItemProps={{
                  label: boldText(t('ranks.fields.code')),
                  name: 'price_rank_id',
                }}
                selectProps={{
                  resource: 'ranks',
                  queryOptions: {
                    enabled: allowRankResource,
                  },
                }}
                selectComponentProps={{
                  placeholder: t('placeholders.select'),
                  style: { maxWidth: 560, minWidth: '150px' },
                }}
                optionLabel={'code'}
              />
            </Col>
          )}
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.credit_rank'))}
              name="credit_rank"
            >
              <Select
                allowClear
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
                allowClear
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
                allowClear
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
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={handleSearch}
                  autoInsertSpace={false}
                >
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

      <Modal
        open={editModalOpen}
        onCancel={() => {
          setIsShow(true)
          editModalClose()
        }}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        width={'70vh'}
      >
        <RankModalEdit
          modalFormProps={modalFormProps}
          setIsShow={setIsShow}
          isShow={isShow}
        />
      </Modal>

      <CommonTable
        tableLayout="fixed"
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
