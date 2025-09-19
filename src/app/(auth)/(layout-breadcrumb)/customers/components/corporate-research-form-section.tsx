/* eslint-disable */
import {
  DownOutlined,
  FileImageOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import type { useCustomerCreate } from '@app/(auth)/(layout-breadcrumb)/customers/create/use-customer-create'
import CommonTable from '@components/common/table'
import {
  Button,
  Collapse,
  Form,
  Modal,
  Select,
  Space,
  Typography,
  Upload,
} from 'antd'
import React from 'react'

import styles from '../styles.module.css'
import type { useCustomerEdit } from '@app/(auth)/(layout-breadcrumb)/customers/edit/[id]/use-customers-edit'
import { useModal } from '@refinedev/core'
import { antiSocialCheckOptions } from '@utility/options'
import { DeleteButton, EditButton } from '@refinedev/antd'

const { Title } = Typography
const { Panel } = Collapse

export const CorporateResearchFormSection = (
  props: ReturnType<typeof useCustomerCreate | typeof useCustomerEdit>,
) => {
  const { t, form, rule } = props

  const [currentType, setCurrentType] = React.useState<{
    index: number
    type: 'credit' | 'anti-social' | 'certified'
  } | null>()

  const modalForm = useModal()

  const { visible, show, close } = modalForm

  const columns = [
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.document_name')}
        </span>
      ),
      key: 'material_name',
      render: (field: any, record: any) => (
        <Form.Item name={[field.name, 'material_name']} noStyle>
          {record.material_name}
        </Form.Item>
      ),
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.judgement')}
        </span>
      ),
      key: 'judgement',
      width: 150,
      render: (field: any, record: any) => (
        <Form.Item name={[field.name, 'judgement']} noStyle initialValue="A">
          {record.judgement}
        </Form.Item>
      ),
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.file')}
        </span>
      ),
      key: 'files',
      render: (_: any, record: any) => {
        return (
          <>
            {record?.files?.map((file: any) => (
              <FileImageOutlined>{file}</FileImageOutlined>
            ))}
          </>
        )
      },
    },
    {
      title: (
        <span className={styles.tableTitle}>{t('common.updated_by')}</span>
      ),
      key: 'editor',
      width: 120,
      render: (_: any, record: any) => record.updated_by,
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.last_updated')}
        </span>
      ),
      key: 'updated_at',
      width: 180,
      render: (_: any, record: any) => record.updated_at,
    },
    {
      title: <span className={styles.tableTitle}>{t('table.actions')}</span>,
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: any, index: number) => (
        <Space>
          <EditButton
            size="small"
            hideText
            onClick={() => {
              let type: 'credit' | 'anti-social' | 'certified' = 'credit'
              if (index === 1) {
                type = 'anti-social'
              } else if (index === 2) {
                type = 'certified'
              }
              setCurrentType({ index, type })
            }}
          />
          <DeleteButton hideText danger size="small" />
        </Space>
      ),
    },
  ]

  const handleClearAll = () => {
    form.setFieldsValue({ company_research_information: [] })
  }

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
          <Title level={5}>{t('customers.show.corporate_research')}</Title>
        }
        key="1"
      >
        <Space
          size={20}
          style={{ width: '100%' }}
          direction={'vertical'}
          className={'pb-4'}
        >
          <CommonTable
            dataSource={form.getFieldValue('company_research_information')}
            columns={columns as any}
            rowKey="key"
            pagination={false}
            bordered
          />
          <Space size={10} className="float-right mt-4">
            <Button danger onClick={handleClearAll}>
              {t('product_units.buttons.clear_all_research')}
            </Button>
          </Space>
        </Space>

        <Modal
          title={t('customers.research.modal.title')}
          open={visible}
          onOk={close}
          onCancel={close}
          okText={t('buttons.save')}
          cancelText={t('buttons.cancel')}
          width={600}
        >
          <Form layout="vertical" className="mt-4">
            <Form.Item label={t('customers.research.document_name')}>
              <Typography.Text>
                {currentType &&
                  form.getFieldValue([
                    'company_research_information',
                    currentType.index,
                    'material_name',
                  ])}
              </Typography.Text>
            </Form.Item>
            <Form.Item
              label={t('customers.research.judgement')}
              name="judgement"
              rules={rule as any}
            >
              <Select
                placeholder={t('placeholders.select')}
                options={antiSocialCheckOptions}
                onSelect={(value) => {
                  currentType &&
                    form.setFieldValue(
                      [
                        'company_research_information',
                        currentType.index,
                        'judgement',
                      ],
                      value,
                    )
                }}
              />
            </Form.Item>
            <Form.Item
              label={t('customers.research.file')}
              name="files"
              valuePropName="fileList"
              // getValueFromEvent={normFile}
            >
              <Upload action="/api/upload" multiple>
                <Button icon={<UploadOutlined />}>
                  {t('buttons.select_file')}
                </Button>
              </Upload>
            </Form.Item>
            <Typography.Text type="secondary">
              {t('common.updated_by')}: 伊藤太郎 2025/08/04 12:30
            </Typography.Text>
          </Form>
        </Modal>
      </Panel>
    </Collapse>
  )
}
