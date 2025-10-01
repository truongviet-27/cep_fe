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

// Dữ liệu giả lập
const mockData: ICorporateInfo[] = [
  {
    id: '1',
    name: '株式会社サンプル商事',
    address: '東京都千代田区丸の内1-1-1',
    corporate_number: '0101356274984',
  },
  {
    id: '2',
    name: '株式会社テスト企業',
    address: '大阪府大阪市中央区1-2-3',
    corporate_number: '0203857398475',
  },
  {
    id: '3',
    name: 'デモ株式会社',
    address: '福岡県福岡市博多区4-5-6',
    corporate_number: '0309876543210',
  },
]

export const CorporateNumberSearchModal: React.FC<
  CorporateNumberSearchModalProps
> = ({ modalProps }) => {
  const t = useTranslate()
  const [searchForm] = Form.useForm()

  const { visible, close } = modalProps

  const { tableProps, setFilters } = useTable<ICorporateInfo>({
    // queryFn: async () => ({
    //   data: mockData,
    //   total: mockData.length,
    // }),
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
