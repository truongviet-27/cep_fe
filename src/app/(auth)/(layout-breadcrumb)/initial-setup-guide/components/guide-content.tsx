'use client'

import { AuditOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { useList, useUpdate } from '@refinedev/core'
import { Card, Typography } from 'antd'
import { useCallback, useState } from 'react'

import type { MenuItem } from '../constants'
import type { Manual } from '../types'
import GuideStepCard from './guide-step-card'
import TestIndividualContent from './test-individual-content'

const { Text, Title } = Typography

const ADVANCED_NOTE =
  '高度な機能を設定いただけます。各種設定から必要な設定をご利用ください。'

const ADVANCED_GROUP_LABELS: Record<string, string> = {
  approval_route_setting: '承認ルート設定',
  price_rank_setting: '単価ランク設定',
  user_role: 'ユーザー権限',
}

const ADVANCED_GROUP_ORDER = [
  'approval_route_setting',
  'price_rank_setting',
  'user_role',
]

function getIconForManual(manual: Manual) {
  if (manual.category === 'system') return <AuditOutlined />
  return <UsergroupAddOutlined />
}

function getIconBgForManual(manual: Manual): string {
  if (manual.category === 'system') return '#fa8c16'
  return '#08979c'
}

function getLabelForManual(manual: Manual): string {
  if (manual.category === 'system') return '見積管理'
  return 'アカウント管理'
}

function getLeftColumnBgForManual(manual: Manual): string {
  if (manual.category === 'system') return '#fff7e6'
  return '#e6fffb'
}

function getNotesFromManual(
  manual: Manual,
): Array<{ text: string; italic?: boolean; danger?: boolean }> | undefined {
  const items: Array<{ text: string; italic?: boolean; danger?: boolean }> = []
  if (manual.note) items.push({ text: manual.note, italic: true })
  if (manual.note_warning)
    items.push({ text: manual.note_warning, danger: true })
  return items.length > 0 ? items : undefined
}

interface GuideContentProps {
  selectedItem: MenuItem
  onStatusUpdated?: () => void
  hideTitle?: boolean
}

export default function GuideContent({
  selectedItem,
  onStatusUpdated,
  hideTitle = false,
}: GuideContentProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const typeFilter =
    selectedItem.id === 'basic' || selectedItem.id === 'advanced'
      ? selectedItem.id
      : undefined

  const { data, isLoading, refetch } = useList<Manual>({
    resource: 'initial-setup-guide',
    pagination: { mode: 'client' },
    filters:
      typeFilter != null
        ? [{ field: 'type', operator: 'eq', value: typeFilter }]
        : undefined,
  })

  const { mutate: updateStatus } = useUpdate()

  const manuals = data?.data ?? []
  const isAdvanced = selectedItem.id === 'advanced'
  const isTestIndividual = selectedItem.id === 'test-individual'
  const isTestContinuous = selectedItem.id === 'test-continuous'

  const manualsByGroup: {
    groupKey: string
    groupName: string
    items: Manual[]
  }[] = (() => {
    if (!isAdvanced) return []
    const map = new Map<string, Manual[]>()
    for (const m of manuals) {
      const key = m.group ?? ''
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(m)
    }
    const groupKeys = Array.from(map.keys())
    groupKeys.sort((a, b) => {
      const i = ADVANCED_GROUP_ORDER.indexOf(a)
      const j = ADVANCED_GROUP_ORDER.indexOf(b)
      if (i === -1 && j === -1) return a.localeCompare(b)
      if (i === -1) return 1
      if (j === -1) return -1
      return i - j
    })
    return groupKeys.map((groupKey) => ({
      groupKey,
      groupName: ADVANCED_GROUP_LABELS[groupKey] ?? groupKey,
      items: map.get(groupKey) ?? [],
    }))
  })()

  const handleStatusChange = useCallback(
    (manualId: number, newStatus: 'complete' | 'pending') => {
      setUpdatingId(manualId)
      updateStatus(
        {
          resource: 'initial-setup-guide',
          id: manualId,
          values: { status: newStatus },
        },
        {
          onSettled: () => setUpdatingId(null),
          onSuccess: () => {
            refetch()
            onStatusUpdated?.()
          },
        },
      )
    },
    [updateStatus, refetch, onStatusUpdated],
  )

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!hideTitle && (
        <Title
          level={5}
          style={{
            margin: 0,
            marginBottom: isAdvanced ? 8 : 16,
            flexShrink: 0,
          }}
        >
          {selectedItem.title}
        </Title>
      )}
      {isAdvanced && (
        <Text
          type="secondary"
          style={{
            display: 'block',
            marginBottom: 16,
            fontSize: 12,
            flexShrink: 0,
          }}
        >
          {ADVANCED_NOTE}
        </Text>
      )}

      {isTestIndividual ? (
        <>
          <div
            style={{
              display: 'inline-block',
              background: '#e6f4ff',
              padding: '6px 14px',
              fontSize: 14,
              borderRadius: 8,
              fontWeight: 600,
              color: '#000',
              marginBottom: 16,
              flexShrink: 0,
              width: 'fit-content',
            }}
          >
            対象作業メニュー：見積一覧
          </div>
          <Card size="small" bordered styles={{ body: { padding: 16 } }}>
            <TestIndividualContent />
          </Card>
        </>
      ) : isTestContinuous ? (
        <Card size="small" bordered styles={{ body: { padding: 16 } }} />
      ) : isLoading ? (
        <div style={{ padding: 24, color: '#8c8c8c' }}>読み込み中...</div>
      ) : (
        <Card
          size="small"
          bordered
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          styles={{
            body: {
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: 16,
            },
          }}
        >
          {isAdvanced && manualsByGroup.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
              }}
            >
              {manualsByGroup.map(({ groupKey, groupName, items }) => (
                <div
                  key={groupKey || '__no_group__'}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                  }}
                >
                  {groupName ? (
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#262626',
                        marginBottom: 4,
                      }}
                    >
                      {groupName}
                    </div>
                  ) : null}
                  {items.map((manual) => {
                    const isComplete = manual.status === 'complete'
                    return (
                      <GuideStepCard
                        key={manual.id}
                        showLeftIcon={false}
                        icon={getIconForManual(manual)}
                        iconBg={getIconBgForManual(manual)}
                        leftColumnBg={getLeftColumnBgForManual(manual)}
                        label={getLabelForManual(manual)}
                        title={
                          manual.step != null
                            ? `ステップ${manual.step}：${manual.name}`
                            : manual.name
                        }
                        description={manual.description.replace(/\\n/g, '\n')}
                        notes={getNotesFromManual(manual)}
                        linkHref={manual.link ?? undefined}
                        linkText={
                          manual.breadcrumb
                            ? undefined
                            : manual.link
                              ? '画面へ'
                              : undefined
                        }
                        breadcrumb={manual.breadcrumb ?? undefined}
                        status={manual.status}
                        leftBg="gray"
                        manualId={manual.id}
                        onStatusChange={handleStatusChange}
                        updating={updatingId === manual.id}
                        isComplete={isComplete}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {manuals.map((manual) => {
                const isComplete = manual.status === 'complete'
                return (
                  <GuideStepCard
                    key={manual.id}
                    icon={getIconForManual(manual)}
                    iconBg={getIconBgForManual(manual)}
                    leftColumnBg={getLeftColumnBgForManual(manual)}
                    label={getLabelForManual(manual)}
                    title={
                      manual.step != null
                        ? `ステップ${manual.step}：${manual.name}`
                        : manual.name
                    }
                    description={manual.description.replace(/\\n/g, '\n')}
                    notes={getNotesFromManual(manual)}
                    linkHref={manual.link ?? undefined}
                    linkText={
                      manual.breadcrumb
                        ? undefined
                        : manual.link
                          ? '画面へ'
                          : undefined
                    }
                    breadcrumb={manual.breadcrumb ?? undefined}
                    status={manual.status}
                    leftBg="gray"
                    manualId={manual.id}
                    onStatusChange={handleStatusChange}
                    updating={updatingId === manual.id}
                    isComplete={isComplete}
                  />
                )
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
