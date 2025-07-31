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

export const DepartmentPage: React.FC = () => {
  const t = useTranslations('departments.list')
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
          {t_breadcrumb('departments')}
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
        <h1 className="mb-6 text-xl font-medium">{t('title')}</h1>

        <Form {...searchFormProps} layout="inline">
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col xs={12} sm={6} md={6}>
              <Form.Item name="q">
                <Input
                  placeholder={t('filters.searchPlaceholder')}
                  prefix={<SearchOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={6} sm={4} md={6} style={{ textAlign: 'left' }}>
              <Space>
                <Button htmlType="submit" type="primary">
                  {t('filters.search')}
                </Button>
                <Button onClick={() => searchFormProps.form?.resetFields()}>
                  {t('filters.clear')}
                </Button>
              </Space>
            </Col>

            <Col xs={12} sm={12} md={12} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary">{t('buttons.create')}</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <Table {...tableProps} rowKey="key">
          <Table.Column
            title={t('columns.departmentCode')}
            dataIndex="departmentCode"
            render={(value) => (
              <Link href={`/departments/${value}`}>
                <Text style={{ color: '#1677ff' }}>{value}</Text>
              </Link>
            )}
          />
          <Table.Column
            title={t('columns.departmentName')}
            dataIndex="departmentName"
          />
          <Table.Column
            title={t('columns.registrant')}
            dataIndex="registrant"
          />
          <Table.Column title={t('columns.remarks')} dataIndex="remarks" />
        </Table>
      </CommonCard>
    </>
  )
}
