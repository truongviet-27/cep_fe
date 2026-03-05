'use client'

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
      align="flex-start"
      style={{ width: '100%' }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, marginBottom: 8, fontSize: titleSize }}>
          {title}
        </div>
        <Text
          type="secondary"
          style={{ fontSize: 12, lineHeight: 1.6, display: 'block' }}
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

export default function TestIndividualContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={stepCardStyle}>
        <StepRow
          title="ステップ１：見積書の作成"
          desc="見積作成の新規作成とテンプレート作成から見積書を作成します。※承認ルート設定がある場合は、承認ルートを選択します。"
          badges={<Badge style={BADGES.gray}>作成中</Badge>}
        />
        <div style={subStepStyle}>
          <StepRow
            title="ステップ１-１：見積書の承認・差戻"
            desc="承認待ステータスにある見積を承認・差戻します。※差戻の場合は、差戻の理由の記載が必須となります。"
            badges={<Badge style={BADGES.yellow}>承認待</Badge>}
            titleSize={14}
          />
        </div>
        <div style={subStepStyle}>
          <StepRow
            title="ステップ１-２：見積書の差戻対応"
            desc="差戻理由を確認して、見積を訂正し再度承認申請します。"
            badges={<Badge style={BADGES.red}>差戻</Badge>}
            titleSize={14}
          />
        </div>
      </div>

      <div style={stepCardStyle}>
        <StepRow
          title="ステップ２：見積書の送信"
          desc="作成（または承認）した見積書を顧客へ送付します。※作成者および管理者のみ送信可能です。"
          badges={
            <>
              <Badge style={BADGES.gray}>作成中</Badge>
              <Badge style={BADGES.blue}>承認済</Badge>
            </>
          }
        />
      </div>

      <div style={stepCardStyle}>
        <StepRow
          title="ステップ３：見積の再見積"
          desc={
            <>
              顧客からの再見積依頼に対し、再見積ボタンから再見積作成を行います。
              <br />
              ※再見積を作成した際は、元の見積書に追加されて再見積書が作成され、作成中のに移動します。
              <br />
              ※再見積書が作成された同時に元の見積書のステータスが再見積に移動します。
            </>
          }
          badges={<Badge style={BADGES.blue}>送信済</Badge>}
        />
      </div>

      <div style={stepCardStyle}>
        <StepRow
          title="ステップ４：見積の受注・失注の管理"
          desc="送信済の見積に対し、受注・失注の判定を下します。"
          badges={<Badge style={BADGES.blue}>送信済</Badge>}
        />
      </div>

      <div style={stepCardStyle}>
        <StepRow
          title="ステップ５：継続見積の管理（契約区分：継続の場合）"
          desc={
            <>
              契約区分が「継続」で受注した見積は、継続見積一覧にコピーされ、見積適用期間の管理が可能となります。
              <br />
              ※デフォルト設定は無期限となっているので、適用期限管理がしたい場合は変更します。
            </>
          }
          badges={<Badge style={BADGES.green}>受注</Badge>}
        />
      </div>
    </div>
  )
}
