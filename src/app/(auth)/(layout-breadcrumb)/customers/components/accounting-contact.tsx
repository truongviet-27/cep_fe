import { DownOutlined } from '@ant-design/icons'
import type { useCustomerCreate } from '@app/(auth)/(layout-breadcrumb)/customers/create/use-customer-create'
import type { useCustomerEdit } from '@app/(auth)/(layout-breadcrumb)/customers/edit/[id]/use-customers-edit'
import styles from '@app/(auth)/(layout-breadcrumb)/customers/styles.module.css'
import boldText from '@utility/bold-text'
import { Button, Collapse, Form, Input } from 'antd'
import React from 'react'

const { Panel } = Collapse

function AccountingContact(
  props: ReturnType<typeof useCustomerCreate | typeof useCustomerEdit>,
) {
  const { t, rule, handleCopyContact, form } = props

  console.log(
    form.getFieldValue('person_in_charge_name'),
    'person_in_charge_name',
  )

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
          <Form.Item
            className={'!h-2'}
            label={boldText(t('customers.show.accounting_contact'))}
          >
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation()
                handleCopyContact()
              }}
              className={'!-ml-3 !underline'}
            >
              {t('buttons.copy_contact_info')}
            </Button>
          </Form.Item>
        }
        key="1"
        // extra={
        //   <Button type="link" onClick={handleCopyContact}>
        //     {t('buttons.copy_contact_info')}
        //   </Button>
        // }
      >
        <Form.Item
          label={boldText(t('customers.show.contact_name'))}
          name="person_in_charge_name"
          rules={[rule]}
          required
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>
        <Form.Item
          label={boldText(t('customers.show.contact_department'))}
          name="person_in_charge_department"
          rules={[rule]}
          required
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>
        <Form.Item
          label={boldText(t('customers.show.contact_email'))}
          name="person_in_charge_mail"
          rules={[rule]}
          required
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>
        <Form.Item
          label={boldText(t('customers.show.contact_phone'))}
          name="person_in_charge_phone"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>
      </Panel>
    </Collapse>
  )
}

export default AccountingContact
