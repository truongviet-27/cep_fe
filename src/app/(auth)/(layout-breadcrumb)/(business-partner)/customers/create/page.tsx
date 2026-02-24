'use client'
import { RightOutlined } from '@ant-design/icons'
import AddressContact from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/address-contact'
import BasicInformation from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/basic-Information'
import { CorporateNumberSearchModal } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/corporate-number-search-modal'
import { CorporateResearchFormSection } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/corporate-research-form-section'
import CustomerContacts from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/customer-contacts'
import DeliveryDestinations from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/delivery-destinations'
import { defaultCustomerCompanyResearchInformation } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/instances'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Button, Form, Modal, Space } from 'antd'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { useCustomerCreate } from './use-customer-create'

export default function CustomerCreatePage() {
  const hookProps = useCustomerCreate()

  const {
    t,
    formProps,
    isLoading,
    modalFormProps,
    saveButtonProps,
    modalFormCorporate,
    handleFinish,
    form,
  } = hookProps

  const { close: closeModal, open: modalOpen } = modalFormProps

  const { close, visible } = modalFormCorporate

  const [corporateSearchKey, setCorporateSearchKey] = useState(0)
  useEffect(() => {
    if (visible) setCorporateSearchKey((k) => k + 1)
  }, [visible])

  const breadcrumbItems = [
    {
      title: (
        <Link href="/customers">
          {boldText(t('business_partner.business_partner'))}
        </Link>
      ),
    },
    { title: boldText(t('customers.create.create'), PRIMARY) },
  ]

  return (
    <Create
      isLoading={isLoading}
      rightFooterButtons={
        <Button {...saveButtonProps} type="primary" htmlType={'submit'}>
          {t('buttons.create')}
        </Button>
      }
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
    >
      <Form
        {...formProps}
        onFinish={handleFinish}
        initialValues={{
          company_research_information:
            defaultCustomerCompanyResearchInformation,
          customer_code: null,
          name: null,
          department_in_charge_id: null,
          post_code: null,
          address: null,
          phone: null,
          mail: null,
          receivers: [
            {
              department_name: null,
              contact_person_name: null,
              email: null,
            },
          ],
        }}
        labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
        wrapperCol={{ xs: 24, sm: 16, md: 14 }}
        labelAlign="left"
        layout="horizontal"
        colon={false}
        autoComplete="off"
        scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
      >
        <Space size={30} direction={'vertical'} style={{ width: '100%' }}>
          {/* Basic Information */}

          <BasicInformation {...hookProps} />

          {/* Address & Contact */}
          <AddressContact {...hookProps} />

          {/* Customer Contacts (見積送付先情報) */}
          <CustomerContacts {...hookProps} />

          {/* Delivery Destinations */}
          <DeliveryDestinations {...hookProps} />

          {/* Corporate Research Form Section */}
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
        maskClosable={false}
        footer={<Button onClick={close}>{t('buttons.cancel')}</Button>}
      >
        <CorporateNumberSearchModal
          key={corporateSearchKey}
          modalProps={modalFormCorporate}
          onSelect={(record) =>
            form.setFieldValue('corporate_number', record.corporateNumber)
          }
        />
      </Modal>
    </Create>
  )
}
