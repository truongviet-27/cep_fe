/* eslint-disable */
import { DownOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { Collapse, Form, Space } from 'antd'
import React from 'react'
import styles from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/styles.module.css'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import dayjs from 'dayjs'
import { FORMAT_DATE } from '@utility/instances'

const { Panel } = Collapse

export default function CorporateResearch() {
  const t = useTranslate()
  const form = Form.useFormInstance()

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
  ]

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
        </Space>
      </Panel>
    </Collapse>
  )
}
