'use client'

import { RightOutlined } from '@ant-design/icons'
import AddressContact from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/address-contact'
import BasicInformation from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/basic-Information'
import { CorporateNumberSearchModal } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/corporate-number-search-modal'
import { CorporateResearchFormSection } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/corporate-research-form-section'
import CustomerContacts from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/customer-contacts'
import DeliveryDestinations from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/delivery-destinations'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import { Edit } from '@components/crud/edit'
import Breadcrumbs from '@components/layout/breadcrumbs'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Button, Form, Modal, Space } from 'antd'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useCustomerEdit } from './use-customers-edit'

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
    { title: boldText(t('customers.edit.edit'), PRIMARY) },
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
        scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
      >
        <Space size={30} direction={'vertical'} style={{ width: '100%' }}>
          <BasicInformation {...hookProps} />
          <AddressContact {...hookProps} />
          <CustomerContacts {...hookProps} />
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
        maskClosable={false}
        footer={<Button onClick={close}>{t('buttons.cancel')}</Button>}
      >
        <CorporateNumberSearchModal
          key={corporateSearchKey}
          modalProps={modalFormProps}
          onSelect={(record) =>
            form.setFieldValue('corporate_number', record.corporateNumber)
          }
        />
      </Modal>
    </Edit>
  )
}
