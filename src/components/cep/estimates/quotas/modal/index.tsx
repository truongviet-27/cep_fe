/* eslint-disable @typescript-eslint/no-explicit-any */
import { getQuotaStatusStyle } from '@components/cep/estimates/quotas/utils'
import ShowMoreInfo from '@components/common/show-more-info'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { FORMAT_DATE } from '@utility/instances'
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
import { useMemo } from 'react'

function ModalAgreePrice({ data, close }: { data: any; close: () => void }) {
  const t = useTranslate()

  const result = useMemo(() => {
    return getQuotaStatusStyle(data?.status)
  }, [data])

  return (
    <Form
      labelCol={{ xs: 24, sm: 8 }}
      wrapperCol={{ xs: 24 }}
      labelAlign="left"
      colon={false}
      style={{
        marginTop: 30,
      }}
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
          <Form.Item label={boldText('適用開始日')}>
            <DatePicker style={{ width: '80%' }} placeholder={FORMAT_DATE} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Form.Item label={boldText('適用終了日')}>
            <DatePicker style={{ width: '80%' }} placeholder={FORMAT_DATE} />
          </Form.Item>
        </Col>
      </Row>

      <Divider />
      <ShowMoreInfo
        descriptions={[
          {
            title: t('approve_routes.show.creator'),
            value: '---' + ' ',
          },
          {
            title: t('approve_routes.show.updater'),
            value: '---' + ' ',
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

          <Button type="primary" onClick={() => {}}>
            {t('buttons.save')}
          </Button>
        </Space>
      </Flex>
    </Form>
  )
}

export default ModalAgreePrice
