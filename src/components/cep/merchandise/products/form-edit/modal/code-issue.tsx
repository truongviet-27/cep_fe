/* eslint-disable */
import { useTranslate } from '@refinedev/core'
import { Button, Divider, Form, Input, Select, Space, Tag } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import { Edit } from '@/components/crud/edit'
import { buildCodePreviewFromSetting } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/utils'
import ShowMoreInfo from '@components/common/show-more-info'

type Props = {
  modalProps: any
}

export const CategoryModal: React.FC<Props> = ({ modalProps }) => {
  const t = useTranslate()
  const { close, formProps, queryResult, saveButtonProps, formLoading, form } =
    modalProps

  const record = queryResult?.data?.data

  const issueMethod = Form.useWatch('issue_method', formProps.form)
  const isManual = issueMethod === 'manual'

  return (
    <Edit
      {...formProps}
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
      contentProps={{ style: { boxShadow: 'none' }, actions: undefined }}
      title={<></>}
      i18nHeading={'ranks.edit.edit'}
    >
      <Form
        {...formProps}
        initialValues={record}
        layout="horizontal"
        labelCol={{ span: 6 }}
        labelAlign="left"
        colon={false}
      >
        <Form.Item
          label={t('ranks.fields.code')}
          name="code"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('ranks.fields.name')}
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('ranks.fields.rate')}
          name="rate"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('ranks.fields.remarks')}
          name="remarks"
          rules={[{ required: true }]}
        >
          <Input multiple />
        </Form.Item>

        <Form.Item
          label={t('ranks.fields.serial_length')}
          name="serial_length"
          rules={[{ required: true }]}
        >
          <Select disabled={isManual}>
            {[...Array(10)].map((_, i) => {
              const value = i + 1
              // Skip value 1 (when i === 0)
              if (i != 0)
                return (
                  <Select.Option key={value} value={value}>
                    {value}
                  </Select.Option>
                )
            })}
          </Select>
        </Form.Item>

        <Form.Item label={t('ranks.fields.total')} name="total">
          {record?.total}
        </Form.Item>

        <Form.Item label={t('ranks.fields.preview_code')} name="preview_code">
          <Tag>{buildCodePreviewFromSetting(form.getFieldsValue())}</Tag>
        </Form.Item>

        <Divider />

        <ShowMoreInfo
          descriptions={[
            {
              title: t('common.created_by'),
              value:
                record?.author?.name ??
                '---' +
                  ' ' +
                  dayjs(record?.created_at).format('YYYY/MM/DD HH:mm'),
            },
            {
              title: t('common.updated_by'),
              value:
                record?.editor?.name ??
                '---' +
                  ' ' +
                  dayjs(record?.updated_at).format('YYYY/MM/DD HH:mm'),
            },
          ]}
        />
      </Form>

      <Space className={'flex w-full justify-end'}>
        <Button onClick={close}>{t('buttons.cancel')}</Button>
        <Button {...saveButtonProps} type="primary" autoInsertSpace={false}>
          {t('buttons.save')}
        </Button>
      </Space>
    </Edit>
  )
}
