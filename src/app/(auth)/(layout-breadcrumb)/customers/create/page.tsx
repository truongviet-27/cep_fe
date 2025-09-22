'use client'

import { RightOutlined } from '@ant-design/icons'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import AccountingContact from '@app/(auth)/(layout-breadcrumb)/customers/components/accounting-contact'
import AddressContact from '@app/(auth)/(layout-breadcrumb)/customers/components/address-contact'
import BasicInformation from '@app/(auth)/(layout-breadcrumb)/customers/components/basic-Information'
import { CorporateNumberSearchModal } from '@app/(auth)/(layout-breadcrumb)/customers/components/corporate-number-search-modal'
import { CorporateResearchFormSection } from '@app/(auth)/(layout-breadcrumb)/customers/components/corporate-research-form-section'
import DeliveryDestinations from '@app/(auth)/(layout-breadcrumb)/customers/components/delivery-destinations'
import { defaultCustomerCompanyResearchInformation } from '@app/(auth)/(layout-breadcrumb)/customers/components/instances'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useModal } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Button, Form, Modal, Space, Typography } from 'antd'
import React from 'react'

import { useCustomerCreate } from './use-customer-create'

const { Title } = Typography

export default function CustomerCreatePage() {
  const hookProps = useCustomerCreate()

  const { t, form, isLoading, onFinish, modalFormProps } = hookProps

  const { close: closeModal, open: modalOpen } = modalFormProps

  const { close, visible } = useModal()

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('customers.customers')}
        </Title>
      ),
    },
    { title: <Title level={5}>{t('customers.create.create')}</Title> },
  ]

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
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
    >
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          company_research_information:
            defaultCustomerCompanyResearchInformation,
        }}
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

          {/* Accounting Contact */}
          <AccountingContact {...hookProps} />

          {/* Delivery Destinations */}
          <DeliveryDestinations {...hookProps} />

          {/* Corporate Research Form Section */}
          <CorporateResearchFormSection {...hookProps} />
        </Space>
      </Form>

      <Modal open={modalOpen} onCancel={closeModal} footer={null}>
        <CodeIssueSettingEdit modalProps={modalFormProps} />
      </Modal>

      <Modal open={visible} onCancel={close} footer={null}>
        <CorporateNumberSearchModal modalProps={modalFormProps} />
      </Modal>
    </Create>
  )
}
