/* eslint-disable */
import { DeleteOutlined, DownOutlined } from '@ant-design/icons'
import type { useCustomerCreateForm } from '@app/(auth)/(layout-breadcrumb)/customers/create/use-customer'
import CommonTable from '@components/common/table'
import { Button, Collapse, Form, Input, Select, Space, Typography } from 'antd'
import React from 'react'

import styles from '../styles.module.css'

const { Title } = Typography
const { Panel } = Collapse

export const CorporateResearchFormSection = (
  props: ReturnType<typeof useCustomerCreateForm>,
) => {
  const { t, form } = props

  const columns = [
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.document_name')}
        </span>
      ),
      key: 'material_name',
      render: (field: any) => (
        <Form.Item
          name={[field.name, 'material_name']}
          // rules={rule}
          noStyle
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.judgement')}
        </span>
      ),
      key: 'judgement',
      width: 150,
      render: (field: any) => (
        <Form.Item
          name={[field.name, 'judgement']}
          // rules={rule}
          noStyle
          initialValue="A"
        >
          <Select
            options={[
              { value: 'A', label: 'A' },
              { value: 'O', label: 'O' },
              { value: '未定', label: '未定' },
            ]}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.file')}
        </span>
      ),
      key: 'files',
      render: (field: any) => (
        // Giả lập upload file bằng input URL
        // Bạn có thể thay thế bằng component Upload của AntD sau này
        <Form.Item
          name={[field.name, 'files', 0, 'url']}
          // rules={rule}
          noStyle
        >
          <Input placeholder={t('placeholders.file_url')} />
        </Form.Item>
      ),
    },
    {
      title: (
        <span className={styles.tableTitle}>{t('common.updated_by')}</span>
      ),
      key: 'editor',
      width: 120,
      render: () => <Input disabled placeholder="山田" />, // Giả lập dữ liệu hiển thị
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.last_updated')}
        </span>
      ),
      key: 'updated_at',
      width: 180,
      render: () => <Input disabled placeholder="2025/05/15" />, // Giả lập dữ liệu hiển thị
    },
    {
      title: <span className={styles.tableTitle}>{t('table.actions')}</span>,
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (field: any, record: any, index: number, { remove }: any) => (
        <Space>
          <Button type="primary" size="small">
            {t('buttons.edit')}
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => remove(field.name)}
          >
            {t('buttons.clear')}
          </Button>
        </Space>
      ),
    },
  ]

  const handleClearAll = () => {
    form.setFieldsValue({ company_research_information: [] })
  }

  {
    /*  (columns.map((col) =>*/
  }
  {
    /*  col.key === 'actions'*/
  }
  {
    /*  ? {*/
  }
  {
    /*  ...col,*/
  }
  {
    /*  render: (...args) => col.render(...args, { remove }),*/
  }
  {
    /*}*/
  }
  {
    /*  : col,*/
  }
  {
    /*  ))*/
  }

  return (
    <Collapse
      expandIconPosition="end"
      defaultActiveKey={['1']}
      className={`mb-4 ${styles.formPanel}`}
      expandIcon={({ isActive }) => (
        <DownOutlined
          style={{ transition: '0.3s' }}
          rotate={isActive ? 0 : 180}
        />
      )}
    >
      <Panel
        header={
          <Title level={5}>{t('customers.show.delivery_destinations')}</Title>
        }
        key="1"
      >
        <Form.List name="company_research_information">
          {(fields, { add, remove }) => (
            <Space
              size={20}
              style={{ width: '100%' }}
              direction={'vertical'}
              className={'pb-4'}
            >
              <CommonTable
                dataSource={fields}
                columns={columns as any}
                rowKey="key"
                pagination={false}
                bordered
              />
              <Space size={10} className="float-right mt-4">
                <Button onClick={() => add({}, 0)}>{t('buttons.add')}</Button>
                <Button danger onClick={handleClearAll}>
                  {t('product_units.buttons.clear_all_research')}
                </Button>
              </Space>
            </Space>
          )}
        </Form.List>
      </Panel>
    </Collapse>
  )
}
