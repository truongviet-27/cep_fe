/* eslint-disable simple-import-sort/imports */
'use client'

import { DownOutlined } from '@ant-design/icons'
import type { useCustomerCreate } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/create/use-customer-create'
import type { useCustomerEdit } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/edit/[id]/use-customers-edit'
import CommonTable from '@components/common/table'
import boldText from '@utility/bold-text'
import requiredTableTitle from '@utility/required-table-title'
import { Button, Collapse, Form, Input, Space } from 'antd'
import React, { useEffect } from 'react'
import styles from '../styles.module.css'

const { Panel } = Collapse

function DeliveryDestinations(
  props: ReturnType<typeof useCustomerCreate | typeof useCustomerEdit>,
) {
  const { t, rule, form } = props

  const customerCode = Form.useWatch('customer_code', form)
  const mainPostCode = Form.useWatch('post_code', form)
  const mainAddress = Form.useWatch('address', form)
  const mainBuilding = Form.useWatch('building', form)
  const mainPhone = Form.useWatch('phone', form)

  useEffect(() => {
    if (!customerCode) return

    const currentList = form.getFieldValue('delivery_addresses') || []
    const fullAddress = [mainAddress, mainBuilding].filter(Boolean).join(' ')

    const firstRecordData = {
      delivery_address_code: `${customerCode}-1`,
      post_code: mainPostCode,
      address: fullAddress,
      phone: mainPhone,
      delivery_address_name: currentList[0]?.delivery_address_name || '本社',
    }

    const firstItem = currentList[0]
    const isDifferent =
      !firstItem ||
      firstItem.delivery_address_code !==
        firstRecordData.delivery_address_code ||
      firstItem.post_code !== firstRecordData.post_code ||
      firstItem.address !== firstRecordData.address ||
      firstItem.phone !== firstRecordData.phone

    if (isDifferent) {
      const newList = [...currentList]
      if (newList.length === 0) {
        newList.push(firstRecordData)
      } else {
        newList[0] = { ...newList[0], ...firstRecordData }
      }

      form.setFieldValue('delivery_addresses', newList)
    }
  }, [customerCode, mainPostCode, mainAddress, mainBuilding, mainPhone, form])

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
        header={boldText(t('customers.show.delivery_destinations'))}
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
                scroll={undefined}
                columns={[
                  {
                    title: (
                      <span className={styles.tableTitle}>
                        {t('customers.delivery.code')}
                      </span>
                    ),
                    key: 'delivery_address_code',
                    width: '12%',
                    render: (field) => (
                      <Form.Item
                        name={[field.name, 'delivery_address_code']}
                        rules={[rule]}
                        noStyle
                        required
                      >
                        <Input style={{ width: '100%' }} disabled />
                      </Form.Item>
                    ),
                  },
                  {
                    title: requiredTableTitle(
                      t('customers.delivery.name'),
                      styles.tableTitle,
                    ),
                    key: 'name',
                    width: '16%',
                    onCell: () => ({
                      style: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        verticalAlign: 'left',
                      },
                    }),
                    render: (field, _, idx) => (
                      <Form.Item
                        name={[field.name, 'delivery_address_name']}
                        rules={[rule]}
                        required
                        noStyle
                      >
                        <Input
                          style={{
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textAlign: 'left',
                          }}
                          disabled={idx === 0}
                        />
                      </Form.Item>
                    ),
                  },
                  {
                    title: requiredTableTitle(
                      t('customers.delivery.post_code'),
                      styles.tableTitle,
                    ),
                    key: 'post_code',
                    width: '12%',
                    onCell: () => ({
                      style: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        verticalAlign: 'right',
                      },
                    }),
                    render: (field, _, idx) => (
                      <Form.Item
                        name={[field.name, 'post_code']}
                        rules={[rule]}
                        noStyle
                      >
                        <Input
                          style={{
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textAlign: 'right',
                          }}
                          disabled={idx === 0}
                        />
                      </Form.Item>
                    ),
                  },
                  {
                    title: requiredTableTitle(
                      t('customers.delivery.address'),
                      styles.tableTitle,
                    ),
                    key: 'address',
                    width: '28%',
                    onCell: () => ({
                      style: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        verticalAlign: 'left',
                      },
                    }),
                    render: (field, _, idx) => (
                      <Form.Item
                        name={[field.name, 'address']}
                        rules={[rule]}
                        noStyle
                        required
                      >
                        <Input
                          style={{
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textAlign: 'left',
                          }}
                          disabled={idx === 0}
                        />
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
                    width: '14%',
                    onCell: () => ({
                      style: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        verticalAlign: 'left',
                      },
                    }),
                    render: (field, _, idx) => (
                      <Form.Item
                        name={[field.name, 'phone']}
                        rules={[rule]}
                        noStyle
                      >
                        <Input
                          style={{
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textAlign: 'right',
                          }}
                          disabled={idx === 0}
                        />
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
                    width: '18%',
                    align: 'center',
                    render: (field, _, idx) => (
                      <Button
                        size="small"
                        disabled={idx === 0}
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
                    ),
                  },
                ]}
              />
              <Button
                type="primary"
                onClick={() => {
                  if (!customerCode) {
                    form.focusField('customer_code')
                    form.validateFields().then(() => {})
                  } else {
                    const currentValues =
                      form.getFieldValue('delivery_addresses') || []
                    const maxSuffix = currentValues.reduce(
                      (
                        max: number,
                        item: { delivery_address_code: string },
                      ) => {
                        if (!item || !item.delivery_address_code) return max
                        const parts = item.delivery_address_code.split('-')
                        const lastPart = parts[parts.length - 1]
                        const num = parseInt(lastPart, 10)
                        return !isNaN(num) && num > max ? num : max
                      },
                      0,
                    )

                    add({
                      delivery_address_code: `${customerCode}-${maxSuffix + 1}`,
                      delivery_address_name: null,
                      post_code: null,
                      address: null,
                      phone: null,
                    })
                  }
                }}
                className="float-right mt-4"
                autoInsertSpace={false}
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
