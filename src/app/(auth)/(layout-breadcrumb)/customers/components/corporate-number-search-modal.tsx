/* eslint-disable */
import CommonTable from '@components/common/table'
import { useTable } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import { Button, Col, Form, Input, Row, Space, TableColumnsType } from 'antd'
import React from 'react'

// Type cho dữ liệu của popup
interface ICorporateInfo {
  id: string
  name: string
  address: string
  corporate_number: string
}

// Props cho component modal
interface CorporateNumberSearchModalProps {
  modalProps: any
}

export const CorporateNumberSearchModal: React.FC<
  CorporateNumberSearchModalProps
> = ({ modalProps }) => {
  const t = useTranslate()
  const [searchForm] = Form.useForm()

  const { visible, close } = modalProps

  const params = {
    id: process.env.NEXT_PUBLIC_CORPORATE_NUMBER_ID || '',
    name: '',
    type: '02',
    mode: '1',
    target: '1',
    close: '0',
    history: '0',
  }

  const { tableProps, setFilters, setCurrent } = useTable({
    dataProviderName: 'corporationProvider',
    resource: 'name',
    filters: {
      initial: [
        { field: 'id', operator: 'eq', value: params.id },
        { field: 'name', operator: 'eq', value: params.name },
        { field: 'type', operator: 'eq', value: params.type },
        { field: 'mode', operator: 'eq', value: params.mode },
        { field: 'target', operator: 'eq', value: params.target },
        { field: 'close', operator: 'eq', value: params.close },
        { field: 'history', operator: 'eq', value: params.history },
      ],
    },
  })

  const handleSelect = (record: ICorporateInfo) => {
    // onSelect(record)
    close()
  }

  const columns: TableColumnsType<ICorporateInfo> = [
    { title: t('customers.modal.name'), dataIndex: 'name', key: 'name' },
    {
      title: t('customers.modal.address'),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: t('customers.modal.corporate_number'),
      dataIndex: 'corporate_number',
      key: 'corporate_number',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleSelect(record)}
          size="small"
        >
          {t('buttons.select')}
        </Button>
      ),
    },
  ]

  const handleSearch = (values: { name: string; address: string }) => {
    setCurrent(1)
    setFilters([
      { field: 'name', operator: 'contains', value: values.name },
      { field: 'address', operator: 'contains', value: values.address },
    ])
  }

  const handleClear = () => {
    searchForm.resetFields()
    setFilters([])
  }

  return (
    <div>
      <Form
        form={searchForm}
        layout="vertical"
        onFinish={handleSearch}
        className="mb-4"
        colon={false}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form.Item label={t('customers.modal.name')} name="name">
              <Input placeholder={t('placeholders.partial_match')} />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label={t('customers.modal.address')} name="address">
              <Input placeholder={t('placeholders.partial_match')} />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item className={'!mt-7.5'}>
              <Space>
                <Button type="primary" htmlType="submit">
                  {t('buttons.search')}
                </Button>
                <Button onClick={handleClear}>{t('buttons.clear')}</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <CommonTable {...tableProps} columns={columns as any} rowKey="id" />
    </div>
  )
}
