/* eslint-disable */
import HashDashIcon from '@components/icons/hash-dash-icon'
import { useTranslate } from '@refinedev/core'
import { segmentOptions } from '@utility/options'
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import React, { useLayoutEffect, useMemo } from 'react'

import { Edit } from '@/components/crud/edit'
import { buildCodePreviewFromSetting } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/utils'
import ShowMoreInfo from '@components/common/show-more-info'
import { FORMAT_DATE_TIME } from '@utility/instances'
import AutoHeading from '@components/common/auto-heading'
import { validateCodeIssueSettingsRule } from '@validate/code-issue-settings'
import boldText from '@utility/bold-text'
import { PRIMARY, RED } from '@utility/color'

type Props = {
  modalProps: any
  refetchParent?: () => void
}

export const CodeIssueSettingEdit: React.FC<Props> = ({
  modalProps,
  refetchParent,
}) => {
  const t = useTranslate()
  const { close, formProps, queryResult, saveButtonProps, formLoading, form } =
    modalProps

  const record = queryResult?.data?.data

  const issueMethod = Form.useWatch('issue_method', form)
  const isManual = issueMethod === 'manual'
  const current_serial_number = Form.useWatch('current_serial_number', form)
  const segment = Form.useWatch('segment', form)
  const updated_at = Form.useWatch('updated_at', form)
  const serial_length = Form.useWatch('serial_length', form)
  const hash_dash = Form.useWatch('hash_dash', form)
  const prefix = Form.useWatch('prefix', form)

  const previewCode = useMemo(
    () =>
      buildCodePreviewFromSetting({
        current_serial_number,
        segment,
        updated_at,
        serial_length,
        hash_dash,
        prefix,
      }),
    [
      current_serial_number,
      segment,
      updated_at,
      serial_length,
      hash_dash,
      prefix,
    ],
  )

  const rule = validateCodeIssueSettingsRule(t)

  useLayoutEffect(() => {
    if (record) {
      form.setFieldsValue(record)
    }
  }, [record])

  return (
    <Edit
      {...formProps}
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
      contentProps={{
        style: { boxShadow: 'none' },
        actions: undefined,
      }}
      title={<></>}
      isAutoHeading={false}
    >
      <AutoHeading
        style={{ marginTop: -40, color: PRIMARY, fontSize: 20 }}
        i18n={'code_issue_settings.edit.edit'}
      />
      <Form
        {...formProps}
        initialValues={record}
        layout="horizontal"
        labelCol={{ span: 6 }}
        labelAlign="left"
        colon={false}
        style={{ marginTop: 30 }}
      >
        <Form.Item
          label={boldText(t('code_issue_settings.fields.name'))}
          name="name"
          rules={[rule]}
        >
          {record?.name}
        </Form.Item>

        <Form.Item
          label={boldText(t('code_issue_settings.fields.issue_method'))}
          name="issue_method"
          rules={[rule]}
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
          label={
            <Flex>
              {boldText(t('code_issue_settings.fields.prefix'))}
              &nbsp;
              <span style={{ color: RED }}>*</span>
            </Flex>
          }
          name="prefix"
          rules={[rule]}
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
          label={boldText(t('code_issue_settings.fields.segment'))}
          name="segment"
          rules={[rule]}
        >
          <Select
            placeholder={t('placeholders.select')}
            options={segmentOptions}
            disabled={isManual}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label={boldText(t('code_issue_settings.fields.serial_length'))}
          name="serial_length"
          rules={[rule]}
        >
          <Select
            allowClear
            placeholder={t('placeholders.select')}
            disabled={isManual}
          >
            {[...Array(10)].map((_, i) => (
              <Select.Option key={i + 1} value={i + 1}>
                {i + 1}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={boldText(t('code_issue_settings.fields.total'))}
          name="current_serial_number"
        >
          {record?.current_serial_number}
        </Form.Item>

        <Form.Item
          label={boldText(t('code_issue_settings.fields.preview_code'))}
          name="preview_code"
        >
          <Tag>{previewCode}</Tag>
        </Form.Item>

        <Divider />

        <ShowMoreInfo
          descriptions={[
            {
              title: t('common.created_by'),
              value:
                (record?.author?.name ?? '---') +
                ' ' +
                dayjs(record?.created_at).format('DD/MM/YYYY HH:mm'),
            },
            {
              title: t('common.updated_by'),
              value:
                (record?.editor?.name ?? '---') +
                ' ' +
                dayjs(record?.updated_at).format('DD/MM/YYYY HH:mm'),
            },
          ]}
        />
      </Form>

      <Space className={'mt-4 flex w-full justify-end'}>
        <Button onClick={close}>{t('buttons.cancel')}</Button>
        <Button
          {...saveButtonProps}
          onClick={async (e) => {
            await saveButtonProps.onClick?.(e)
            refetchParent?.()
          }}
          type="primary"
        >
          {t('permission_settings.buttons.save')}
        </Button>
      </Space>
    </Edit>
  )
}
