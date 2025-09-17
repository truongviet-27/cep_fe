/* eslint-disable */
import { useTranslate } from '@refinedev/core'
import { Button, Divider, Form, Space } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import { Edit } from '@/components/crud/edit'
import ShowMoreInfo from '@components/common/show-more-info'
import { FORMAT_DATE_TIME } from '@utility/instances'

type Props = {
  modalProps: any
}

export const RankModalView: React.FC<Props> = ({ modalProps }) => {
  const t = useTranslate()
  const { close, formProps, queryResult, saveButtonProps, formLoading } =
    modalProps

  const record = queryResult?.data?.data

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
        labelCol={{ span: 10 }}
        labelAlign="left"
        colon={false}
      >
        <Form.Item
          label={t('ranks.fields.code')}
          name="code"
          rules={[{ required: true }]}
        >
          {record?.code}
        </Form.Item>

        <Form.Item
          label={t('ranks.fields.name')}
          name="name"
          rules={[{ required: true }]}
        >
          {record?.name}
        </Form.Item>

        <Form.Item
          label={t('ranks.fields.rate')}
          name="rate"
          rules={[{ required: true }]}
        >
          {record?.rate}
        </Form.Item>

        <Form.Item
          label={t('ranks.fields.remarks')}
          name="note"
          rules={[{ required: true }]}
        >
          {record?.note}
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
          {t('buttons.save')}
        </Button>
      </Space>
    </Edit>
  )
}
