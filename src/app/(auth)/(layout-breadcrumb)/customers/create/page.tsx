'use client'

import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import AccountingContact from '@app/(auth)/(layout-breadcrumb)/customers/create/components/accounting-contact'
import AddressContact from '@app/(auth)/(layout-breadcrumb)/customers/create/components/address-contact'
import BasicInformation from '@app/(auth)/(layout-breadcrumb)/customers/create/components/basic-Information'
import { CorporateNumberSearchModal } from '@app/(auth)/(layout-breadcrumb)/customers/create/components/corporate-number-search-modal'
import { CorporateResearchFormSection } from '@app/(auth)/(layout-breadcrumb)/customers/create/components/corporate-research-form-section'
import DeliveryDestinations from '@app/(auth)/(layout-breadcrumb)/customers/create/components/delivery-destinations'
import { Create } from '@components/crud/create'
import { Button, Form, Modal, Space } from 'antd'
import React from 'react'

import { useCustomerCreateForm } from './use-customer'

export default function CustomerCreatePage() {
  const hookProps = useCustomerCreateForm()

  const { t, form, isLoading, onFinish, modalFormProps } = hookProps

  const { close: closeModal, open: modalOpen } = modalFormProps

  return (
    <Create
      isLoading={isLoading}
      saveButtonProps={{
        onClick: () => form.submit(),
      }}
      rightFooterButtons={
        <Button
          type="primary"
          onClick={() => form.submit()}
          loading={isLoading}
        >
          {t('buttons.save')}
        </Button>
      }
    >
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
        wrapperCol={{ xs: 24, sm: 16, md: 14, lg: 12, xl: 10 }}
        labelAlign="left"
        layout="horizontal"
        colon={false}
        autoComplete="off"
      >
        <Space size={30} direction={'vertical'} style={{ width: '100%' }}>
          {/* Basic Information */}

          <BasicInformation {...hookProps} />

          {/* Address & Contact */}
          <AddressContact {...hookProps} />

          {/* Delivery Destinations */}
          <DeliveryDestinations {...hookProps} />

          {/* Accounting Contact */}
          <AccountingContact {...hookProps} />

          <CorporateResearchFormSection {...hookProps} />
        </Space>
      </Form>

      <Modal open={modalOpen} onCancel={closeModal} footer={null}>
        <CodeIssueSettingEdit modalProps={modalFormProps} />
      </Modal>

      <Modal open={modalOpen} onCancel={closeModal} footer={null}>
        <CorporateNumberSearchModal modalProps={modalFormProps} />
      </Modal>
    </Create>
  )
}
