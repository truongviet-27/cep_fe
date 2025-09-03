'use client'

import { Show } from '@components/crud/show'
import { NumberField, TextField } from '@refinedev/antd'
import { useShow, useTranslate } from '@refinedev/core'
import { Col, Descriptions, Divider, Row, Space, Typography } from 'antd'
import dayjs from 'dayjs'

export default function DepartmentShow() {
  const t = useTranslate()
  const { queryResult } = useShow({
    resource: 'departments',
  })

  const { data, isLoading } = queryResult
  const record = data?.data
  const { Title, Text } = Typography

  return (
    <Show
      isLoading={isLoading}
      title={<Title level={5}>{t('departments.show.title')}</Title>}
      headerButtons={({ defaultButtons }) => <Space>{defaultButtons}</Space>}
    >
      <Descriptions bordered column={1} labelStyle={{ width: '200px' }}>
        <Descriptions.Item label={t('departments.fields.code')}>
          <TextField value={record?.code} />
        </Descriptions.Item>
        <Descriptions.Item label={t('departments.fields.name')}>
          <Space>
            <TextField value={record?.name} />
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label={t('departments.fields.employee_count')}>
          <NumberField value={record?.employee_count} />
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Text type="secondary">
            {`${t('departments.fields.created_by')}: `}
            {record?.created_by?.name}{' '}
            {record?.created_by?.date
              ? dayjs(record.created_by.date).format('YYYY/MM/DD HH:mm')
              : ''}
          </Text>
        </Col>
        <Col span={24}>
          <Text type="secondary">
            {`${t('departments.fields.updated_by')}: `}
            {record?.updated_by
              ? `${record.updated_by.name} ${dayjs(record.updated_by.date).format('YYYY/MM/DD HH:mm')}`
              : '---'}
          </Text>
        </Col>
      </Row>
    </Show>
  )
}
