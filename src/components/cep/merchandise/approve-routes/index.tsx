/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import CommonTable from '@components/common/table'
import {
  CreateButton,
  DeleteButton,
  EditButton,
  RefreshButton,
  ShowButton,
  useSelect,
  useTable,
} from '@refinedev/antd'
import type { BaseRecord, CrudFilters } from '@refinedev/core'
import { useGo, useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { GREEN, GREY_TAG, PRIMARY } from '@utility/color'
import { FORMAT_DATE } from '@utility/instances'
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
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo } from 'react'

function Approve() {
  const t = useTranslate()

  const { tableProps, searchFormProps, setFilters } = useTable({
    pagination: { pageSize: 20 },
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
      mode: 'server',
      pageSize: 100,
    },
  })

  const columns = useMemo(() => {
    return [
      {
        key: 'code',
        dataIndex: 'code',
        title: t('approve_routes.table.routeCode'),
        onCell: () => ({
          style: {
            width: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'wrap',
          },
        }),
        render: (value, record) => {
          return (
            <Button
              type="link"
              className="underline"
              title={value}
              onClick={() => {
                go({
                  to: `/approve-routes/show/${record.id}`,
                })
              }}
            >
              {value}
            </Button>
          )
        },
      },
      {
        key: 'name',
        dataIndex: 'name',
        title: t('approve_routes.table.routeName'),
        onCell: () => ({
          style: {
            maxWidth: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (value) => {
          return <span title={value}>{value}</span>
        },
      },
      {
        key: 'departments',
        dataIndex: 'departments',
        title: t('approve_routes.table.department'),
        ellipsis: true,
        onCell: () => ({
          style: {
            maxWidth: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (value) => {
          const text = value?.map((item: any) => item?.name).join(', ')
          return <span title={text}>{text}</span>
        },
      },

      {
        key: 'status',
        dataIndex: 'status',
        title: t('approve_routes.table.status'),
        render: (value) => {
          if (value === 'active')
            return <Tag color={GREEN}>{t('products.text.active')}</Tag>
          return <Tag color={GREY_TAG}>{t('products.text.inactive')}</Tag>
        },
      },
      {
        key: 'total_steps',
        dataIndex: 'total_steps',
        title: t('approve_routes.table.totalSteps'),
      },
      {
        key: 'author',
        dataIndex: 'author',
        title: t('approve_routes.table.creator'),
        render(value) {
          return value?.name
        },
      },
      {
        key: 'updated_at',
        dataIndex: 'updated_at',
        title: t('approve_routes.table.updatedAt'),
        render(value) {
          return dayjs(value).format(FORMAT_DATE)
        },
      },
      {
        key: 'action',
        dataIndex: 'action',
        title: t('approve_routes.table.action'),
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
              title: boldText(t('approve_routes.home')),
            },
            {
              title: boldText(t('approve_routes.list'), PRIMARY),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={t('approve_routes.list')}
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
            <Form.Item
              label={boldText(t('approve_routes.filters.searchLabel'))}
              name="q"
            >
              <Input
                className={'mt-2'}
                placeholder={t('departments.list.filters.search_placeholder')}
              />
            </Form.Item>
          </Col>
          <Col md={8} xl={4}>
            <Form.Item
              label={boldText(t('approve_routes.filters.departmentLabel'))}
              name="department"
            >
              <Select
                placeholder={t('approve_routes.filters.selectPlaceholder')}
                {...selectProps}
                onSearch={() => {}}
                filterOption={(input, option) =>
                  ((option?.label ?? '') as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                allowClear
              />
            </Form.Item>
          </Col>
          <Col md={8} xl={4}>
            <Form.Item
              label={boldText(t('approve_routes.filters.statusLabel'))}
              name="status"
            >
              <Select
                showSearch
                placeholder={t('approve_routes.filters.selectPlaceholder')}
              >
                <Select.Option value="active">
                  {t('approve_routes.status.active')}
                </Select.Option>
                <Select.Option value="inactive">
                  {t('approve_routes.status.inactive')}
                </Select.Option>
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
            <Space className="mt-4">
              <Button htmlType="submit" type="primary" autoInsertSpace={false}>
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
              <CreateButton
                type="primary"
                size="middle"
                onClick={() => {
                  go({
                    to: '/approve-routes/create',
                  })
                }}
                icon={null}
              >
                {t('buttons.registration')}
              </CreateButton>
            </Space>
          </Col>
        </Row>
      </Form>
      <CommonTable
        columns={columns}
        {...tableProps}
        onRow={(record) => ({
          className: record.status === 'inactive' ? 'bg-gray-200' : 'none',
        })}
      />
    </PageContainer>
  )
}

export default Approve
