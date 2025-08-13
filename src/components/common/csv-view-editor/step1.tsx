'use client'

import { robustDecode } from '@utility/encoding-sjis'
import { Input, message, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Papa from 'papaparse'
import React, { useEffect, useMemo, useState } from 'react'

type Row = Record<string, string>
type Enc = 'utf-8' | 'shift_jis'

type Source = {
  buffer: ArrayBuffer
  encoding: Enc
  fileName?: string
}

type Props = {
  source: Source
}

export default function CsvViewEditorStep1({ source }: Props) {
  const [rows, setRows] = useState<Row[]>([])
  const [headers, setHeaders] = useState<string[]>([])

  useEffect(() => {
    const run = async () => {
      try {
        const text = await robustDecode(source.buffer, source.encoding)
        const parsed = Papa.parse<Row>(text, {
          header: true,
          skipEmptyLines: true,
        })

        if (parsed.errors.length) {
          console.warn(parsed.errors)
          message.warning('CSV có một vài dòng lỗi. Đã cố gắng bỏ qua.')
        }

        const randKey = (() => {
          const prefix = `r_${Date.now().toString(36)}_`
          return () =>
            crypto?.randomUUID?.() ??
            prefix + Math.random().toString(36).slice(2, 10)
        })()

        const data: Row[] = (parsed.data as Row[]).map((r) => ({
          ...r,
          __key: randKey(),
        }))

        const hdrs =
          parsed.meta.fields?.filter((h) => h !== '__key') ??
          (data[0] ? Object.keys(data[0]).filter((h) => h !== '__key') : [])

        setRows(data)
        setHeaders(hdrs)
      } catch (e) {
        console.error(e)
        message.error('Không thể giải mã/parse CSV.')
        setRows([])
        setHeaders([])
      }
    }
    run()
  }, [source.buffer, source.encoding])

  const onCellChange = (rowKey: string, col: string, val: string) => {
    setRows((prev) =>
      prev.map((r) => (r.__key === rowKey ? { ...r, [col]: val } : r)),
    )
  }

  const columns: ColumnsType<Row> = useMemo(
    () =>
      headers.map((key) => ({
        title: key,
        dataIndex: key,
        key,
        render: (_val, record) => (
          <Input
            size="small"
            value={record[key] ?? ''}
            onChange={(e) => onCellChange(record.__key, key, e.target.value)}
          />
        ),
      })),
    [headers, rows],
  )

  return (
    <Table<Row>
      size="small"
      bordered
      pagination={{ pageSize: 10 }}
      rowKey="__key"
      columns={columns}
      dataSource={rows}
      scroll={{ x: true }}
    />
  )
}
