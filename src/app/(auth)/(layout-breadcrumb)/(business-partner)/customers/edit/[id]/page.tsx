'use client'

import { RightOutlined } from '@ant-design/icons'
import AccountingContact from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/accounting-contact'
import AddressContact from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/address-contact'
import BasicInformation from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/basic-Information'
import { CorporateNumberSearchModal } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/corporate-number-search-modal'
import { CorporateResearchFormSection } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/corporate-research-form-section'
import DeliveryDestinations from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/delivery-destinations'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import { Edit } from '@components/crud/edit'
import Breadcrumbs from '@components/layout/breadcrumbs'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Button, Form, Modal, Space, Typography } from 'antd'
import React from 'react'

import { useCustomerEdit } from './use-customers-edit'

const { Title } = Typography

export default function CustomerEditPage() {
  const hookProps = useCustomerEdit()

  const {
    t,
    formProps,
    saveButtonProps,
    isLoading,
    modalFormProps,
    modalFormCorporate,
    handleFinish,
    form,
  } = hookProps
  const { close: closeModal, open: modalOpen } = modalFormProps

  const { close, visible } = modalFormCorporate

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
      saveButtonProps={saveButtonProps}
      rightFooterButtons={
        <Button {...saveButtonProps} type="primary" htmlType={'submit'}>
          {t('buttons.save')}
        </Button>
      }
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
    >
      <Form
        {...formProps}
        onFinish={handleFinish}
        labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
        wrapperCol={{ xs: 24, sm: 16, md: 14 }}
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

      <Modal
        title={boldText(t('customers.research.modal.title'), PRIMARY)}
        open={visible}
        onCancel={close}
        width={800}
        footer={<Button onClick={close}>{t('buttons.cancel')}</Button>}
      >
        <CorporateNumberSearchModal
          modalProps={modalFormProps}
          onSelect={(record) =>
            form.setFieldValue('corporate_number', record.corporateNumber)
          }
        />
      </Modal>
    </Edit>
  )
}
