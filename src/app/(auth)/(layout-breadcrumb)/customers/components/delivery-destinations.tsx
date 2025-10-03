'use client'

import { DeleteOutlined, DownOutlined } from '@ant-design/icons'
import type { useCustomerCreate } from '@app/(auth)/(layout-breadcrumb)/customers/create/use-customer-create'
import type { useCustomerEdit } from '@app/(auth)/(layout-breadcrumb)/customers/edit/[id]/use-customers-edit'
import CommonTable from '@components/common/table'
import { Button, Collapse, Form, Input, Space, Typography } from 'antd'
import React from 'react'

import styles from '../styles.module.css'

const { Title } = Typography
const { Panel } = Collapse

function DeliveryDestinations(
  props: ReturnType<typeof useCustomerCreate | typeof useCustomerEdit>,
) {
  const { t, rule, form } = props

  const [index, setIndex] = React.useState(0)

  const code = Form.useWatch('customer_code', form)

  return (
    <Collapse
      expandIconPosition="end"
      defaultActiveKey={['1']}
      className={`mb-4 ${styles.formPanel}`}
      expandIcon={({ isActive }) => (
        <DownOutlined
          style={{ transition: '0.3s' }}
          rotate={isActive ? 180 : 0}
        />
      )}
    >
      <Panel
        header={
          <Title level={5}>{t('customers.show.delivery_destinations')}</Title>
        }
        key="1"
      >
        <Form.List name="delivery_addresses">
          {(fields, { add, remove }) => (
            <Space
              size={20}
              style={{ width: '100%' }}
              direction={'vertical'}
              className={'pb-4'}
            >
              <CommonTable
                dataSource={fields}
                rowKey="key"
                pagination={false}
                columns={[
                  {
                    title: (
                      <span className={styles.tableTitle}>
                        {t('customers.delivery.code')}
                      </span>
                    ),
                    key: 'code',
                    render: (field) => (
                      <Form.Item
                        name={[field.name, 'code']}
                        rules={[rule]}
                        noStyle
                        required
                      >
                        <Input style={{ maxWidth: 560 }} disabled />
                      </Form.Item>
                    ),
                  },
                  {
                    title: (
                      <span className={styles.tableTitle}>
                        {t('customers.delivery.name')}
                      </span>
                    ),
                    key: 'name',
                    render: (field) => (
                      <Form.Item
                        name={[field.name, 'delivery_address_name']}
                        rules={[rule]}
                        required
                        noStyle
                      >
                        <Input style={{ maxWidth: 560 }} />
                      </Form.Item>
                    ),
                  },
                  {
                    title: (
                      <span className={styles.tableTitle}>
                        {t('customers.delivery.address')}
                      </span>
                    ),
                    key: 'address',
                    render: (field) => (
                      <Form.Item
                        name={[field.name, 'address']}
                        rules={[rule]}
                        noStyle
                        required
                      >
                        <Input style={{ maxWidth: 560 }} />
                      </Form.Item>
                    ),
                  },
                  {
                    title: (
                      <span className={styles.tableTitle}>
                        {t('customers.delivery.contact_person')}
                      </span>
                    ),
                    key: 'contact_person_name',
                    render: (field) => (
                      <Form.Item
                        name={[field.name, 'contact_person_name']}
                        rules={[rule]}
                        noStyle
                      >
                        <Input style={{ maxWidth: 560 }} />
                      </Form.Item>
                    ),
                  },
                  {
                    title: (
                      <span className={styles.tableTitle}>
                        {t('customers.delivery.phone')}
                      </span>
                    ),
                    key: 'phone',
                    render: (field) => (
                      <Form.Item
                        name={[field.name, 'phone']}
                        rules={[rule]}
                        noStyle
                      >
                        <Input style={{ maxWidth: 560 }} />
                      </Form.Item>
                    ),
                  },
                  {
                    title: (
                      <span className={styles.tableTitle}>
                        {t('customers.delivery.email')}
                      </span>
                    ),
                    key: 'email',
                    render: (field) => (
                      <Form.Item
                        name={[field.name, 'email']}
                        rules={[rule]}
                        noStyle
                      >
                        <Input style={{ maxWidth: 560 }} />
                      </Form.Item>
                    ),
                  },
                  {
                    title: (
                      <span className={styles.tableTitle}>
                        {t('table.actions')}
                      </span>
                    ),
                    key: 'actions',
                    width: '100px',
                    align: 'center',
                    render: (field) => (
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    ),
                  },
                ]}
              />
              <Button
                type="primary"
                onClick={() => {
                  if (!code) {
                    form.focusField('customer_code')
                    form.validateFields().then(() => {})
                  } else {
                    add({
                      code: code + '-' + index,
                      name: null,
                      address: null,
                      contact_person: null,
                      phone: null,
                      email: null,
                      key: index,
                    })
                  }
                  setIndex(index + 1)
                }}
                className="float-right mt-4"
              >
                {t('buttons.add_delivery_destination')}
              </Button>
            </Space>
          )}
        </Form.List>
      </Panel>
    </Collapse>
  )
}

export default DeliveryDestinations
