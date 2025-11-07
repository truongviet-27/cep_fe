'use client'
import { DeleteOutlined, DownOutlined } from '@ant-design/icons'
import type { useCustomerCreate } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/create/use-customer-create'
import type { useCustomerEdit } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/edit/[id]/use-customers-edit'
import CommonTable from '@components/common/table'
import { FORMAT_DATE } from '@utility/instances'
import { Button, Collapse, Form, Input, Space, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import styles from '../styles.module.css'

const { Title } = Typography
const { Panel } = Collapse

function CustomerContacts(
  props: ReturnType<typeof useCustomerCreate | typeof useCustomerEdit>,
) {
  const { t, form, setDeletedReceiverIds } = props

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
        header={<Title level={5}>{t('customers.receivers.title')}</Title>}
        key="1"
        forceRender
      >
        <Form.List
          name="receivers"
          rules={[
            {
              validator: async (_, receivers) => {
                if (!receivers || receivers.length < 1) {
                  return Promise.reject(
                    new Error(t('customers.receivers.min_one_required')),
                  )
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
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
                        {t('customers.receivers.department_name')}
                      </span>
                    ),
                    key: 'department_name',
                    width: '18%',
                    render: (field) => (
                      <Form.Item name={[field.name, 'department_name']} noStyle>
                        <Input />
                      </Form.Item>
                    ),
                  },
                  {
                    title: (
                      <span className={styles.tableTitle}>
                        {t('customers.receivers.contact_person_name')}
                      </span>
                    ),
                    key: 'contact_person_name',
                    width: '18%',
                    render: (field) => (
                      <Form.Item
                        name={[field.name, 'contact_person_name']}
                        rules={[
                          { required: true, message: t('validation.required') },
                          {
                            whitespace: true,
                            message: t('validation.whitespace'),
                          },
                        ]}
                        required
                        noStyle
                      >
                        <Input />
                      </Form.Item>
                    ),
                  },
                  {
                    title: (
                      <span className={styles.tableTitle}>
                        {t('customers.receivers.email')}
                      </span>
                    ),
                    key: 'email',
                    render: (field) => (
                      <Form.Item
                        name={[field.name, 'email']}
                        dependencies={['receivers']}
                        rules={[
                          { required: true, message: t('validation.required') },
                          {
                            type: 'email',
                            message: t('validation.email_format'),
                          },
                          {
                            validator: (_, value) => {
                              if (!value) return Promise.resolve()

                              const receivers =
                                form.getFieldValue('receivers') || []
                              const currentEmail = value.trim().toLowerCase()

                              // Find first index of this email
                              const firstIndex = receivers.findIndex(
                                (r: {
                                  email?: string
                                  [key: string]: unknown
                                }) =>
                                  r?.email?.trim().toLowerCase() ===
                                  currentEmail,
                              )

                              // If current field is not the first occurrence, show error
                              if (
                                firstIndex !== -1 &&
                                firstIndex !== field.name
                              ) {
                                return Promise.reject(
                                  new Error(t('validation.duplicate_email')),
                                )
                              }

                              return Promise.resolve()
                            },
                          },
                        ]}
                        required
                        noStyle
                      >
                        <Input
                          type="email"
                          onBlur={() => {
                            setTimeout(() => {
                              const receivers =
                                form.getFieldValue('receivers') || []
                              receivers.forEach((_: unknown, index: number) => {
                                if (index !== field.name) {
                                  form
                                    .validateFields([
                                      ['receivers', index, 'email'],
                                    ])
                                    .catch(() => {})
                                }
                              })
                            }, 0)
                          }}
                        />
                      </Form.Item>
                    ),
                  },
                  {
                    title: (
                      <span className={styles.tableTitle}>
                        {t('customers.receivers.created_at')}
                      </span>
                    ),
                    key: 'created_at',
                    width: '150px',
                    render: (field) => {
                      const createdAt = form.getFieldValue([
                        'receivers',
                        field.name,
                        'created_at',
                      ])
                      return createdAt
                        ? dayjs(createdAt).format(FORMAT_DATE)
                        : '---'
                    },
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
                    render: (field) => {
                      const receiver = form.getFieldValue([
                        'receivers',
                        field.name,
                      ])
                      return (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          disabled={fields.length === 1}
                          onClick={() => {
                            // If receiver has id, add to deletedReceiverIds
                            if (receiver?.id && setDeletedReceiverIds) {
                              setDeletedReceiverIds((prev: number[]) => [
                                ...prev,
                                receiver.id,
                              ])
                            }
                            // Remove from form
                            remove(field.name)
                          }}
                        />
                      )
                    },
                  },
                ]}
              />
              {errors.length > 0 && (
                <div
                  style={{
                    color: '#ff4d4f',
                    marginTop: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <Form.ErrorList errors={errors} />
                </div>
              )}
              <Button
                type="primary"
                onClick={() => {
                  add({
                    department_name: null,
                    contact_person_name: null,
                    email: null,
                  })
                }}
                className="float-right mt-4"
              >
                {t('customers.receivers.add_button')}
              </Button>
            </Space>
          )}
        </Form.List>
      </Panel>
    </Collapse>
  )
}

export default CustomerContacts
