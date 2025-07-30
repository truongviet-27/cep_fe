'use client'

import { RightOutlined, SearchOutlined } from '@ant-design/icons'
import { mockData } from '@app/(auth)/(layout-breadcrumb)/projects/mockData'
import CommonCard from '@components/common/common-card'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useTable } from '@refinedev/antd'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, Row, Space, Table, Typography } from 'antd'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React from 'react'

const { Text, Title } = Typography

interface IProject {
  key: string
  projectCode: string
  projectName: string
  customer: string
  registrant: string
  lastUpdated: string
}

export const ProjectPage: React.FC = () => {
  const t = useTranslations('projects.list')
  const t_breadcrumb = useTranslations('breadcrumb')

  const { tableProps, searchFormProps } = useTable<IProject>({
    syncWithLocation: true,
    queryOptions: {
      queryKey: ['mock-projects-list'],
      queryFn: async () => ({
        data: mockData,
        total: mockData.length,
      }),
    },
  })

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t_breadcrumb('projects')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('title')}</Title>,
    },
  ]

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      <CommonCard>
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
                <Button>{t('buttons.create')}</Button>
                <Button type="primary">{t('buttons.csvExport')}</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <Table {...tableProps} rowKey="key">
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
          <Table.Column
            title={t('columns.registrant')}
            dataIndex="registrant"
          />
          <Table.Column
            title={t('columns.lastUpdated')}
            dataIndex="lastUpdated"
          />
        </Table>
      </CommonCard>
    </>
  )
}
