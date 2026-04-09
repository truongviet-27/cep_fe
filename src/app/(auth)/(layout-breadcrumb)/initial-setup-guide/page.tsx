'use client'

import { RightOutlined } from '@ant-design/icons'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useList, useTranslate } from '@refinedev/core'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Button, Typography } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import GuideContent from './components/guide-content'
import SidebarMenu from './components/sidebar-menu'
import { DISABLED_MENU_IDS, MENU_ITEMS, MENU_ITEMS_VISIBLE } from './constants'
import type { Manual } from './types'

export default function InitialSetupGuidePage() {
  const t = useTranslate()
  const router = useRouter()
  const searchParams = useSearchParams()
  const permission = useUserStore((s) => s.permission)
  const setPermission = useUserStore((s) => s.setPermission)
  const isFirstLogin = !!permission?.is_first_login
  const rawStepFromUrl = searchParams.get('step') ?? MENU_ITEMS[0].id
  const selectedIdFromUrl = DISABLED_MENU_IDS.includes(rawStepFromUrl)
    ? (MENU_ITEMS_VISIBLE[0]?.id ?? MENU_ITEMS[0].id)
    : rawStepFromUrl

  const { data: basicData, refetch: refetchBasic } = useList<Manual>({
    resource: 'initial-setup-guide',
    pagination: { mode: 'server', current: 1, pageSize: 100 },
    filters: [{ field: 'type', operator: 'eq', value: 'basic' }],
  })
  const { data: advancedData, refetch: refetchAdvanced } = useList<Manual>({
    resource: 'initial-setup-guide',
    pagination: { mode: 'server', current: 1, pageSize: 100 },
    filters: [{ field: 'type', operator: 'eq', value: 'advanced' }],
  })

  const basicManuals = basicData?.data ?? []
  const advancedManuals = advancedData?.data ?? []

  const progressByType = useMemo(() => {
    const advancedByGroup = new Map<string, Manual[]>()
    for (const m of advancedManuals) {
      const key = m.group ?? ''
      if (!advancedByGroup.has(key)) advancedByGroup.set(key, [])
      advancedByGroup.get(key)!.push(m)
    }
    const advancedGroupCount = advancedByGroup.size
    const advancedCompletedGroupCount = Array.from(
      advancedByGroup.values(),
    ).filter(
      (items) =>
        items.length > 0 && items.every((m) => m.status === 'complete'),
    ).length

    return {
      basic: {
        total: basicManuals.length,
        completed: basicManuals.filter((m) => m.status === 'complete').length,
      },
      advanced: {
        total: advancedGroupCount,
        completed: advancedCompletedGroupCount,
      },
    }
  }, [basicManuals, advancedManuals])

  const refetchAllManuals = useCallback(() => {
    refetchBasic()
    refetchAdvanced()
  }, [refetchBasic, refetchAdvanced])

  const selectedItem = useMemo(
    () =>
      MENU_ITEMS.find((m) => m.id === selectedIdFromUrl) ??
      MENU_ITEMS_VISIBLE[0] ??
      MENU_ITEMS[0],
    [selectedIdFromUrl],
  )

  const [selectedId, setSelectedId] = useState(selectedIdFromUrl)

  useEffect(() => {
    setSelectedId(selectedIdFromUrl)
  }, [selectedIdFromUrl])

  useEffect(() => {
    if (DISABLED_MENU_IDS.includes(rawStepFromUrl)) {
      const fallbackId = MENU_ITEMS_VISIBLE[0]?.id ?? MENU_ITEMS[0].id
      router.replace(`/initial-setup-guide?step=${fallbackId}`, {
        scroll: false,
      })
    }
  }, [rawStepFromUrl, router])

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id)
      router.replace(`/initial-setup-guide?step=${id}`, { scroll: false })
    },
    [router],
  )

  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  const handleLater = useCallback(() => {
    if (permission) {
      setPermission({ ...permission, is_first_login: false })
    }
    router.replace('/quotas')
  }, [permission, setPermission, router])

  const breadcrumbItems = useMemo(
    () => [
      {
        title: boldText(t('initial-setup-guide.breadcrumb_root')),
      },
      {
        title: boldText(
          t(`initial-setup-guide.menu.${selectedItem.id}.breadcrumb_label`),
          PRIMARY,
        ),
      },
    ],
    [selectedItem.id, t],
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: 0,
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <div
        style={{
          marginTop: 6,
          marginBottom: 6,
          paddingLeft: 18,
          paddingRight: 18,
        }}
      >
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      </div>

      <div
        role="main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 24px',
          background: '#fff',
          minHeight: 'calc(100vh - 168px)',
          flex: 1,
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 24,
            alignItems: 'stretch',
            width: '100%',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <SidebarMenu
            selectedId={selectedId}
            onSelect={handleSelect}
            progressByType={progressByType}
          />

          <div
            style={{
              width: 1,
              flexShrink: 0,
              alignSelf: 'stretch',
              minHeight: '100%',
              background: 'rgba(0,0,0,0.06)',
            }}
          />

          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
                flexShrink: 0,
              }}
            >
              <Typography.Title level={5} style={{ margin: 0 }}>
                {t(`initial-setup-guide.menu.${selectedItem.id}.title`)}
              </Typography.Title>
              <Button
                type="default"
                onClick={isFirstLogin ? handleLater : handleBack}
                style={{
                  background: '#fff',
                  borderColor: PRIMARY,
                  color: PRIMARY,
                  fontWeight: 600,
                }}
              >
                {isFirstLogin
                  ? t('initial-setup-guide.button_later')
                  : t('buttons.back')}
              </Button>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <GuideContent
                selectedItem={selectedItem}
                onStatusUpdated={refetchAllManuals}
                hideTitle
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
