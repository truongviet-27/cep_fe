'use client'

import { SearchOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { useTable } from '@refinedev/antd'
import {
  type CrudFilters,
  type HttpError,
  useInvalidate,
  type useModalReturnType,
  useResource,
} from '@refinedev/core'
import type { Tenant } from '@sdk/hey-api'
import useTenantStore from '@stores/useTenantStore'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, Row, Space, Table } from 'antd'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React from 'react'

function TenantSwitchingModal({
  modalProps,
}: {
  modalProps: useModalReturnType
}) {
  const t = useTranslations('tenant')
  const t_btn = useTranslations('buttons')
  const router = useRouter()

  const { resource } = useResource()

  const { searchFormProps, tableProps, setFilters } = useTable<
    Tenant,
    HttpError,
    { q?: string }
  >({
    syncWithLocation: true,
    resource: 'tenants',
    onSearch: (values) => {
      const filters: CrudFilters = []
      if (values?.q) {
        filters.push({ field: 'q', operator: 'eq', value: values.q })
      }
      return filters
    },
  })

  // const dataSource = tableProps?.dataSource || []

  const invalidate = useInvalidate()

  return (
    <div>
      <h1
        style={{
          color: PRIMARY,
        }}
        className={`text-bl font-medium`}
      >
        {t('tenant')}
      </h1>

      <Form {...searchFormProps} layout="inline">
        <Row gutter={[24, 24]} style={{ width: '100%' }}>
          <Col md={16}>
            <Form.Item name="q" label={t('filters.label')}>
              <Input
                placeholder={t('filters.placeholder')}
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </Col>
          <Col md={4} style={{ textAlign: 'left' }}>
            <Space>
              <Button htmlType="submit" type="primary">
                {t('filters.search')}
              </Button>
              <Button
                onClick={() => {
                  searchFormProps.form?.resetFields()
                  setFilters([], 'replace')
                }}
              >
                {t('filters.clear')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      <CommonTable className={'mt-6'} {...tableProps} rowKey="id">
        <Table.Column<Tenant>
          title={t('columns.tenant_code')}
          dataIndex="code"
          render={(_value: Tenant['code'], record: Tenant) => record?.code}
        />
        <Table.Column<Tenant>
          title={t('columns.tenant_name')}
          dataIndex="name"
          render={(_value: Tenant['name'], record: Tenant) => record?.name}
        />
        <Table.Column<Tenant>
          title={t('columns.actions')}
          dataIndex="action"
          render={(_value: unknown, record: Tenant) => (
            <Button
              onClick={() => {
                const id: string | null = record?.id ?? null
                const name: string | null = record?.name ?? null
                useTenantStore.setState({ tenantId: id, tenantName: name })
                modalProps.close()
                invalidate({
                  resource: resource?.name,
                  invalidates: ['all'],
                })
                router.refresh()
              }}
            >
              {t_btn('select')}
            </Button>
          )}
        />
      </CommonTable>
    </div>
  )
}

export default TenantSwitchingModal
