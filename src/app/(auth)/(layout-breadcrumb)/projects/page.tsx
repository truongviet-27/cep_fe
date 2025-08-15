'use client'

import { RightOutlined, SearchOutlined } from '@ant-design/icons'
import { useTable } from '@refinedev/antd'
import { useGo } from '@refinedev/core'
import { Button, Col, Form, Input, Row, Space, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React from 'react'

import { CommonList } from '@/components/common/list'
import CommonTable from '@/components/common/table'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import type { IProject } from '@/interfaces/products'
import { PRIMARY } from '@/utility/color'

const { Text, Title } = Typography

export default function Page() {
  const t = useTranslations('projects.list')
  const t_prj = useTranslations('projects')

  const go = useGo()

  const { tableProps, searchFormProps } = useTable<IProject>({
    syncWithLocation: true,
  })

  const dataSource = tableProps?.dataSource || []

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t_prj('projects')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('title')}</Title>,
    },
  ]

  return (
    <CommonList
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
    >
      <h1 className="text-xl font-medium">{t('title')}</h1>

      <Form {...searchFormProps} layout="inline">
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col xs={12} sm={6} md={6}>
            <Form.Item name="q">
              <Input
                placeholder={t('filters.projectSearchPlaceholder')}
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Form.Item name="customer">
              <Input
                placeholder={t('filters.customerSearchPlaceholder')}
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={6} sm={4} md={3} style={{ textAlign: 'left' }}>
            <Space>
              <Button htmlType="submit" type="primary">
                {t('filters.search')}
              </Button>
              <Button onClick={() => searchFormProps.form?.resetFields()}>
                {t('filters.clear')}
              </Button>
            </Space>
          </Col>

          <Col xs={12} sm={12} md={9} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() =>
                  go({
                    to: '/projects/create',
                    type: 'push',
                  })
                }
              >
                {t('buttons.create')}
              </Button>
              <Button
                onClick={() =>
                  go({
                    to: '/projects/csv',
                    type: 'push',
                  })
                }
                type="primary"
              >
                {t('buttons.csvExport')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      <CommonTable
        className={'mt-6'}
        {...tableProps}
        dataSource={dataSource}
        rowKey="id"
        onRow={(record) => {
          return {
            onClick: () =>
              go({
                to: `/projects/show/${record.id}`,
                type: 'push',
              }),
            style: { cursor: 'pointer' },
          }
        }}
      >
        <Table.Column
          title={t('columns.projectCode')}
          dataIndex="projectCode"
          render={(value) => (
            <Link href={`/projects/${value}`}>
              <Text style={{ color: '#1677ff' }}>{value}</Text>
            </Link>
          )}
        />
        <Table.Column
          title={t('columns.projectName')}
          dataIndex="projectName"
        />
        <Table.Column title={t('columns.customer')} dataIndex="customer" />
        <Table.Column title={t('columns.registrant')} dataIndex="author" />
        <Table.Column
          title={t('columns.lastUpdated')}
          dataIndex="updatedDate"
          render={(value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')}
        />
      </CommonTable>
    </CommonList>
  )
}
