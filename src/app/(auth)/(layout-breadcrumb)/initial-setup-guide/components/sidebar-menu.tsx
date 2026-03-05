'use client'

import { Card, Flex, Progress, Space, Typography } from 'antd'

import type { MenuItem } from '../constants'
import { MENU_ITEMS } from '../constants'

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
  return (
    <div style={{ width: 280, flexShrink: 0 }}>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {MENU_ITEMS.map((item: MenuItem) => {
          const isSelected = selectedId === item.id
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
                cursor: 'pointer',
                borderStyle: isDashed ? 'dashed' : 'solid',
                borderWidth: 2,
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
              onClick={() => onSelect(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(item.id)
              }}
              tabIndex={0}
              role="button"
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
                {item.title}
              </Title>
              <Text
                type="secondary"
                style={{
                  fontSize: 11,
                  color: isSelected ? 'rgba(255,255,255,0.85)' : undefined,
                }}
              >
                {item.subtitle}
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
                    進捗状況
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
