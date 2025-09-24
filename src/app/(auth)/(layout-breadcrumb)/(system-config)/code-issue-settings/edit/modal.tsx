/* eslint-disable */
import HashDashIcon from '@components/icons/hash-dash-icon'
import { useTranslate } from '@refinedev/core'
import { segmentOptions } from '@utility/options'
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import { Edit } from '@/components/crud/edit'
import { buildCodePreviewFromSetting } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/utils'
import ShowMoreInfo from '@components/common/show-more-info'
import { FORMAT_DATE_TIME } from '@utility/instances'

type Props = {
  modalProps: any
}

export const CodeIssueSettingEdit: React.FC<Props> = ({ modalProps }) => {
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
      i18nHeading={'code_issue_settings.edit.edit'}
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
          label={t('code_issue_settings.fields.name')}
          name="name"
          rules={[{ required: true }]}
        >
          {record?.name}
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.issue_method')}
          name="issue_method"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value="manual">
              {t('code_issue_settings.fields.enum_issue.manual')}
            </Radio>
            <Radio value="automatic">
              {t('code_issue_settings.fields.enum_issue.automatic')}
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.prefix')}
          name="prefix"
          rules={[{ required: true, message: t('validation.required') }]}
        >
          <Input placeholder="例: PD" disabled={isManual} />
        </Form.Item>

        <Form.Item
          label={<HashDashIcon />}
          valuePropName="checked"
          name="hash_dash"
        >
          <Checkbox disabled={isManual}>
            <Typography.Text>
              {t('code_issue_settings.fields.hash_dash_hint')}
            </Typography.Text>
          </Checkbox>
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.segment')}
          name="segment"
          rules={[{ required: true }]}
        >
          <Select
            placeholder={t('placeholders.select')}
            options={segmentOptions}
            disabled={isManual}
          />
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.serial_length')}
          name="serial_length"
          rules={[{ required: true }]}
        >
          <Select placeholder={t('placeholders.select')} disabled={isManual}>
            {[...Array(10)].map((_, i) => (
              <Select.Option key={i + 1} value={i + 1}>
                {i + 1}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={t('code_issue_settings.fields.total')} name="total">
          {record?.total}
        </Form.Item>

        <Form.Item
          label={t('code_issue_settings.fields.preview_code')}
          name="preview_code"
        >
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
                  dayjs(record?.created_at).format(FORMAT_DATE_TIME),
            },
            {
              title: t('common.updated_by'),
              value:
                record?.editor?.name ??
                '---' +
                  ' ' +
                  dayjs(record?.updated_at).format(FORMAT_DATE_TIME),
            },
          ]}
        />
      </Form>

      <Space className={'mt-4 flex w-full justify-end'}>
        <Button onClick={close}>{t('buttons.cancel')}</Button>
        <Button {...saveButtonProps} type="primary">
          {t('permission_settings.buttons.save')}
        </Button>
      </Space>
    </Edit>
  )
}
