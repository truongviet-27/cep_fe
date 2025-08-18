import { SearchOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { useTable } from '@refinedev/antd'
import useTenantStore from '@stores/useTenantStore'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, Row, Space, Table } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'

function TenantSwitchingModal({ close }: { close: () => void }) {
  const t = useTranslations('tenant')
  const t_btn = useTranslations('buttons')

  const { searchFormProps, tableProps } = useTable({
    syncWithLocation: true,
    resource: 'tenants',
  })

  // const dataSource = tableProps?.dataSource || []

  return (
    <div>
      <h1 className={`text-bl font-medium text-[${PRIMARY}]`}>{t('tenant')}</h1>

      <Form {...searchFormProps} layout="inline">
        <Row gutter={[24, 24]} style={{ width: '100%' }}>
          <Col md={16}>
            <Form.Item name="customer" label={t('filters.label')}>
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
              <Button onClick={() => searchFormProps.form?.resetFields()}>
                {t('filters.clear')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      <CommonTable
        className={'mt-6'}
        {...tableProps}
        loading={false}
        dataSource={[
          {
            id: 1,
            tenantCode: 'company_pionero',
            tenantName: '株式会社ピオネロ',
          },
          {
            id: 2,
            tenantCode: 'company_a',
            tenantName: '株式会社A',
          },
          {
            id: 3,
            tenantCode: 'company_b',
            tenantName: '株式会社B',
          },
          {
            id: 4,
            tenantCode: 'company_c',
            tenantName: '株式会社C',
          },
          {
            id: 5,
            tenantCode: 'company_d',
            tenantName: '株式会社D',
          },
        ]}
        rowKey="id"
      >
        <Table.Column title={t('columns.tenantCode')} dataIndex="tenantCode" />
        <Table.Column title={t('columns.tenantName')} dataIndex="tenantName" />
        <Table.Column
          title={t('columns.actions')}
          dataIndex="action"
          render={(_, record) => (
            <Button
              onClick={() => {
                useTenantStore.setState({ tenantId: record.id })
                close()
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
