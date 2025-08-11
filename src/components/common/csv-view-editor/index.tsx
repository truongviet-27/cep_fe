'use client'

import { Input, message, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Encoding from 'encoding-japanese'
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
  onBack?: () => void
  onNext?: () => void
}

export default function CsvViewerEditor({ source }: Props) {
  const [rows, setRows] = useState<Row[]>([])
  const [headers, setHeaders] = useState<string[]>([])

  useEffect(() => {
    const run = async () => {
      const text = await decodeArrayBuffer(source.buffer, source.encoding)
      const parsed = Papa.parse<Row>(text, {
        header: true,
        skipEmptyLines: true,
      })
      if (parsed.errors.length) {
        console.warn(parsed.errors)
        message.warning('CSV có một vài dòng lỗi. Đã cố gắng bỏ qua.')
      }
      const data = parsed.data as Row[]
      setRows(data)
      setHeaders(parsed.meta.fields ?? (data[0] ? Object.keys(data[0]) : []))
    }
    run()
  }, [source])

  const columns: ColumnsType<Row> = useMemo(() => {
    return headers.map((key) => ({
      title: key,
      dataIndex: key,
      key,
      render: (_val, _record, rowIndex) => (
        <Input
          size="small"
          value={rows[rowIndex]?.[key] ?? ''}
          onChange={(e) => {
            const next = [...rows]
            next[rowIndex] = { ...next[rowIndex], [key]: e.target.value }
            setRows(next)
          }}
        />
      ),
    }))
  }, [headers, rows])

  return (
    <div className="space-y-3">
      <Table<Row>
        size="small"
        bordered
        pagination={{ pageSize: 10 }}
        rowKey={(_, i) => String(i)}
        columns={columns}
        dataSource={rows}
        scroll={{ x: true }}
      />
    </div>
  )
}

async function decodeArrayBuffer(ab: ArrayBuffer, enc: Enc) {
  try {
    const td = new TextDecoder(enc === 'utf-8' ? 'utf-8' : 'shift_jis')
    return td.decode(ab)
  } catch {
    const uint8 = new Uint8Array(ab)
    return Encoding.convert(uint8, {
      to: 'UNICODE',
      from: enc === 'utf-8' ? 'UTF8' : 'SJIS',
      type: 'string',
    }) as string
  }
}
