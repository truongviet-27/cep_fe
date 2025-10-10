/* eslint-disable @typescript-eslint/no-explicit-any */
import { getQuotaStatusStyle } from '@components/cep/estimates/quotas/utils'
import ShowMoreInfo from '@components/common/show-more-info'
import { useForm } from '@refinedev/antd'
import { useCreate, useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
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
    return getQuotaStatusStyle(data?.status, t)
  }, [data, t])

  useEffect(() => {
    form.setFieldValue('valid_from', dayjs())
  }, [form])

  const { mutate } = useCreate({
    resource: 'quota/agreed-prices',
  })

  const handleSubmit = (values: any) => {
    const payload: any = {
      quota_id: data?.id,
      valid_from: values?.valid_from
        ? dayjs(values.valid_from).format('YYYY/MM/DD')
        : undefined,
    }

    if (values?.valid_to) {
      payload.valid_to = dayjs(values.valid_to).format('YYYY/MM/DD')
    }

    mutate(
      { values: payload },
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
      initialValues={{}}
      onFinish={handleSubmit}
    >
      <Row>
        <Col xs={24}>
          <Form.Item
            label={boldText(t('quotas.modal.agreed_price.estimate_number'))}
          >
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
          <Form.Item
            label={boldText(t('quotas.modal.agreed_price.title_label'))}
          >
            {data?.title}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Form.Item label={boldText(t('quotas.modal.agreed_price.customer'))}>
            {data?.customer_name}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Form.Item
            label={boldText(t('quotas.modal.agreed_price.valid_from'))}
            name={'valid_from'}
            rules={[
              {
                required: true,
                message: t('quotas.modal.agreed_price.required'),
              },
            ]}
          >
            <DatePicker
              style={{ width: '80%' }}
              placeholder={'YYYY/MM/DD'}
              format={'YYYY/MM/DD'}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Form.Item
            label={boldText(t('quotas.modal.agreed_price.valid_to'))}
            name={'valid_to'}
          >
            <DatePicker
              style={{ width: '80%' }}
              placeholder={'YYYY/MM/DD'}
              format={'YYYY/MM/DD'}
            />
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
