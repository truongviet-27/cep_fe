/* eslint-disable */
'use client'

import { RightOutlined, SearchOutlined } from '@ant-design/icons'
import TableDnd from '@components/common/table-dnd'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import {
  CreateButton,
  DateField,
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from '@refinedev/antd'
import {
  BaseRecord,
  useApiUrl,
  useCustomMutation,
  useGo,
  useNotification,
  useResource,
  useTranslate,
} from '@refinedev/core'
import { Department, PermissionEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { DEPARTMENT_DEFAULT } from '@utility/constant'
import { CSV_LINK, PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

const { Title, Text } = Typography

type RowVM = Department & { __index: number }

export default function Page() {
  const t = useTranslate()
  const { hasFullAccessModule } = useUserStore.getState()
  const { resource } = useResource()
  const isEditPermission = hasFullAccessModule(PermissionEnum.DEPARTMENT_EDIT)

  const { tableProps, searchFormProps, setFilters } = useTable<Department>({
    pagination: { pageSize: 20 },
    syncWithLocation: true,
    onSearch: (values: any) => [
      {
        field: 'q',
        operator: 'null',
        value: values?.q,
      },
    ],
  })

  const go = useGo()

  const [rows, setRows] = useState<Department[]>([])
  const originalOrderRef = useRef<string[]>([])

  useEffect(() => {
    const ds = (tableProps?.dataSource as Department[]) ?? []
    setRows(ds)
    originalOrderRef.current = ds.map((r) => String(r.id))
  }, [tableProps?.dataSource])

  const getRowId = (r: Department) => String(r.id)

  const onDragEnd = (activeId: string, overId: string | null) => {
    if (!overId || activeId === overId) return
    setRows((prev) => {
      const from = prev.findIndex((r) => getRowId(r) === activeId)
      const to = prev.findIndex((r) => getRowId(r) === overId)
      if (from === -1 || to === -1 || from === to) return prev
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  const isDirty = useMemo(() => {
    const current = rows.map((r) => String(r.id))
    const orig = originalOrderRef.current
    if (current.length !== orig.length) return true
    for (let i = 0; i < current.length; i++)
      if (current[i] !== orig[i]) return true
    return false
  }, [rows])

  const apiUrl = useApiUrl()
  const { mutate: updateAll, isLoading: savingAll } = useCustomMutation()
  const { open: openNotification } = useNotification()

  const handleUpdateOrdering = (
    values: {
      id?: string | number
      order: number
    }[],
  ) => {
    updateAll(
      {
        url: `${apiUrl}/${resource?.name}/ordering`,
        method: 'post',
        values: { data: values },
      },
      {
        onSuccess: (data) => {
          openNotification?.({
            type: 'success',
            message: t('notifications.success'),
            description: t('notifications.success'),
          })
        },
      },
    )
  }

  const onSaveAll = () => {
    const maxOrder = rows.reduce((max, r) => Math.max(max, r.order ?? 0), 0)

    const values = rows.map((r, index) => ({
      id: r.id,
      order: maxOrder - index,
    }))
    if (!values.length) return

    handleUpdateOrdering(values)
  }

  const columns: ColumnsType<RowVM> = [
    {
      dataIndex: 'code',
      title: (
        <div style={{ textAlign: 'center' }}>
          {t('departments.fields.code')}
        </div>
      ),
      width: '8%',
      render: (value, record) => {
        return (
          <Link
            style={{ textDecoration: 'underline' }}
            href={`/departments/show/${record?.id}`}
          >
            {value}
          </Link>
        )
      },
    },
    {
      dataIndex: 'name',
      title: (
        <div style={{ textAlign: 'center' }}>
          {t('departments.fields.name')}
        </div>
      ),
      align: 'left',
    },
    {
      dataIndex: 'number_of_employee',
      title: (
        <div style={{ textAlign: 'center' }}>
          {t('departments.fields.number_of_employee')}
        </div>
      ),
      align: 'right',
      width: '4%',
    },
    {
      dataIndex: 'author',
      title: (
        <div style={{ textAlign: 'center' }}>{t('common.created_by')}</div>
      ),
      align: 'left',
      width: '19%',
      render: (value: any) => {
        return value?.name || '---'
      },
    },
    {
      dataIndex: 'editor',
      title: (
        <div style={{ textAlign: 'center' }}>{t('common.updated_by')}</div>
      ),
      align: 'left',
      width: '19%',
      render: (value: any) => {
        return value?.name || '---'
      },
    },
    {
      dataIndex: 'created_at',
      title: (
        <div style={{ textAlign: 'center' }}>
          {t('departments.fields.created_at')}
        </div>
      ),
      width: '7%',
      render: (value: any) => <DateField value={value} format="YYYY/MM/DD" />,
    },
    {
      dataIndex: 'updated_at',
      title: (
        <div style={{ textAlign: 'center' }}>
          {t('departments.fields.updated_at')}
        </div>
      ),
      width: '7%',
      render: (value: any) => <DateField value={value} format="YYYY/MM/DD" />,
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('table.actions')}</div>,
      dataIndex: 'actions',
      width: '8%',
      onCell: () => ({
        style: { padding: '2px 2px', overflow: 'hidden', minWidth: 0 },
      }),
      render: (_: any, record: BaseRecord) => {
        const isDefaultDepartment =
          (record as Department).name === DEPARTMENT_DEFAULT
        return (
          <Space wrap size={4}>
            <ShowButton
              autoInsertSpace={false}
              size="small"
              icon={null}
              recordItemId={record.id}
              resource="departments"
              style={{
                color: isDefaultDepartment ? '#999999' : '#2784FF',
                borderColor: isDefaultDepartment ? '#d9d9d9' : '#2784FF',
              }}
              disabled={isDefaultDepartment}
            >
              {t('buttons.show')}
            </ShowButton>
            <EditButton
              autoInsertSpace={false}
              size="small"
              icon={null}
              recordItemId={record.id}
              resource="departments"
              disabled={isDefaultDepartment}
              style={{
                color: isDefaultDepartment ? '#999999' : '#FFFFFF',
                background: isDefaultDepartment ? '#d9d9d9' : '#1FDB51',
                borderColor: isDefaultDepartment ? '#d9d9d9' : '#1FDB51',
              }}
            >
              {t('buttons.edit')}
            </EditButton>
            <DeleteButton
              autoInsertSpace={false}
              size="small"
              icon={null}
              recordItemId={record.id}
              resource="departments"
              disabled={isDefaultDepartment}
              style={{
                color: isDefaultDepartment ? '#999999' : '#FFFFFF',
                background: isDefaultDepartment ? '#d9d9d9' : '#E74C3C',
                borderColor: isDefaultDepartment ? '#d9d9d9' : '#E74C3C',
              }}
            >
              {t('buttons.delete')}
            </DeleteButton>
          </Space>
        )
      },
    },
  ]

  const breadcrumbItems = [
    {
      title: boldText(t('departments.departments')),
    },
    {
      title: boldText(t('departments.list.list'), PRIMARY),
    },
  ]

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={t('departments.list.list')}
      footer={
        <Col>
          <Button
            type="primary"
            onClick={onSaveAll}
            loading={savingAll}
            disabled={!isDirty}
          >
            {t('buttons.save_all', { defaultValue: '並び順を保存' })}
          </Button>
        </Col>
      }
    >
      <Form {...searchFormProps} layout="inline">
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col xs={12} sm={6} md={6}>
            <Text strong>{t('departments.list.filters.search_label')}</Text>
            <Form.Item
              name="q"
              validateTrigger={['onChange', 'onBlur']}
              rules={[
                {
                  max: 100,
                  message: 'コード名は100文字以内で入力してください',
                },
              ]}
            >
              <Input
                className={'mt-2'}
                placeholder={t('departments.list.filters.search_placeholder')}
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={6} sm={4} md={6} style={{ textAlign: 'left' }}>
            <Space className={'mt-[30px]'}>
              <Button htmlType="submit" type="primary" autoInsertSpace={false}>
                {t('buttons.search')}
              </Button>
              <Button
                type="default"
                onClick={() => {
                  searchFormProps.form?.resetFields()
                  setFilters([], 'replace')
                }}
              >
                {t('buttons.clear')}
              </Button>
            </Space>
          </Col>
          <Col xs={12} sm={12} md={12} style={{ textAlign: 'right' }}>
            <div className={'h-[32px]'} />
            <div className="flex flex-col items-end">
              <CreateButton
                icon={null}
                type="primary"
                autoInsertSpace={false}
                disabled={!isEditPermission}
              >
                {t('buttons.create_new')}
              </CreateButton>
              <Button
                type="link"
                disabled={!isEditPermission}
                onClick={() => {
                  go({
                    to: '/departments/csv',
                  })
                }}
                style={{ padding: 0, color: CSV_LINK }}
                className={'!underline'}
              >
                {t('projects.csv_upload.title')}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>

      <TableDnd<RowVM>
        tableProps={tableProps}
        dataSource={rows.map((r, i) => ({ ...r, __index: i }))}
        columns={columns}
        getRowId={(r) => getRowId(r)}
        onDragEnd={onDragEnd}
      />
    </List>
  )
}
