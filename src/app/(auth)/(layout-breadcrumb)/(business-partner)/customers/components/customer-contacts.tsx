'use client'
import { DownOutlined } from '@ant-design/icons'
import type { useCustomerCreate } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/create/use-customer-create'
import type { useCustomerEdit } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/edit/[id]/use-customers-edit'
import CommonTable from '@components/common/table'
import { useParsed } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { RED } from '@utility/color'
import { FORMAT_DATE_CROSS } from '@utility/instances'
import requiredTableTitle from '@utility/required-table-title'
import { Button, Collapse, Form, Input, Space, Tooltip } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import styles from '../styles.module.css'

const { Panel } = Collapse

function CustomerContacts(
  props: ReturnType<typeof useCustomerCreate | typeof useCustomerEdit>,
) {
  const { t, form } = props
  const { params } = useParsed()
  const isUpdate = !!params?.id
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
        header={boldText(
          <>
            {t('customers.receivers.title')}{' '}
            <span style={{ color: RED }}>*</span>
          </>,
        )}
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
                scroll={undefined}
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
                        <Input style={{ width: '100%' }} />
                      </Form.Item>
                    ),
                  },
                  {
                    title: requiredTableTitle(
                      t('customers.receivers.contact_person_name'),
                      styles.tableTitle,
                    ),
                    key: 'contact_person_name',
                    width: '18%',
                    render: (field) => (
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
                        <Input style={{ width: '100%' }} />
                      </Form.Item>
                    ),
                  },
                  {
                    title: requiredTableTitle(
                      t('customers.receivers.email'),
                      styles.tableTitle,
                    ),
                    key: 'email',
                    width: '36%',
                    onCell: () => ({
                      style: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        verticalAlign: 'middle',
                      },
                    }),
                    render: (field) => {
                      const email = form.getFieldValue([
                        'receivers',
                        field.name,
                        'email',
                      ])
                      const id = form.getFieldValue([
                        'receivers',
                        field.name,
                        'id',
                      ])
                      const isExistingRow = isUpdate && !!id

                      if (isExistingRow) {
                        return (
                          <Tooltip title={email} placement="topLeft">
                            <div
                              style={{
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'left',
                              }}
                            >
                              {email || '---'}
                            </div>
                          </Tooltip>
                        )
                      }
                      return (
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
                          <Input type="email" style={{ width: '100%' }} />
                        </Form.Item>
                      )
                    },
                  },
                  {
                    title: (
                      <span className={styles.tableTitle}>
                        {t('customers.receivers.created_at')}
                      </span>
                    ),
                    key: 'created_at',
                    width: '14%',
                    onCell: () => ({
                      style: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        verticalAlign: 'middle',
                      },
                    }),
                    render: (field) => {
                      const createdAt = form.getFieldValue([
                        'receivers',
                        field.name,
                        'created_at',
                      ])
                      const value = createdAt
                        ? dayjs(createdAt).format(FORMAT_DATE_CROSS)
                        : '---'
                      return (
                        <Tooltip title={value} placement="topLeft">
                          <div
                            style={{
                              maxWidth: '100%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              textAlign: 'left',
                            }}
                          >
                            {value}
                          </div>
                        </Tooltip>
                      )
                    },
                  },
                  {
                    title: (
                      <span className={styles.tableTitle}>
                        {t('table.actions')}
                      </span>
                    ),
                    key: 'actions',
                    width: '14%',
                    align: 'center',
                    render: (field) => {
                      return (
                        <Button
                          danger
                          size="small"
                          disabled={fields.length === 1}
                          autoInsertSpace={false}
                          onClick={() => remove(field.name)}
                          style={{
                            color: '#fff',
                            background: '#E74C3C',
                            borderColor: '#E74C3C',
                          }}
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

export default CustomerContacts
