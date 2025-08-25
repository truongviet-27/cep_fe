/* eslint-disable */
'use client'

import { RightOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { DeleteButton, useTable } from '@refinedev/antd'
import {
  useCreate,
  useResource,
  useTranslate,
  useUpdate,
} from '@refinedev/core'
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Switch,
  Table,
  Typography,
} from 'antd'
import React from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { PRIMARY } from '@utility/color'

const { Title } = Typography

type UnitRow = {
  id?: string
  name: string
  active: boolean
}

type FormValues = { tempRows: UnitRow[] }

export default function Page() {
  const t = useTranslate()
  const { resource } = useResource()

  // server table
  const { tableProps, tableQueryResult, searchFormProps } = useTable<UnitRow>({
    syncWithLocation: true,
  })

  // local temp rows
  const form = useForm<FormValues>({ defaultValues: { tempRows: [] } })
  const { control, getValues } = form
  const {
    fields: tempRows,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'tempRows',
    keyName: '__key',
  })

  const [savingDraftIndex, setSavingDraftIndex] = React.useState<number | null>(
    null,
  )
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [drafts, setDrafts] = React.useState<Record<string, Partial<UnitRow>>>(
    {},
  )

  const startEdit = (record: UnitRow) => {
    const id = String(record.id)
    setEditingId(id)
    setDrafts((prev) => ({
      ...prev,
      [id]: { name: record.name, active: record.active },
    }))
  }

  const cancelEdit = () => setEditingId(null)

  const setDraftName = (id: string, name: string) =>
    setDrafts((p) => ({ ...p, [id]: { ...(p[id] ?? {}), name } }))

  const setDraftActive = (id: string, active: boolean) =>
    setDrafts((p) => ({ ...p, [id]: { ...(p[id] ?? {}), active } }))

  // mutations
  const { mutate: createMutate } = useCreate()
  const { mutate: updateMutate, isLoading: updating } = useUpdate()

  const refetch = () => tableQueryResult?.refetch()

  const saveTempRow = (rowIndex: number) => {
    const row = getValues(`tempRows.${rowIndex}`) as UnitRow | undefined
    const name = row?.name?.trim()
    const active = row?.active ?? true
    if (!name) return

    setSavingDraftIndex(rowIndex)

    createMutate(
      {
        resource: resource?.name,
        values: { name, active },
      },
      {
        onSuccess: async () => {
          await tableQueryResult?.refetch?.()
          remove(rowIndex)
          setSavingDraftIndex(null)
        },
        onError: () => {
          setSavingDraftIndex(null)
        },
      },
    )
  }

  // server row -> update
  const saveServerRow = (record: UnitRow) => {
    const id = String(record.id)
    const draft = drafts[id] ?? {}
    const values: Partial<UnitRow> = {
      name: (draft.name ?? record.name)?.trim(),
      active: draft.active ?? record.active,
    }
    if (!values.name) {
      return
    }
    updateMutate(
      { resource: resource?.name, id, values },
      {
        onSuccess: () => {
          setEditingId(null)
          refetch()
        },
      },
    )
  }

  // dataSource: server rows + temp rows (nằm cuối)
  const serverRows = (tableProps.dataSource ?? []) as UnitRow[]
  const dataSource: UnitRow[] = React.useMemo(
    () => [...serverRows, ...tempRows.map((r) => ({ ...r, id: undefined }))],
    [serverRows, tempRows],
  )

  // UI
  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('system_config.system_config')}
        </Title>
      ),
    },
    { title: <Title level={5}>{t('product_units.product_units')}</Title> },
  ]

  const onAddDraft = () => append({ name: '', active: true })

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      createButtonProps={{ style: { display: 'none' } }}
    >
      <Form {...searchFormProps} layout="vertical" colon={false}>
        <Row
          align="middle"
          justify="space-between"
          wrap={false}
          gutter={[16, 16]}
          style={{ width: '100%' }}
        >
          <Col flex="auto">
            <Row align="middle" gutter={16} wrap={false}>
              <Col>
                <div style={{ fontWeight: 600 }}>単位名</div>
              </Col>
              <Col flex="360px">
                <Form.Item name="name" style={{ margin: 0 }}>
                  <Input placeholder="部分一致" allowClear />
                </Form.Item>
              </Col>
              <Col>
                <Space size="middle">
                  <Button htmlType="submit" type="primary">
                    検索
                  </Button>
                  <Button htmlType="reset">クリア</Button>
                </Space>
              </Col>
            </Row>
          </Col>

          <Col>
            <Button type="primary" onClick={onAddDraft}>
              新規登録
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Table */}
      <CommonTable
        {...tableProps}
        className="mt-6"
        dataSource={dataSource}
        rowKey={(r: any) => r.id ?? r.__key}
      >
        {/* 単位名 */}
        <Table.Column<UnitRow>
          title="単位名"
          dataIndex="name"
          render={(_, record: UnitRow, index: number) => {
            // temp row (no id) → RHF controlled
            if (!record.id) {
              const tempIndex = index - serverRows.length
              return (
                <Controller
                  control={control}
                  name={`tempRows.${tempIndex}.name` as const}
                  render={({ field }) => (
                    <Input {...field} placeholder="名称を入力" />
                  )}
                />
              )
            }
            // server row
            const id = String(record.id)
            if (editingId === id) {
              const val = (drafts[id]?.name ?? record.name) as string
              return (
                <Input
                  value={val}
                  onChange={(e) => setDraftName(id, e.target.value)}
                  placeholder="名称を入力"
                />
              )
            }
            return record.name
          }}
        />

        {/* 有効・無効 */}
        <Table.Column<UnitRow>
          width={'40%'}
          title="有効・無効"
          render={(_, record: UnitRow, index: number) => {
            if (!record.id) {
              const tempIndex = index - serverRows.length
              return (
                <Controller
                  control={control}
                  name={`tempRows.${tempIndex}.active` as const}
                  render={({ field }) => (
                    <Switch checked={field.value} onChange={field.onChange} />
                  )}
                />
              )
            }
            const id = String(record.id)
            const checked = (drafts[id]?.active ??
              record.active ??
              true) as boolean
            return (
              <Switch
                checked={checked}
                onChange={(v) => setDraftActive(id, v)}
                disabled={editingId !== id && editingId !== null}
              />
            )
          }}
        />

        {/* 操作 */}
        <Table.Column<UnitRow>
          width={260}
          title="操作"
          render={(_, record: UnitRow, index: number) => {
            if (!record.id) {
              const tempIndex = index - serverRows.length
              // const saving = creating // tạo đang chạy
              return (
                <Space>
                  <Button
                    type="primary"
                    loading={savingDraftIndex === tempIndex}
                    disabled={savingDraftIndex === tempIndex}
                    onClick={() => saveTempRow(tempIndex)}
                  >
                    保存
                  </Button>

                  <Button onClick={() => remove(tempIndex)}>キャンセル</Button>
                </Space>
              )
            }

            // server row
            const id = String(record.id)
            const isEditing = editingId === id
            if (isEditing) {
              return (
                <Space>
                  <Button
                    type="primary"
                    loading={updating}
                    onClick={() => saveServerRow(record)}
                  >
                    保存
                  </Button>
                  <Button onClick={cancelEdit}>キャンセル</Button>
                </Space>
              )
            }
            return (
              <Space>
                <Button type="default" onClick={() => startEdit(record)}>
                  編集
                </Button>
                <DeleteButton icon={null} size="middle" recordItemId={id}>
                  削除
                </DeleteButton>
              </Space>
            )
          }}
        />
      </CommonTable>
    </List>
  )
}
