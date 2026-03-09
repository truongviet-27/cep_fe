/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line simple-import-sort/imports */

import { DeleteOutlined, DownOutlined } from '@ant-design/icons'
import styles from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/styles.module.css'
import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { FORMAT_DATE } from '@utility/instances'
import { Button, Collapse, Form, Input, Space } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

export default function CustomerContact() {
  const t = useTranslate()
  const { Panel } = Collapse
  const form = Form.useFormInstance()

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
        header={boldText(t('customers.receivers.title'))}
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
                scroll={{ x: undefined }}
                columns={[
                  {
                    title: (
                      <span className={styles.tableTitle}>
                        {t('customers.receivers.department_name')}
                      </span>
                    ),
                    key: 'department_name',
                    width: '25%',
                    render: (field: any) => (
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
                    width: '25%',
                    render: (field: any) => (
                      <Form.Item
                        name={[field.name, 'contact_person_name']}
                        validateTrigger="onBlur"
                        rules={[
                          {
                            required: true,
                            message: t(
                              'validation.customer.contact_person_name_customer_contacts.required',
                            ),
                          },
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
                    width: '30%',
                    key: 'email',
                    render: (field: any) => (
                      <Form.Item
                        name={[field.name, 'email']}
                        validateTrigger="onBlur"
                        rules={[
                          {
                            required: true,
                            message: t(
                              'validation.customer.email_customer_contacts.required',
                            ),
                          },
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

                              // Count how many times this email appears
                              const emailCount = receivers.filter(
                                (r: {
                                  email?: string
                                  [key: string]: unknown
                                }) =>
                                  r?.email?.trim().toLowerCase() ===
                                  currentEmail,
                              ).length

                              // If this email appears more than once, show error
                              if (emailCount > 1) {
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
                        <Input type="email" />
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
                    width: '15%',
                    render: (field: any) => {
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
                    width: 80,
                    minWidth: 80,
                    align: 'center',
                    onCell: () => ({
                      style: { padding: '8px', textAlign: 'center' },
                    }),
                    render: (field: any) => {
                      const canRemove = fields.length > 1
                      return (
                        <Button
                          size="small"
                          icon={canRemove ? <DeleteOutlined /> : undefined}
                          disabled={!canRemove}
                          onClick={() => remove(field.name)}
                          style={
                            canRemove
                              ? {
                                  color: '#fff',
                                  background: '#E74C3C',
                                  borderColor: '#E74C3C',
                                }
                              : undefined
                          }
                        >
                          {t('buttons.delete')}
                        </Button>
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
                autoInsertSpace={false}
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
