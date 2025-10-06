/* eslint-disable @typescript-eslint/no-explicit-any */
import { getQuotaStatusStyle } from '@components/cep/estimates/quotas/utils'
import ShowMoreInfo from '@components/common/show-more-info'
import { useForm } from '@refinedev/antd'
import { useCreate, useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { FORMAT_DATE, FORMAT_DATE_TIME } from '@utility/instances'
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Row,
  Space,
  Tag,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo } from 'react'

function ModalAgreePrice({ data, close }: { data: any; close: () => void }) {
  const { formProps, form } = useForm()
  const t = useTranslate()

  const result = useMemo(() => {
    return getQuotaStatusStyle(data?.status)
  }, [data])

  useEffect(() => {
    if (data) {
      form.setFieldValue('created_at', dayjs(data?.created_at))
    }
  }, [data])

  const { mutate } = useCreate({
    resource: 'quota/agreed-prices',
  })

  const handleSubmit = (values: any) => {
    mutate(
      {
        values: {
          expiration_date: dayjs(values.expiration_date).format(
            FORMAT_DATE_TIME,
          ),
          quota_id: data?.id,
        },
      },
      {
        onSuccess: () => {
          close()
        },
      },
    )
  }

  return (
    <Form
      labelCol={{ xs: 24, sm: 8 }}
      wrapperCol={{ xs: 24 }}
      labelAlign="left"
      colon={false}
      style={{
        marginTop: 30,
      }}
      form={formProps.form}
      initialValues={{
        created_at: dayjs(),
      }}
      onFinish={handleSubmit}
    >
      <Row>
        <Col xs={24}>
          <Form.Item label={boldText('見積番号')}>
            {data?.code}
            <Tag
              color={result.background}
              style={{ color: result.color, marginRight: 0, marginLeft: 20 }}
            >
              {result.text}
            </Tag>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Form.Item label={boldText('タイトル')}>{data?.title}</Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Form.Item label={boldText('取引先')}>
            {data?.customer_name}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Form.Item label={boldText('適用開始日')} name={'created_at'}>
            <DatePicker style={{ width: '80%' }} placeholder={FORMAT_DATE} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Form.Item label={boldText('適用終了日')} name={'expiration_date'}>
            <DatePicker style={{ width: '80%' }} placeholder={FORMAT_DATE} />
          </Form.Item>
        </Col>
      </Row>

      <Divider />
      <ShowMoreInfo
        descriptions={[
          {
            title: t('approve_routes.show.creator'),
            value:
              (data?.author ?? '---') +
              ' ' +
              dayjs(data?.created_at).format('YYYY/MM/DD HH:mm'),
          },
          {
            title: t('approve_routes.show.updater'),
            value:
              (data?.editor ?? '---') +
              ' ' +
              dayjs(data?.updated_at).format('YYYY/MM/DD HH:mm'),
          },
        ]}
      />

      <Flex
        justify="end"
        style={{
          marginTop: 40,
        }}
      >
        <Space className="items-end">
          <Button type="default" onClick={close}>
            {t('buttons.cancel')}
          </Button>

          <Button type="primary" htmlType="submit">
            {t('buttons.save')}
          </Button>
        </Space>
      </Flex>
    </Form>
  )
}

export default ModalAgreePrice
