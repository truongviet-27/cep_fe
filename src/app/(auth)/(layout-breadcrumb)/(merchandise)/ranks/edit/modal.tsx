/* eslint-disable */
import { useTranslate } from '@refinedev/core'
import { Button, Divider, Form, Input, Space, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import { Edit } from '@/components/crud/edit'
import ShowMoreInfo from '@components/common/show-more-info'
import boldText from '@utility/bold-text'
import { FORMAT_DATE_TIME } from '@utility/instances'

type Props = {
  modalProps: any
  isShow?: boolean
}

export const RankModalEdit: React.FC<Props> = ({
  modalProps,
  isShow = false,
}) => {
  const t = useTranslate()
  const { close, formProps, queryResult, saveButtonProps, formLoading, form } =
    modalProps

  const record = queryResult?.data?.data

  const getFieldData = (name: string) => (
    <Typography.Text>{form.getFieldValue(name)}</Typography.Text>
  )

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
        layout="horizontal"
        labelCol={{ span: 6 }}
        labelAlign="left"
        colon={false}
      >
        <Form.Item
          label={boldText(t('ranks.fields.code'))}
          name="code"
          rules={[{ required: true }]}
        >
          {isShow ? getFieldData('code') : <Input />}
        </Form.Item>

        <Form.Item
          label={boldText(t('ranks.fields.name'))}
          name="name"
          rules={[{ required: true }]}
        >
          {isShow ? getFieldData('name') : <Input />}
        </Form.Item>

        <Form.Item
          label={boldText(t('ranks.fields.rate'))}
          name="rate"
          rules={[{ required: true }]}
        >
          {isShow ? getFieldData('rate') : <Input />}
        </Form.Item>

        <Form.Item
          label={boldText(t('ranks.fields.remarks'))}
          name="note"
          rules={[{ required: true }]}
        >
          {isShow ? getFieldData('note') : <Input multiple />}
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

      <Space className={'flex w-full justify-end'}>
        <Button onClick={close}>{t('buttons.cancel')}</Button>
        <Button {...saveButtonProps} type="primary">
          {t('products.buttons.save')}
        </Button>
      </Space>
    </Edit>
  )
}
