'use client'

import { useTranslate } from '@refinedev/core'
import { Card, Flex, Progress, Space, Typography } from 'antd'

import type { MenuItem } from '../constants'
import { DISABLED_MENU_IDS, MENU_ITEMS } from '../constants'

const { Text, Title } = Typography

export type ProgressByType = Record<
  string,
  { completed: number; total: number }
>

interface SidebarMenuProps {
  selectedId: string
  onSelect: (id: string) => void
  progressByType?: ProgressByType
}

export default function SidebarMenu({
  selectedId,
  onSelect,
  progressByType = {},
}: SidebarMenuProps) {
  const t = useTranslate()
  const menuIdKey = (id: string) => id.replace(/-/g, '_')
  return (
    <div style={{ width: 280, flexShrink: 0 }}>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {MENU_ITEMS.map((item: MenuItem) => {
          const isDisabled = DISABLED_MENU_IDS.includes(item.id)
          const isSelected = !isDisabled && selectedId === item.id
          const isDashed = item.type === 'dashed'
          const progress = progressByType[item.id]
          const showProgress =
            progress != null && (item.id === 'basic' || item.id === 'advanced')
          const percent =
            showProgress && progress.total > 0
              ? Math.round((progress.completed / progress.total) * 100)
              : 0
          const countText = showProgress
            ? `${progress.completed}/${progress.total}`
            : null

          return (
            <Card
              key={item.id}
              size="small"
              bordered
              style={{
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                borderStyle: isDashed ? 'dashed' : 'solid',
                borderWidth: 2,
                opacity: isDisabled ? 0.6 : 1,
                ...(isSelected
                  ? {
                      background: 'rgb(0,123,255)',
                      borderColor: 'rgb(0,123,255)',
                    }
                  : {}),
              }}
              styles={{
                body: { padding: 16 },
              }}
              onClick={() => !isDisabled && onSelect(item.id)}
              onKeyDown={(e) => {
                if (isDisabled) return
                if (e.key === 'Enter' || e.key === ' ') onSelect(item.id)
              }}
              tabIndex={isDisabled ? -1 : 0}
              role="button"
              aria-disabled={isDisabled}
            >
              <Title
                level={5}
                style={{
                  margin: 0,
                  marginBottom: 4,
                  fontSize: 15,
                  color: isSelected ? '#fff' : undefined,
                }}
              >
                {t(`initial-setup-guide.menu.${menuIdKey(item.id)}.title`)}
              </Title>
              <Text
                type="secondary"
                style={{
                  fontSize: 11,
                  color: isSelected ? 'rgba(255,255,255,0.85)' : undefined,
                }}
              >
                {t(`initial-setup-guide.menu.${menuIdKey(item.id)}.subtitle`)}
              </Text>
              {showProgress && (
                <div style={{ marginTop: 12 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      display: 'block',
                      marginBottom: 4,
                      color: isSelected ? 'rgba(255,255,255,0.85)' : undefined,
                    }}
                  >
                    {t('initial-setup-guide.progress_status')}
                  </Text>
                  <Flex align="center" gap={8}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Progress
                        percent={percent}
                        size="small"
                        showInfo={false}
                        strokeColor={isSelected ? '#fff' : undefined}
                        trailColor={
                          isSelected ? 'rgba(255,255,255,0.3)' : undefined
                        }
                      />
                    </div>
                    {countText != null && (
                      <Text
                        style={{
                          fontSize: 10,
                          color: isSelected
                            ? 'rgba(255,255,255,0.85)'
                            : undefined,
                          flexShrink: 0,
                        }}
                      >
                        {countText}
                      </Text>
                    )}
                  </Flex>
                </div>
              )}
            </Card>
          )
        })}
      </Space>
    </div>
  )
}
