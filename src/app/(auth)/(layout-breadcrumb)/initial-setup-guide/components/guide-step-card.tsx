'use client'

import { ExportOutlined } from '@ant-design/icons'
import { useTranslate } from '@refinedev/core'
import { Button, Dropdown } from 'antd'
import type { ReactNode } from 'react'

export interface GuideStepCardProps {
  icon: ReactNode
  label: string
  title: string
  description: string
  notes?: Array<{ text: string; italic?: boolean; danger?: boolean }>
  linkHref?: string
  linkText?: string
  breadcrumb?: string
  status?: 'complete' | 'pending'
  leftBg?: 'gray' | 'orange' | 'cyan'
  manualId?: number
  onStatusChange?: (manualId: number, status: 'complete' | 'pending') => void
  updating?: boolean
  isComplete?: boolean
  disableStatusChange?: boolean
  iconBg?: string
  leftColumnBg?: string
  showLeftIcon?: boolean
}

const LEFT_BG_STYLES = {
  gray: {
    background: '#f5f5f5',
    iconColor: '#999',
    labelColor: '#666',
    labelFontWeight: 700,
  },
  orange: {
    background: '#fff7e6',
    iconColor: '#fa8c16',
    labelColor: '#d46b08',
    labelFontWeight: 700,
  },
  cyan: {
    background: '#e6fffb',
    iconColor: '#13c2c2',
    labelColor: '#08979c',
    labelFontWeight: 700,
  },
} as const

export default function GuideStepCard({
  icon,
  label,
  title,
  description,
  notes,
  linkHref,
  linkText,
  breadcrumb,
  status = 'pending',
  leftBg = 'gray',
  manualId,
  onStatusChange,
  updating = false,
  isComplete = false,
  disableStatusChange = false,
  iconBg,
  leftColumnBg,
  showLeftIcon = true,
}: GuideStepCardProps) {
  const t = useTranslate()
  const statusOptions: Array<{ value: 'pending' | 'complete'; label: string }> =
    [
      { value: 'pending', label: t('initial-setup-guide.status_pending') },
      { value: 'complete', label: t('initial-setup-guide.status_complete') },
    ]
  const leftStyle = LEFT_BG_STYLES[leftBg]
  const grayedOut = isComplete
  const rightBg = grayedOut
    ? '#f0f0f0'
    : status === 'complete'
      ? '#fafafa'
      : undefined
  const canChangeStatus =
    !disableStatusChange &&
    manualId != null &&
    onStatusChange != null &&
    !updating
  const iconBoxBg = grayedOut ? undefined : iconBg
  const iconBoxGrayedOut = grayedOut
  const leftBgColor = grayedOut
    ? '#e8e8e8'
    : (leftColumnBg ?? leftStyle.background)
  const labelColor = grayedOut ? '#8c8c8c' : (iconBg ?? leftStyle.labelColor)

  return (
    <div
      style={{
        display: 'flex',
        border: `1px solid ${grayedOut ? '#e8e8e8' : '#d9d9d9'}`,
        borderRadius: 6,
        overflow: 'hidden',
        background: grayedOut ? '#f5f5f5' : '#fff',
        boxShadow: grayedOut ? 'none' : '0 1px 2px 0 rgba(0,0,0,0.03)',
      }}
    >
      {showLeftIcon && (
        <div
          style={{
            width: 128,
            minWidth: 128,
            background: leftBgColor,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            borderRight: `1px solid ${grayedOut ? '#e0e0e0' : '#d9d9d9'}`,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '20%',
              background: iconBoxGrayedOut
                ? '#f5f5f5'
                : (iconBoxBg ?? leftStyle.background),
              border: iconBoxGrayedOut ? '1px solid #d9d9d9' : undefined,
              color: iconBoxGrayedOut
                ? '#8c8c8c'
                : iconBoxBg
                  ? '#fff'
                  : leftStyle.iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
              fontSize: 22,
            }}
          >
            {icon}
          </div>
          <span
            style={{
              fontSize: 10,
              color: labelColor,
              fontWeight: leftStyle.labelFontWeight,
            }}
          >
            {label}
          </span>
        </div>
      )}

      <div
        style={{
          flex: 1,
          padding: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          background: rightBg,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: grayedOut
                ? '#8c8c8c'
                : status === 'complete'
                  ? '#000'
                  : '#000',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: grayedOut
                ? '#b0b0b0'
                : status === 'complete'
                  ? '#000'
                  : '#000',
              marginTop: 4,
              whiteSpace: 'pre-line',
            }}
          >
            {description}
          </div>
          {notes?.map((note, i) => (
            <div
              key={i}
              style={{
                fontSize: 10,
                marginTop: 4,
                fontStyle: note.italic ? 'italic' : undefined,
                color: grayedOut ? '#b0b0b0' : note.danger ? '#ff4d4f' : '#000',
              }}
            >
              {note.text}
            </div>
          ))}
          {breadcrumb ? (
            linkHref ? (
              <a
                href={linkHref}
                style={{
                  fontSize: 12,
                  color: grayedOut ? '#8c8c8c' : '#1677ff',
                  marginTop: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  textDecoration: 'underline',
                }}
              >
                <ExportOutlined /> {breadcrumb}
              </a>
            ) : (
              <span
                style={{
                  fontSize: 12,
                  color: grayedOut ? '#8c8c8c' : '#000',
                  marginTop: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <ExportOutlined /> {breadcrumb}
              </span>
            )
          ) : linkHref && linkText ? (
            <a
              href={linkHref}
              style={{
                fontSize: 12,
                color: grayedOut ? '#8c8c8c' : '#1677ff',
                marginTop: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                textDecoration: 'underline',
              }}
            >
              <ExportOutlined /> {linkText}
            </a>
          ) : null}
        </div>
        <Dropdown
          menu={{
            items: statusOptions
              .filter((opt) => opt.value !== status)
              .map((opt) => ({
                key: opt.value,
                label: opt.label,
                onClick: () => {
                  if (manualId != null && onStatusChange) {
                    onStatusChange(manualId, opt.value)
                  }
                },
              })),
          }}
          trigger={['click']}
          disabled={!canChangeStatus || updating}
        >
          <Button
            size="small"
            loading={updating}
            disabled={!canChangeStatus || updating}
            style={{
              flexShrink: 0,
              fontSize: 12,
              background: status === 'complete' ? '#bfbfbf' : '#fa8c16',
              borderColor: status === 'complete' ? '#bfbfbf' : '#fa8c16',
              color: '#fff',
            }}
          >
            {status === 'complete'
              ? t('initial-setup-guide.status_complete')
              : t('initial-setup-guide.status_pending')}{' '}
            <span style={{ fontSize: 8, marginLeft: 2 }}>▼</span>
          </Button>
        </Dropdown>
      </div>
    </div>
  )
}
