/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import CommonTable from '@components/common/table'
import {
  DeleteButton,
  EditButton,
  RefreshButton,
  ShowButton,
  useSelect,
  useTable,
} from '@refinedev/antd'
import type { BaseRecord, CrudFilters } from '@refinedev/core'
import { Link, useGo, useTranslate } from '@refinedev/core'
import { GREY, PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'

const { Title } = Typography

function Approve() {
  const t = useTranslate()

  const { tableProps, searchFormProps, setFilters } = useTable({
    syncWithLocation: true,
    onSearch: (values: any) => {
      setFilters([], 'replace')
      const filters = [] as CrudFilters

      if (values.q) {
        filters.push({
          field: 'q',
          operator: 'contains',
          value: values.q,
        })
      }

      if (values.department) {
        filters.push({
          field: 'department_id',
          operator: 'eq',
          value: values.department,
        })
      }

      if (values.status) {
        filters.push({
          field: 'status',
          operator: 'eq',
          value: values.status,
        })
      }

      return filters
    },
  })

  const { selectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'off',
    },
  })

  const columns = useMemo(() => {
    return [
      {
        key: 'code',
        dataIndex: 'code',
        title: 'ルートコード',
        render: (value, record) => {
          return <Link to={`/approve-routes/show/${record.id}`}>{value}</Link>
        },
      },
      {
        key: 'name',
        dataIndex: 'name',
        title: 'ルート名',
      },
      {
        key: 'department_name',
        dataIndex: 'department_name',
        title: '部門（支社/部/課）',
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: 'ステータス',
        render: (value) => {
          if (value === 'active')
            return <Tag color={PRIMARY}>{t('products.text.active')}</Tag>
          return <Tag color={GREY}>{t('products.text.inactive')}</Tag>
        },
      },
      {
        key: 'total_steps',
        dataIndex: 'total_steps',
        title: '承認ステップ数',
      },
      {
        key: 'author',
        dataIndex: 'author',
        title: '作成者',
      },
      {
        key: 'updated_at',
        dataIndex: 'updated_at',
        title: '最終更新日',
      },
      {
        key: 'action',
        dataIndex: 'action',
        title: '操作',
        render: (_: any, record: BaseRecord) => {
          return (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )
        },
      },
    ] as ColumnsType
  }, [t])

  const go = useGo()

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('merchandise.merchandise')}
                </Title>
              ),
            },
            {
              title: (
                <Title level={5}>{t('approve_routes.approve_routes')}</Title>
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={t('approve_routes.approve_routes')}
    >
      <Form
        {...searchFormProps}
        layout="vertical"
        style={{
          marginBottom: '10px',
        }}
      >
        <Row gutter={[16, 16]}>
          <Col md={8} xl={4}>
            <Form.Item label="ルートコード・ルート名" name="q">
              <Input
                className={'mt-2'}
                placeholder={t('departments.list.filters.search_placeholder')}
              />
            </Form.Item>
          </Col>
          <Col md={8} xl={4}>
            <Form.Item label="部門 (支社/部/課)" name="department">
              <Select placeholder="選択してください" {...selectProps} />
            </Form.Item>
          </Col>
          <Col md={8} xl={4}>
            <Form.Item label="ステータス" name="status">
              <Select showSearch placeholder="選択してください">
                <Select.Option value="active">有効</Select.Option>
                <Select.Option value="inactive">無効</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col
            md={24}
            xl={12}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Space className="mt-[3px]">
              <Button htmlType="submit" type="primary">
                {t('buttons.search')}
              </Button>
              <RefreshButton
                size="middle"
                icon={null}
                onClick={() => {
                  searchFormProps.form?.resetFields()
                  setFilters([], 'replace')
                }}
              >
                {t('buttons.clear')}
              </RefreshButton>
            </Space>

            <Space className="mt-[3px] ml-2">
              <Button
                type="primary"
                size="middle"
                onClick={() => {
                  go({
                    to: '/approve-routes/create',
                  })
                }}
              >
                {t('buttons.add')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <CommonTable columns={columns} {...tableProps} isPagination={true} />
    </PageContainer>
  )
}

export default Approve
