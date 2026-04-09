'use client'

import { useTranslate } from '@refinedev/core'
import { Flex, Typography } from 'antd'
import type { CSSProperties, ReactNode } from 'react'

const { Text } = Typography

const stepCardStyle: CSSProperties = {
  border: '1px solid #1677ff',
  borderRadius: 6,
  padding: 16,
  marginBottom: 16,
  background: '#fff',
}

const subStepStyle: CSSProperties = {
  border: '1px solid #1677ff',
  borderRadius: 4,
  padding: 12,
  marginTop: 12,
  background: '#fff',
}

const badgeStyle = (bg: string, color: string): CSSProperties => ({
  fontSize: 12,
  padding: '4px 10px',
  borderRadius: 4,
  fontWeight: 700,
  background: bg,
  color,
  flexShrink: 0,
  minWidth: 80,
  textAlign: 'center',
  display: 'inline-block',
})

const BADGES = {
  gray: badgeStyle('#f0f0f0', '#666'),
  blue: badgeStyle('#e6f4ff', '#1677ff'),
  yellow: badgeStyle('#fffbe6', '#d4a907'),
  red: badgeStyle('#fff2f0', '#ef5350'),
  green: badgeStyle('#f6ffed', '#52c41a'),
}

function StepRow({
  title,
  desc,
  badges,
  titleSize = 16,
}: {
  title: string
  desc: ReactNode
  badges: ReactNode
  titleSize?: number
}) {
  return (
    <Flex
      gap={16}
      justify="space-between"
      align="center"
      style={{ width: '100%' }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, marginBottom: 8, fontSize: titleSize }}>
          {title}
        </div>
        <Text
          style={{
            fontSize: 12,
            lineHeight: 1.6,
            display: 'block',
            whiteSpace: 'pre-line',
            color: '#000',
          }}
        >
          {desc}
        </Text>
      </div>
      <Flex vertical gap={6} align="center" style={{ minWidth: 80 }}>
        {badges}
      </Flex>
    </Flex>
  )
}

function Badge({
  style,
  children,
}: {
  style: CSSProperties
  children: string
}) {
  return <span style={style}>{children}</span>
}

const BASE = 'initial-setup-guide.test_individual'

export default function TestIndividualContent() {
  const t = useTranslate()
  const step1ChildLines = t(`${BASE}.step1_child_desc`).split('\n')
  const step5Line1 = t(`${BASE}.step5_desc_line1`)
  const step5LinkLabel = t(`${BASE}.step5_link_label`)
  const [step5Prefix, step5Suffix] = step5Line1.split(step5LinkLabel)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={stepCardStyle}>
        <StepRow
          title={t(`${BASE}.step1_title`)}
          desc={t(`${BASE}.step1_desc`)}
          badges={
            <Badge style={BADGES.gray}>{t(`${BASE}.badge_creating`)}</Badge>
          }
        />
        <div style={subStepStyle}>
          <StepRow
            title={t(`${BASE}.step1_child_title`)}
            desc={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {step1ChildLines.map((line, index) => (
                  <Text
                    key={`${line}-${index}`}
                    strong={/^[①②③]/.test(line.trim())}
                    style={{
                      fontSize: 12,
                      lineHeight: 1.6,
                      whiteSpace: 'pre-line',
                      color: '#000',
                    }}
                  >
                    {line}
                  </Text>
                ))}
              </div>
            }
            badges={
              <>
                <Badge style={BADGES.yellow}>
                  {t(`${BASE}.badge_waiting_approval`)}
                </Badge>
                <Badge style={BADGES.red}>{t(`${BASE}.badge_rejected`)}</Badge>
              </>
            }
            titleSize={14}
          />
        </div>
      </div>

      <div style={stepCardStyle}>
        <StepRow
          title={t(`${BASE}.step2_title`)}
          desc={t(`${BASE}.step2_desc`)}
          badges={
            <>
              <Badge style={BADGES.gray}>{t(`${BASE}.badge_creating`)}</Badge>
              <Badge style={BADGES.blue}>{t(`${BASE}.badge_approved`)}</Badge>
            </>
          }
        />
      </div>

      <div style={stepCardStyle}>
        <StepRow
          title={t(`${BASE}.step3_title`)}
          desc={
            <>
              {t(`${BASE}.step3_desc_line1`)}
              <br />
              {t(`${BASE}.step3_desc_line2`)}
              <br />
              {t(`${BASE}.step3_desc_line3`)}
            </>
          }
          badges={<Badge style={BADGES.blue}>{t(`${BASE}.badge_sent`)}</Badge>}
        />
      </div>

      <div style={stepCardStyle}>
        <StepRow
          title={t(`${BASE}.step4_title`)}
          desc={t(`${BASE}.step4_desc`)}
          badges={<Badge style={BADGES.blue}>{t(`${BASE}.badge_sent`)}</Badge>}
        />
      </div>

      <div style={stepCardStyle}>
        <StepRow
          title={t(`${BASE}.step5_title`)}
          desc={
            <>
              {step5Prefix ?? step5Line1}
              {step5Prefix !== undefined && step5Suffix !== undefined ? (
                <a
                  href="/agreed-prices"
                  style={{
                    color: '#1677ff',
                    textDecoration: 'underline',
                  }}
                >
                  {step5LinkLabel}
                </a>
              ) : null}
              {step5Suffix ?? ''}
              <br />
              {t(`${BASE}.step5_desc_line2`)}
            </>
          }
          badges={
            <Badge style={BADGES.green}>{t(`${BASE}.badge_order`)}</Badge>
          }
        />
      </div>
    </div>
  )
}
