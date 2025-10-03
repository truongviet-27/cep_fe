/* eslint-disable */
import { useCustom, useTranslate } from '@refinedev/core'
import { Button, Col, Form, Input, Row, Space, TableColumnsType } from 'antd'
import React from 'react'

// Type cho dữ liệu của popup
interface ICorporateInfo {
  name: string
  corporate_number: string
}

// Props cho component modal
interface CorporateNumberSearchModalProps {
  modalProps: any
  onSelect?: (record: ICorporateInfo) => void
}

export const CorporateNumberSearchModal: React.FC<
  CorporateNumberSearchModalProps
> = ({ modalProps, onSelect }) => {
  const t = useTranslate()
  const [searchForm] = Form.useForm()

  const { visible, close } = modalProps

  const params = {
    name: '%E5%9B%BD%E7%A8%8E%E5%BA%81%0D%0A',
    type: '02',
    history: '0',
  }

  const { data } = useCustom({
    url: `/api/corporate-number`,
    method: 'post',
    config: {
      filters: [
        { field: 'name', operator: 'eq', value: params.name },
        { field: 'type', operator: 'eq', value: params.type },
        { field: 'history', operator: 'eq', value: params.history },
      ],
      payload: params,
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
      dataIndex: 'address_outside',
      key: 'address_outside',
    },
    {
      title: t('customers.modal.corporate_number'),
      dataIndex: 'corporate_number',
      key: 'corporate_number',
      render: (_, record) => {
        return (
          <Space size={20} direction={'vertical'}>
            {record.corporate_number}
            <Button
              type="primary"
              onClick={() => handleSelect(record)}
              size="small"
            >
              {t('buttons.select')}
            </Button>
          </Space>
        )
      },
    },
  ]

  const handleSearch = (values: { name: string; address: string }) => {
    // setCurrent(1)
    // setFilters([
    //   { field: 'name', operator: 'contains', value: values.name },
    //   { field: 'address', operator: 'contains', value: values.address },
    // ])
  }

  const handleClear = () => {
    searchForm.resetFields()
    // setFilters([])
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
      {/*<CommonTable*/}
      {/*  dataSource={data?.data}*/}
      {/*  columns={columns as any}*/}
      {/*  rowKey="id"*/}
      {/*  pagination={false}*/}
      {/*/>*/}
    </div>
  )
}
