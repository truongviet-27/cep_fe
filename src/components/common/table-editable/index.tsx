// 'use client'
//
// import {
//   EditButton,
//   List,
//   SaveButton,
//   TextField,
//   useEditableTable,
// } from '@refinedev/antd'
// import type { HttpError } from '@refinedev/core'
// import { useTranslate } from '@refinedev/core'
// import { Button, Card, Col, Form, Input, Row, Space, Table, Tree } from 'antd'
// import type { DataNode, TreeProps } from 'antd/es/tree'
// import React from 'react'
// import {
//   FormProvider,
//   useFieldArray,
//   useForm as useHookForm,
// } from 'react-hook-form'
//
// /* =========================
//  * Types
//  * ======================= */
//
// export interface ItemRow {
//   id: string
//   name: string
//   parentId: string | null
//   order: number
// }
//
// interface OrderRow {
//   id: string
//   parentId: string | null
//   order: number
// }
//
// interface OrderFormValues {
//   orderRows: OrderRow[]
// }
//
// export interface EditableTreeTableProps {
//   /** Tên resource refine (ví dụ: "codes") */
//   resource: string
//   /** Lưu thay đổi thứ tự & quan hệ; nếu không truyền, sẽ chỉ log ra console */
//   onOrderSave?: (updates: OrderRow[]) => Promise<void>
//   /** Tiêu đề thẻ (tuỳ chọn) */
//   title?: string
// }
//
// /* =========================
//  * Utilities (pure functions)
//  * ======================= */
//
// /** Tạo map nhanh id->ItemRow */
// function toMap(rows: readonly ItemRow[]): ReadonlyMap<string, ItemRow> {
//   const m = new Map<string, ItemRow>()
//   rows.forEach((r) => m.set(r.id, r))
//   return m
// }
//
// /** Lấy parent của 1 id từ orderRows */
// function getParentId(
//   orderRows: readonly OrderRow[],
//   id: string,
// ): string | null {
//   const current = orderRows.find((r) => r.id === id)
//   return current ? current.parentId : null
// }
//
// /** Lấy max order trong nhóm sibling (cùng parentId) */
// function getMaxOrder(
//   orderRows: readonly OrderRow[],
//   parentId: string | null,
// ): number {
//   const sameParent = orderRows.filter((r) => r.parentId === parentId)
//   if (sameParent.length === 0) return 0
//   return Math.max(...sameParent.map((r) => r.order))
// }
//
// /** Chuẩn hoá lại thứ tự (0..n) trong từng nhóm sibling để tránh trùng, rỗng */
// function normalizeOrder(orderRows: readonly OrderRow[]): OrderRow[] {
//   const byParent = new Map<string | null, OrderRow[]>()
//   orderRows.forEach((r) => {
//     const key = r.parentId
//     const list = byParent.get(key) ?? []
//     list.push(r)
//     byParent.set(key, list)
//   })
//   const result: OrderRow[] = []
//   byParent.forEach((list, parent) => {
//     const sorted = [...list].sort((a, b) => a.order - b.order)
//     sorted.forEach((r, idx) => result.push({ ...r, order: idx }))
//   })
//   return result
// }
//
// /** Đổi parentId & set order cuối cùng trong nhóm mới */
// function moveAsChild(
//   orderRows: readonly OrderRow[],
//   dragId: string,
//   newParentId: string | null,
// ): OrderRow[] {
//   const max = getMaxOrder(orderRows, newParentId)
//   const updated = orderRows.map((r) =>
//     r.id === dragId ? { ...r, parentId: newParentId, order: max + 1 } : r,
//   )
//   return normalizeOrder(updated)
// }
//
// /** Đặt drag node làm sibling của target (cuối nhóm), cùng parentId với target */
// function moveAsSibling(
//   orderRows: readonly OrderRow[],
//   dragId: string,
//   targetId: string,
// ): OrderRow[] {
//   const target = orderRows.find((r) => r.id === targetId)
//   if (!target) return [...orderRows]
//   const newParentId = target.parentId
//   const max = getMaxOrder(orderRows, newParentId)
//   const updated = orderRows.map((r) =>
//     r.id === dragId ? { ...r, parentId: newParentId, order: max + 1 } : r,
//   )
//   return normalizeOrder(updated)
// }
//
// /** Xây dựng TreeData cho AntD Tree từ orderRows + map tên */
// function buildTreeData(
//   orderRows: readonly OrderRow[],
//   nameMap: ReadonlyMap<string, string>,
// ): DataNode[] {
//   // group theo parentId
//   const childrenMap = new Map<string | null, OrderRow[]>()
//   orderRows.forEach((r) => {
//     const list = childrenMap.get(r.parentId) ?? []
//     list.push(r)
//     childrenMap.set(r.parentId, list)
//   })
//   // sort siblings theo order
//   childrenMap.forEach((list, k) => {
//     list.sort((a, b) => a.order - b.order)
//     childrenMap.set(k, list)
//   })
//
//   function build(parent: string | null): DataNode[] {
//     const list = childrenMap.get(parent) ?? []
//     return list.map<DataNode>((r) => ({
//       key: r.id,
//       title: nameMap.get(r.id) ?? r.id,
//       children: build(r.id),
//     }))
//   }
//
//   return build(null)
// }
//
// /** So sánh để lấy các rows thay đổi parentId/order */
// function diffOrder(
//   current: readonly OrderRow[],
//   baseline: readonly OrderRow[],
// ): OrderRow[] {
//   const baseMap = new Map(baseline.map((r) => [r.id, r] as const))
//   return current.filter((r) => {
//     const b = baseMap.get(r.id)
//     if (!b) return true
//     return r.parentId !== b.parentId || r.order !== b.order
//   })
// }
//
// /* =========================
//  * Component
//  * ======================= */
//
// // ...imports giữ nguyên
//
// export default function CommonEditableTreeTable({
//   resource,
//   onOrderSave,
//   title = 'Editable Tree Table',
// }: EditableTreeTableProps) {
//   const t = useTranslate()
//
//   const {
//     tableProps,
//     formProps,
//     isEditing,
//     editButtonProps,
//     saveButtonProps,
//     cancelButtonProps,
//   } = useEditableTable<ItemRow, HttpError>({ resource })
//
//   const serverRows = (tableProps.dataSource ?? []) as ItemRow[]
//
//   // RHF cho order/parent
//   const rhf = useHookForm<OrderFormValues>({
//     defaultValues: { orderRows: [] },
//     mode: 'onChange',
//     shouldUnregister: false,
//   })
//   const { control, getValues, setValue, watch } = rhf
//   const { replace } = useFieldArray({
//     control,
//     name: 'orderRows',
//     keyName: '__key',
//   })
//
//   // baseline để diff khi lưu
//   const baselineRef = React.useRef<OrderRow[]>([])
//   // chữ ký để tránh replace liên tục
//   const prevSigRef = React.useRef<string>('')
//
//   // chỉ replace khi serverRows thực sự đổi (id/parentId/order)
//   React.useEffect(() => {
//     const sig = serverRows
//       .map((r) => `${r.id}|${r.parentId ?? ''}|${r.order}`)
//       .join(',')
//     if (sig !== prevSigRef.current) {
//       const next: OrderRow[] = serverRows.map((r) => ({
//         id: r.id,
//         parentId: r.parentId,
//         order: r.order,
//       }))
//       replace(next)
//       baselineRef.current = next
//       prevSigRef.current = sig
//     }
//   }, [serverRows, replace])
//
//   // name map cho tree title
//   const nameMap = React.useMemo(() => {
//     const m = new Map<string, string>()
//     serverRows.forEach((r) => m.set(r.id, r.name))
//     return m as ReadonlyMap<string, string>
//   }, [serverRows])
//
//   // DÙNG watch để lấy orderRows hiện tại (không dựa trên fields)
//   const orderRows = watch('orderRows')
//
//   // treeData phụ thuộc orderRows + nameMap
//   const treeData = React.useMemo(
//     () => buildTreeData(orderRows, nameMap),
//     [orderRows, nameMap],
//   )
//
//   // kéo-thả
//   const onDrop: NonNullable<TreeProps['onDrop']> = (info) => {
//     const dragId = String(info.dragNode.key)
//     const targetId = String(info.node.key)
//     const current = getValues('orderRows')
//
//     const next = info.dropToGap
//       ? moveAsSibling(current, dragId, targetId)
//       : moveAsChild(current, dragId, targetId)
//
//     setValue('orderRows', next, { shouldDirty: true })
//   }
//
//   const handleSaveOrdering = async () => {
//     const current = getValues('orderRows')
//     const changes = diffOrder(current, baselineRef.current)
//     if (changes.length === 0) {
//       console.log('No ordering changes.')
//       return
//     }
//     if (onOrderSave) {
//       await onOrderSave(changes)
//     } else {
//       console.log('Ordering changes:', changes)
//     }
//     baselineRef.current = current
//   }
//
//   return (
//     <FormProvider {...rhf}>
//       <List
//         title={title}
//         headerButtons={() => (
//           <Space>
//             <Button onClick={handleSaveOrdering}>
//               {t('buttons.save_order', 'Save ordering')}
//             </Button>
//           </Space>
//         )}
//       >
//         <Row gutter={16}>
//           <Col xs={24} md={10}>
//             <Card title={t('labels.structure', 'Structure (drag & drop)')}>
//               <Tree
//                 blockNode
//                 draggable
//                 treeData={treeData}
//                 onDrop={onDrop}
//                 defaultExpandAll
//               />
//             </Card>
//           </Col>
//
//           <Col xs={24} md={14}>
//             <Card>
//               <Form {...formProps}>
//                 <Table<ItemRow>
//                   {...tableProps}
//                   rowKey="id"
//                   // render theo order hiện tại (từ serverRows – không ảnh hưởng effect vì ta so chữ ký riêng)
//                   dataSource={[...serverRows].sort((a, b) => a.order - b.order)}
//                   pagination={tableProps.pagination}
//                 >
//                   <Table.Column<ItemRow>
//                     dataIndex="name"
//                     title={t('code_issue_settings.fields.code', 'Code')}
//                     render={(v, r) =>
//                       isEditing(r.id) ? (
//                         <Form.Item name="name" style={{ margin: 0 }}>
//                           <Input
//                             placeholder={t('placeholders.code', 'Enter code')}
//                           />
//                         </Form.Item>
//                       ) : (
//                         <TextField value={v} />
//                       )
//                     }
//                   />
//                   <Table.Column<ItemRow>
//                     title={t('table.actions', 'Actions')}
//                     render={(_, r) =>
//                       isEditing(r.id) ? (
//                         <Space>
//                           <SaveButton
//                             {...saveButtonProps}
//                             hideText
//                             size="small"
//                           />
//                           <Button {...cancelButtonProps} size="small">
//                             {t('buttons.cancel', 'Cancel')}
//                           </Button>
//                         </Space>
//                       ) : (
//                         <Space>
//                           <EditButton
//                             {...editButtonProps(r.id)}
//                             hideText
//                             size="small"
//                           />
//                         </Space>
//                       )
//                     }
//                   />
//                 </Table>
//               </Form>
//             </Card>
//           </Col>
//         </Row>
//       </List>
//     </FormProvider>
//   )
// }
