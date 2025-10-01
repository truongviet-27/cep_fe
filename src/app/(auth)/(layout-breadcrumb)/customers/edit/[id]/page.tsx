'use client'

import { RightOutlined } from '@ant-design/icons'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import AccountingContact from '@app/(auth)/(layout-breadcrumb)/customers/components/accounting-contact'
import AddressContact from '@app/(auth)/(layout-breadcrumb)/customers/components/address-contact'
import BasicInformation from '@app/(auth)/(layout-breadcrumb)/customers/components/basic-Information'
// Import các component con, không thay đổi
import { CorporateResearchFormSection } from '@app/(auth)/(layout-breadcrumb)/customers/components/corporate-research-form-section'
import DeliveryDestinations from '@app/(auth)/(layout-breadcrumb)/customers/components/delivery-destinations'
import { Edit } from '@components/crud/edit'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { PRIMARY } from '@utility/color'
import { Button, Form, Modal, Space, Typography } from 'antd'
import React from 'react'

import { useCustomerEdit } from './use-customers-edit'

const { Title } = Typography

export default function CustomerEditPage() {
  const hookProps = useCustomerEdit()

  const { t, formProps, saveButtonProps, isLoading, modalFormProps } = hookProps
  const { close: closeModal, open: modalOpen } = modalFormProps

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('business_partner.business_partner')}
        </Title>
      ),
    },
    { title: <Title level={5}>{t('customers.edit.edit')}</Title> },
  ]

  return (
    <Edit
      isLoading={isLoading}
      rightFooterButtons={
        <Button {...saveButtonProps} type="primary">
          {t('buttons.save')}
        </Button>
      }
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
    >
      <Form
        {...formProps}
        labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
        wrapperCol={{ xs: 24, sm: 16, md: 14, lg: 12, xl: 10 }}
        labelAlign="left"
        layout="horizontal"
        colon={false}
        autoComplete="off"
      >
        <Space size={30} direction={'vertical'} style={{ width: '100%' }}>
          <BasicInformation {...hookProps} />
          <AddressContact {...hookProps} />
          <AccountingContact {...hookProps} />
          <DeliveryDestinations {...hookProps} />
          <CorporateResearchFormSection {...hookProps} />
        </Space>
      </Form>

      <Modal open={modalOpen} onCancel={closeModal} footer={null}>
        <CodeIssueSettingEdit modalProps={modalFormProps} />
      </Modal>

      {/* Logic cho modal tìm kiếm corporate number cũng có thể được thêm vào hook nếu cần */}
      {/* <CorporateNumberSearchModal modalProps={...} /> */}
    </Edit>
  )
}
