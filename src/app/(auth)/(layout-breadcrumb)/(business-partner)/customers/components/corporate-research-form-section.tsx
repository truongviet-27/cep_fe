/* eslint-disable */
import { DownOutlined } from '@ant-design/icons'
import type { useCustomerCreate } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/create/use-customer-create'
import CommonTable from '@components/common/table'
import {
  Button,
  Collapse,
  Form,
  message,
  Modal,
  Select,
  Space,
  Typography,
  type UploadFile,
} from 'antd'
import React from 'react'

import styles from '../styles.module.css'
import type { useCustomerEdit } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/edit/[id]/use-customers-edit'
import { useModal } from '@refinedev/core'
import { antiSocialCheckOptions, creditCheckOptions } from '@utility/options'
import { EditButton } from '@refinedev/antd'
import { InputUploadFile } from '@components/common/input-upload-file'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { defaultCustomerCompanyResearchInformation } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/instances'
import dayjs from 'dayjs'
import { FORMAT_DATE } from '@utility/instances'
import { useSession } from 'next-auth/react'

const { Title } = Typography
const { Panel } = Collapse

type CurrentType = {
  index: number
  type: 'credit' | 'anti-social' | 'certified' | 'contract'
  fileList: UploadFile[]
  judgement: string
  name: string
}

export const CorporateResearchFormSection = (
  props: ReturnType<typeof useCustomerCreate | typeof useCustomerEdit>,
) => {
  const { t, form } = props
  const session = useSession()

  const initCur: CurrentType = {
    index: 0,
    type: 'credit',
    fileList: [],
    judgement: '',
    name: '',
  }

  const [currentType, setCurrentType] = React.useState<CurrentType>(initCur)

  const modalForm = useModal()

  const { visible, show, close } = modalForm

  //make component force rerender to update the new values
  const formTrigger = () => setCurrentType(initCur)

  const handleClearAll = () => {
    const defaultVal = form
      .getFieldValue('company_research_information')
      .map((item: any, index: number) => {
        return {
          id: item?.id,
          material_name:
            defaultCustomerCompanyResearchInformation[index].material_name,
          judgement: defaultCustomerCompanyResearchInformation[index].judgement,
        }
      })

    form.setFieldValue('company_research_information', defaultVal)
  }

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
          {record.judgement == 'T' ? '△' : record.judgement}
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
            {record?.files?.map((file: any, index: number) => (
              <div key={file?.url ?? file.name ?? index}>{file.name}</div>
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
      render: (_: any, record: any) =>
        record.editor?.name ?? record.author?.name,
    },
    {
      title: (
        <span className={styles.tableTitle}>
          {t('customers.research.last_updated')}
        </span>
      ),
      key: 'updated_at',
      width: 180,
      render: (_: any, record: any) =>
        (record?.updated_at || record?.created_at) &&
        dayjs(record?.updated_at ?? record?.created_at ?? '').format(
          FORMAT_DATE,
        ),
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
            type="primary"
            icon={null}
            onClick={() => {
              let type: 'credit' | 'anti-social' | 'certified' | 'contract' =
                'credit'
              if (index === 1) {
                type = 'anti-social'
              } else if (index === 2) {
                type = 'certified'
              } else if (index === 3) {
                type = 'contract'
              }

              const fileList =
                form.getFieldValue([
                  'company_research_information',
                  index,
                  'files',
                ]) ?? []

              const judgement =
                form.getFieldValue([
                  'company_research_information',
                  index,
                  'judgement',
                ]) ?? ''

              setCurrentType({
                index,
                type,
                fileList,
                judgement,
                name: record.material_name,
              })
              show()
            }}
          >
            {t('buttons.edit')}
          </EditButton>
          <Button
            icon={null}
            danger
            size="small"
            onClick={() => {
              form.setFieldValue(['company_research_information', index], {
                id: record?.id,
                material_name: record.material_name,
                judgement: index === 0 || index === 1 ? '未定' : '-',
                files: [],
              })
              formTrigger()
            }}
          >
            {t('buttons.clear')}
          </Button>
        </Space>
      ),
    },
  ]

  const options = () => {
    switch (currentType.type) {
      case 'credit':
        return creditCheckOptions
      case 'anti-social':
        return antiSocialCheckOptions
      case 'certified':
        return []
      case 'contract':
        return []
    }
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
      <Panel header={boldText(t('customers.show.corporate_research'))} key="1">
        <Space
          size={20}
          style={{ width: '100%' }}
          direction={'vertical'}
          className={'pb-4'}
        >
          <Form.List name="company_research_information">
            {() => {
              return (
                <CommonTable
                  dataSource={form.getFieldValue(
                    'company_research_information',
                  )}
                  columns={columns as any}
                  rowKey="key"
                  bordered
                  pagination={false}
                />
              )
            }}
          </Form.List>

          <Space size={10} className="float-right mt-4">
            <Button danger onClick={handleClearAll}>
              {t('product_units.buttons.clear_all_research')}
            </Button>
          </Space>
        </Space>

        <Modal
          title={boldText(t('customers.research.modal.title'), PRIMARY)}
          open={visible}
          onOk={() => {
            if (
              currentType.fileList.some((item) => item.status == 'uploading')
            ) {
              message.warning(t('notifications.uploading'))
            } else {
              form.setFieldValue(
                ['company_research_information', currentType.index],
                {
                  ...form.getFieldValue([
                    'company_research_information',
                    currentType.index,
                  ]),
                  files: currentType.fileList,
                  judgement: currentType.judgement,
                  material_name: currentType.name,
                  updated_at: dayjs().format(FORMAT_DATE),
                  editor: {
                    name: session.data?.user?.name,
                  },
                },
              )
              close()
            }
          }}
          onCancel={close}
          okText={t('buttons.save')}
          cancelText={t('buttons.cancel')}
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ xl: 16 }}
            layout="horizontal"
            colon={false}
            style={{ paddingTop: 20 }}
          >
            <Form.Item label={boldText(t('customers.research.document_name'))}>
              <Typography.Text>
                {form.getFieldValue([
                  'company_research_information',
                  currentType.index,
                  'material_name',
                ])}
              </Typography.Text>
            </Form.Item>
            <Form.Item
              label={boldText(t('customers.research.judgement'))}
              name={`temp.${currentType.index}`}
            >
              {currentType.type !== 'certified' &&
              currentType.type !== 'contract' ? (
                <Select
                  allowClear
                  style={{ maxWidth: 235 }}
                  placeholder={t('placeholders.select')}
                  options={options()}
                  onSelect={(value) => {
                    const val = value == '△' ? 'T' : value
                    setCurrentType({ ...currentType, judgement: val })
                  }}
                />
              ) : (
                <Typography.Text>-</Typography.Text>
              )}
            </Form.Item>
            <Form.Item label={boldText(t('customers.research.file'))}>
              <InputUploadFile
                fileList={currentType.fileList}
                setFileList={(fileList) => {
                  setCurrentType({ ...currentType, fileList })
                }}
              />
            </Form.Item>
            <Typography.Text type="secondary">
              {t('common.updated_by')}:&nbsp;
              {
                form.getFieldValue([
                  'company_research_information',
                  currentType.index,
                ])?.author?.name
              }
              &nbsp;
              {form.getFieldValue([
                'company_research_information',
                currentType.index,
              ])?.updated_at &&
                dayjs(
                  form.getFieldValue([
                    'company_research_information',
                    currentType.index,
                  ])?.updated_at,
                ).format(FORMAT_DATE)}
            </Typography.Text>
          </Form>
        </Modal>
      </Panel>
    </Collapse>
  )
}
