/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line simple-import-sort/imports */

import { Create } from '@components/crud/create'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Button, Form, Modal, Space } from 'antd'
import React from 'react'

import AddressContact from './address-contact'
import BasicInformation from './basic-information'
import CustomerContact from './customer-contact'
import { useCreateCustomerModal } from './use-create-customer-modal'

interface CustomerContactSelectionModalProps {
  open: boolean
  onClose: () => void
}
export default function CreateCustomerModal({
  open,
  onClose,
}: CustomerContactSelectionModalProps) {
  const {
    t,
    handleFinish,
    isLoading,
    saveButtonProps,
    formProps,
    initialValues,
  } = useCreateCustomerModal({ closeModal: onClose })

  return (
    <Modal
      title={boldText(t('customers.create.create'), PRIMARY)}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      styles={{
        body: {
          maxHeight: '80vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        },
      }}
    >
      <Create
        resource="customers"
        title={false}
        isLoading={isLoading}
        rightFooterButtons={
          <Button {...saveButtonProps} type="primary" htmlType={'submit'}>
            {t('buttons.create')}
          </Button>
        }
        isAutoHeading={false}
        hiddenButtonBack={true}
      >
        <Form
          {...formProps}
          onFinish={handleFinish}
          initialValues={initialValues}
          labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
          wrapperCol={{ xs: 24, sm: 16, md: 14 }}
          labelAlign="left"
          layout="horizontal"
          colon={false}
          autoComplete="off"
          scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
        >
          <Space size={30} direction={'vertical'} style={{ width: '100%' }}>
            <BasicInformation />
            <AddressContact />
            <CustomerContact />
          </Space>
        </Form>
      </Create>
    </Modal>
  )
}
