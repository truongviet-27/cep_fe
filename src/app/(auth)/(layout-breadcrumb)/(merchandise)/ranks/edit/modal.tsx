/* eslint-disable */
import { useTranslate } from '@refinedev/core'
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Space,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import { Edit } from '@/components/crud/edit'
import ShowMoreInfo from '@components/common/show-more-info'
import boldText from '@utility/bold-text'
import { FORMAT_DATE_TIME } from '@utility/instances'
import { DeleteButton } from '@refinedev/antd'
import { validateRankRule } from '@validate/rank'
import AutoHeading from '@components/common/auto-heading'

type Props = {
  modalFormProps: any
  isShow: boolean
  setIsShow: (isShow: boolean) => void
}

export const RankModalEdit: React.FC<Props> = ({
  modalFormProps,
  isShow,
  setIsShow,
}) => {
  const t = useTranslate()
  const { close, formProps, queryResult, saveButtonProps, formLoading, form } =
    modalFormProps

  const record = queryResult?.data?.data

  const getFieldData = (name: string) => (
    <Typography.Text>{form.getFieldValue(name)}</Typography.Text>
  )
  if (record) {
    form.setFieldsValue(record)
  }

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
      contentProps={{ style: { boxShadow: 'none' }, actions: undefined }}
      title={<></>}
      isAutoHeading={false}
    >
      <AutoHeading
        className={'!-mt-8'}
        i18n={isShow ? 'ranks.show.show' : 'ranks.edit.edit'}
      />

      <Form
        {...formProps}
        className={'!mt-10'}
        layout="horizontal"
        labelCol={{ span: 8 }}
        labelAlign="left"
        colon={false}
      >
        <Form.Item
          required={isShow ? undefined : true}
          label={boldText(t('ranks.fields.code'))}
        >
          <Flex>
            <Form.Item
              required={isShow ? undefined : true}
              name="code"
              rules={[validateRankRule(t)]}
            >
              {isShow ? (
                getFieldData('code')
              ) : (
                <Input style={{ width: '85%' }} />
              )}
            </Form.Item>
            &nbsp;
            {!isShow && (
              <div className={'mt-1'}>
                {t('products.validation.codeFormat')}
              </div>
            )}
          </Flex>
        </Form.Item>

        <Form.Item
          className={'!-mt-6'}
          required={isShow ? undefined : true}
          label={boldText(t('ranks.fields.name'))}
          name="name"
          rules={[validateRankRule(t)]}
        >
          {isShow ? getFieldData('name') : <Input style={{ width: '50%' }} />}
        </Form.Item>

        <Form.Item
          required={isShow ? undefined : true}
          label={boldText(t('ranks.fields.rate'))}
          name="rate"
          rules={[validateRankRule(t)]}
        >
          {isShow ? (
            getFieldData('rate')
          ) : (
            <InputNumber style={{ width: '50%' }} />
          )}
        </Form.Item>

        <Form.Item
          label={boldText(t('ranks.fields.remarks'))}
          name="note"
          rules={[validateRankRule(t)]}
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

      <Space className={'mt-4 flex w-full justify-between'}>
        <DeleteButton icon={null} size={'small'}>
          {t('buttons.delete')}
        </DeleteButton>
        <Space className={'flex justify-end'}>
          <Button
            onClick={() => {
              setIsShow(true)
              close()
            }}
          >
            {t('buttons.cancel')}
          </Button>
          {isShow ? (
            <Button
              onClick={() => {
                setIsShow(false)
              }}
              type="primary"
            >
              {t('products.buttons.edit')}
            </Button>
          ) : (
            <Button {...saveButtonProps} type="primary">
              {t('products.buttons.save')}
            </Button>
          )}
        </Space>
      </Space>
    </Edit>
  )
}
